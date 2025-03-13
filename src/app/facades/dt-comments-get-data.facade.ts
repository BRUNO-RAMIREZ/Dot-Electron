/**
 * @author Francisco Camacho
 */
import {Injectable, Injector} from '@angular/core';
import {
  BulletinDataWrapper,
  CommentSourceIdentifiers,
  EntityMessageResponse,
  EntityMessageWrapper,
  Pagination,
  ResourceGraphResponse,
  ResourceRegistryResponse
} from '@set-social-services/comment-api';
import {CommentMessagesEffectsFacade, CommentResourceGraphsEffectsFacade} from '@set-social-services/comment-core';
import {UserAvatarService} from '@set-social-services/common-core';
import {SsDecompressService} from '@set-social-services/social-text';
import {WallItemService} from '@set-social-services/wall-api';
import {forkJoin, Observable, of, timer} from 'rxjs';
import {catchError, delay, map, mergeMap, switchMap, take} from 'rxjs/operators';

@Injectable()
export class DtCommentsGetDataFacade extends WallItemService {

  private _commentResourceGraphsEffectsFacade: CommentResourceGraphsEffectsFacade;
  private _commentMessagesEffectsFacade: CommentMessagesEffectsFacade;
  private _ssDecompressService: SsDecompressService;
  private _userAvatarService: UserAvatarService;

  private readonly _ANNOTATION_ID_RESOURCE_NAME: string = 'annotationId';
  private readonly _EMPTY_MESSAGE_IDS_DELAY: number = 200;
  private readonly _INDEXING_DELAY: number = 300;
  private readonly _TAKE_ONE: number = 1;

  constructor(private _injector: Injector) {
    super();
    this._commentResourceGraphsEffectsFacade = this._injector.get(CommentResourceGraphsEffectsFacade);
    this._commentMessagesEffectsFacade = this._injector.get(CommentMessagesEffectsFacade);
    this._ssDecompressService = this._injector.get(SsDecompressService);
    this._userAvatarService = this._injector.get(UserAvatarService);
  }

  public getData(identifiers: string[] | null): Observable<Map<string, BulletinDataWrapper>[]> {
    if (!identifiers) {
      return of();
    }

    const dataIdentifiers: Map<number, string> = new Map<number, string>();
    const parentIdentifiers: string [] = [];

    identifiers.forEach((identifier: string) => {
      const identifierObject: CommentSourceIdentifiers = JSON.parse(identifier) as CommentSourceIdentifiers;
      const messageId: number | undefined = identifierObject.cmtMessageId;

      !!messageId ? dataIdentifiers.set(messageId, identifier) : parentIdentifiers.push(identifier);
    });

    const messageIds: number[] = Array.from(dataIdentifiers.keys());

    return this._getMessages(messageIds).pipe(
      switchMap((messages: EntityMessageResponse[]) =>
        forkJoin({
          messages: of(messages),
          resourceGraphs: this._getResourceGraphs(messages)
        })
      ),
      switchMap(({messages, resourceGraphs}: { messages: EntityMessageResponse[], resourceGraphs: ResourceGraphResponse[] }) => {
        const bulletinDataWrappers: BulletinDataWrapper[] = messages.map((message: EntityMessageResponse) =>
          this._buildBulletinDataWrapper(message, resourceGraphs)
        );

        const userIds: string[] = bulletinDataWrappers
          .map((bulletin: BulletinDataWrapper) => bulletin.message?.entityMessageResponse.user.userId)
          .filter((userId: string | undefined): userId is string => !!userId);

        return forkJoin({
          bulletinDataWrappers: of(bulletinDataWrappers),
          avatarMap: !!userIds.length ? this._userAvatarService.findAvatarByUserIds(userIds) : of(new Map<string, Blob>())
        });
      }),
      map(({bulletinDataWrappers, avatarMap}: { bulletinDataWrappers: BulletinDataWrapper[], avatarMap: Map<string, Blob> }) => {
        bulletinDataWrappers.forEach((bulletin: BulletinDataWrapper) => {
          const userId: string | undefined = bulletin.message?.entityMessageResponse.user.userId;
          if (userId && avatarMap.has(userId)) {
            bulletin.avatar = avatarMap.get(userId) || undefined;
          }
        });

        return bulletinDataWrappers
          .map((bulletinDataWrapper: BulletinDataWrapper) => {
            const messageId: number | undefined = bulletinDataWrapper.message?.entityMessageResponse.messageId;
            const identifier: string | undefined = messageId ? dataIdentifiers.get(messageId) : undefined;

            if (!identifier) {
              return;
            }

            bulletinDataWrapper = this._loadExternalIdentifiers(identifier, bulletinDataWrapper);
            const responseMap: Map<string, BulletinDataWrapper> = new Map<string, BulletinDataWrapper>();
            responseMap.set(identifier, bulletinDataWrapper);
            return responseMap;
          }).filter((responseMap: Map<string, BulletinDataWrapper> | undefined): responseMap is Map<string, BulletinDataWrapper> => !!responseMap);
      }),
      map((responseMapArray: Map<string, BulletinDataWrapper>[]) => {
        parentIdentifiers.forEach((parentIdentifier: string) => {
          const responseMap: Map<string, BulletinDataWrapper> = new Map<string, BulletinDataWrapper>();
          responseMap.set(parentIdentifier, new BulletinDataWrapper());
          responseMapArray.push(responseMap);
        });

        return responseMapArray;
      })
    );
  }

  private _getMessages(messageIds: number[]): Observable<EntityMessageResponse[]> {
    if (!messageIds.length) {
      return of([]).pipe(delay(this._EMPTY_MESSAGE_IDS_DELAY));
    }

    return timer(this._INDEXING_DELAY).pipe(
      take(this._TAKE_ONE),
      mergeMap(() => this._commentMessagesEffectsFacade.loadMessagesByMessageIds(messageIds).pipe(
        map((response: Pagination<EntityMessageResponse>) => response.collection),
        catchError(() => of([]))
      ))
    );
  }

  private _getResourceGraphs(messageResponses: EntityMessageResponse[]): Observable<ResourceGraphResponse[]> {
    const resourceGraphIds: number[] = messageResponses.map((messageResponse: EntityMessageResponse) => messageResponse.resourceGraphId);

    if (!resourceGraphIds.length) {
      return of([]);
    }

    return this._commentResourceGraphsEffectsFacade.readBulkResourceGraph({resourceGraphIds: resourceGraphIds}).pipe(
      map((resourceGraphResponses: ResourceGraphResponse[]) => this._filterResources(resourceGraphResponses)),
      catchError(() => of([]))
    );
  }

  private _filterResources(resourceGraphResponses: ResourceGraphResponse[]): ResourceGraphResponse[] {
    resourceGraphResponses.forEach((resourceGraphResponse: ResourceGraphResponse) =>
      resourceGraphResponse.resources = resourceGraphResponse.resources.filter((resourceRegistryResponse: ResourceRegistryResponse) =>
        this._isValidResourceName(resourceRegistryResponse.resourceName)
      ));

    return resourceGraphResponses;
  }

  private _isValidResourceName(resourceName: string): boolean {
    return resourceName !== this._ANNOTATION_ID_RESOURCE_NAME;
  }

  private _buildBulletinDataWrapper(entityMessageResponse: EntityMessageResponse,
                                    resourceGraphs: ResourceGraphResponse[]): BulletinDataWrapper {
    const entityMessageWrapper: EntityMessageWrapper = new EntityMessageWrapper();

    entityMessageWrapper.entityMessageResponse = entityMessageResponse;
    entityMessageWrapper.chunks = {};
    entityMessageWrapper.contentText = this._ssDecompressService.getContentText(entityMessageResponse.content);

    const bulletinDataWrapper: BulletinDataWrapper = new BulletinDataWrapper();

    bulletinDataWrapper.message = entityMessageWrapper;
    bulletinDataWrapper.resourceGraph = resourceGraphs.find((resourceGraph: ResourceGraphResponse) => resourceGraph.resourceGraphId === entityMessageResponse.resourceGraphId);

    return bulletinDataWrapper;
  }

  private _loadExternalIdentifiers(identifiers: string, bulletinDataWrapper: BulletinDataWrapper): BulletinDataWrapper {
    return {
      ...bulletinDataWrapper,
      externalIdentifiers: identifiers
    };
  }
}
