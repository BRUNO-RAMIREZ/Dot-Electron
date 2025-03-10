import {Injectable, OnDestroy, Renderer2} from '@angular/core';
import {buildCommentResourceGraph} from '@doodle/core';
import {DdResourceRequest} from '@doodle/http-client';
import {DdBoardService} from '@doodle/viewer';
import {
  CommentResourceRegistryUpdateInput,
  CommentUpdateCaseIdInput,
  CommentUserMessageInput,
  MessageResponse,
  ResourceGraphResponse
} from '@set-social-services/comment-api';
import {
  CommentContainerFacade,
  CommentMessageInputContainerFacade,
  CommentMessagesEffectsFacade,
  CommentResourceGraphsEffectsFacade
} from '@set-social-services/comment-core';
import {ScopedProps, withScopedProps} from '@set-social-services/common-core';
import {Observable, Subject} from 'rxjs';
import {debounceTime, filter, map, take, takeUntil, tap} from 'rxjs/operators';
import {VERSION_ID} from '../constants';
import {DtDocumentService} from './dt-document.service';

/**
 * @author Bruno Ramirez
 */
@Injectable()
export class DtCommentsService implements OnDestroy {
  public hasContentCommentInput: boolean;

  private _commentSentSubject: Subject<void>;
  private _resourceGraphId: number;
  private _unsubscribe: Subject<void>;

  private readonly _COMMENTS_CONTAINER_CLASS: string = 'dd-comments-container';
  private readonly _DEBOUNCE_TIME: number = 200;
  private readonly _ZERO_WIDTH_SPACE_CHARACTER: string = '\u200B';

  constructor(private _commentResourceGraphsEffectsFacade: CommentResourceGraphsEffectsFacade,
              private _commentMessageInputContainerFacade: CommentMessageInputContainerFacade,
              private _commentMessagesEffectsFacade: CommentMessagesEffectsFacade,
              private _ssCommentContainerFacade: CommentContainerFacade,
              private _dtDocumentService: DtDocumentService,
              private _ddBoardService: DdBoardService,
              private _renderer: Renderer2) {
    this.hasContentCommentInput = false;
    this._commentSentSubject = new Subject<void>();
    this._resourceGraphId = 0;
    this._unsubscribe = new Subject<void>();
  }

  ngOnDestroy(): void {
    this._finalize();
  }

  public listenCommentPosted(): Observable<ScopedProps<{ messageResponse: MessageResponse; userMessages?: CommentUserMessageInput[]; }>> {
    return this._ssCommentContainerFacade.commentActionCreateSuccess()
      .pipe(
        take(1),
        takeUntil(this._unsubscribe),
        tap(scopeProps => this._resourceGraphId = scopeProps.payload.messageResponse.resourceGraphId),
        tap(() => this.hideCommentsLayer()));
  }

  public updateCommentResourceGraphs(newResourceGraph: DdResourceRequest[]): Observable<ResourceGraphResponse[]> {
    const commentResourceToUpdate: CommentResourceRegistryUpdateInput[] = [{
      resourceGraphId: this._resourceGraphId,
      resourceId: buildCommentResourceGraph(newResourceGraph).identifier,
      resources: newResourceGraph
    }];

    return this._commentResourceGraphsEffectsFacade.updateResourceGraphs(commentResourceToUpdate)
      .pipe(
        take(1),
        takeUntil(this._unsubscribe));
  }

  public updateCommentCaseIdAndCaseName(newResourceGraph: DdResourceRequest[]): Observable<void> {
    const oldCaseId = this._getCaseIdFromResourceGraph(this._dtDocumentService.getInitialDocumentResources());
    const newCaseId = this._getCaseIdFromResourceGraph(newResourceGraph);
    const caseName = `document_version_${newCaseId}`;

    return this._commentMessagesEffectsFacade.upsertCaseIdOfMessages(
      this._buildCommentUpdateCaseIdInput(oldCaseId),
      newCaseId,
      caseName)
      .pipe(take(1),
        takeUntil(this._unsubscribe));
  }

  public hideCommentsLayer(): void {
    const boardComponentRef = this._ddBoardService.getBoardComponentRef();
    const commentsElement = boardComponentRef?.location.nativeElement.getElementsByClassName(this._COMMENTS_CONTAINER_CLASS)[0];
    commentsElement && this._renderer.setStyle(commentsElement, 'display', 'none');
  }

  public listenCommentSendOptionClicked(): Observable<void> {
    return this._ddBoardService.listenCommentSendOption()
      .pipe(
        take(1),
        takeUntil(this._unsubscribe),
        tap(() => {
          this._commentSentSubject.next();
          this.hideCommentsLayer();
        }));
  }

  public listenCommentInputContent(resources: DdResourceRequest[]): Observable<Document> {
    const commentResourceGraph = buildCommentResourceGraph(resources);

    return this._commentMessageInputContainerFacade.getMessageInputContent(withScopedProps(commentResourceGraph.identifier))
      .pipe(
        takeUntil(this._unsubscribe),
        takeUntil(this._commentSentSubject),
        debounceTime(this._DEBOUNCE_TIME),
        filter(htmlString => !!htmlString),
        map((htmlString) => this._getDomElement(htmlString)),
        tap((domElement: Document) => {
          this.hasContentCommentInput = this._hasHtmlContent(domElement);
          this._checkIdOfImages(domElement, commentResourceGraph.identifier);
        })
      );
  }

  public listenOnImagePasted(resources: DdResourceRequest[]): Observable<boolean | undefined> {
    const commentResourceGraph = buildCommentResourceGraph(resources);
    return this._commentMessageInputContainerFacade.getMessageInputHasAttachmentInline(withScopedProps(commentResourceGraph.identifier))
      .pipe(
        takeUntil(this._unsubscribe),
        takeUntil(this._commentSentSubject),
        debounceTime(this._DEBOUNCE_TIME),
        tap((pastedImage: boolean | undefined) => {
          const button = document.querySelector('.dd-ssss-comment-send-btn');
          pastedImage && button && this._renderer.setAttribute(button, 'disabled', 'true');
        }));
  }

  private _buildCommentUpdateCaseIdInput(caseId: string): CommentUpdateCaseIdInput {
    return {
      resourceGraphId: this._resourceGraphId,
      previousCaseId: caseId
    }
  }

  private _getCaseIdFromResourceGraph(resourceGraph: DdResourceRequest[]): string {
    return resourceGraph.find(resourceGraph => resourceGraph.resourceName === VERSION_ID)?.resourceValue.toString() || '0';
  }

  private _getDomElement(htmlText: string): Document {
    const domParser = new DOMParser();
    const domElement = domParser.parseFromString(htmlText, 'text/html');
    return domElement;
  }

  private _hasHtmlContent(domElement: Document): boolean {
    const hasTextContent = domElement.body.textContent;
    if (hasTextContent && hasTextContent !== this._ZERO_WIDTH_SPACE_CHARACTER) return true;

    const hasImgElement = !!domElement.body.querySelector('img');
    if (hasImgElement) return true;

    return false;
  }

  private _checkIdOfImages(domElement: Document, commentResourceGraphIdentifier: string): void {
    const allImageElements = Array.from(domElement.body.querySelectorAll('img'));
    if (this._allImagesHasAttributes(allImageElements)) {
      //TODO: Analize this case if it needs to apply also for all inputs, for now it's only affecting to see-something component
      this._commentMessageInputContainerFacade.messageInputSetHasAttachmentInline(withScopedProps(commentResourceGraphIdentifier, false));
      const button = document.querySelector('.dd-ssss-comment-send-btn');
      button && this._renderer.removeAttribute(button, 'disabled');
    }
  }

  private _allImagesHasAttributes(allImageElements: HTMLImageElement[]): boolean {
    return allImageElements.every((imageItem) => imageItem.hasAttribute('documentid') && imageItem.hasAttribute('versionid'));
  }

  private _finalize(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
    this._commentSentSubject.next();
  }
}
