/**
 * @author Francisco Camacho
 */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewEncapsulation
} from '@angular/core';
import {
  CommentAttachmentReference,
  CommentCaseData,
  ResourceGraphResponse,
  ResourceRegistryResponse
} from '@set-social-services/comment-api';
import {
  CommentClipboardContainerFacade,
  CommentResourceGraphsContainerFacade,
  CommentResourceGraphsEffectsFacade
} from '@set-social-services/comment-core';
import {withScopedProps} from '@set-social-services/common-core';
import {BulletinResponse, ReadStateEnum} from '@set-social-services/wall-api';
import {WallBulletinsContainerFacade} from '@set-social-services/wall-core';
import {filter, take} from 'rxjs/operators';
import {DtWallThumbnail} from './properties/dt-wall-thumbnail';

@Component({
  selector: 'dt-wall-thumbnail',
  templateUrl: './dt-wall-thumbnail.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DtWallThumbnailComponent implements AfterViewInit {

  @Input() public data!: DtWallThumbnail;

  public documentReference!: CommentAttachmentReference;

  private readonly _CONTEXT: string = 'DOODLE_DOCUMENT';
  private readonly _DOCUMENT_RESOURCE_NAME: string = 'documentId';
  private readonly _TAKE_COUNT: number = 1;
  private readonly _VERSION_RESOURCE_NAME: string = 'versionId';

  constructor(private _commentResourceGraphsContainerFacade: CommentResourceGraphsContainerFacade,
              private _commentResourceGraphsEffectsFacade: CommentResourceGraphsEffectsFacade,
              private _commentClipboardContainerFacade: CommentClipboardContainerFacade,
              private _wallBulletinsContainerFacade: WallBulletinsContainerFacade,
              private _cdr: ChangeDetectorRef) {
  }

  public ngAfterViewInit(): void {
    this._initialize();
  }

  public onClickThumbnail(): void {
    this._openViewer();
    this._markBulletinAsRead();
  }

  public stopClickEvent(event: MouseEvent): void {
    this._commentClipboardContainerFacade.clipboardClear();
    event.preventDefault();
    event.stopPropagation();
  }

  private _initialize(): void {
    this._buildDocumentReference();
    this._buildDocumentReferenceByResource();
  }

  private _buildDocumentReference(): void {
    if (!this._hasDocumentId()) {
      return;
    }

    this.documentReference = {
      documentId: +(this.data.dtDocumentId as string),
      versionId: +(this.data.dtVersionId as string)
    };
    this._setCaseData();
    this._cdr.detectChanges();
  }

  private _buildDocumentReferenceByResource(): void {
    if (this._hasDocumentId()) {
      return;
    }

    this._commentResourceGraphsEffectsFacade.readResourceGraph(this.data.cmtResourceGraphId as number)
      .pipe(take(this._TAKE_COUNT))
      .subscribe((resourceGraphResponse: ResourceGraphResponse) => this._buildDocument(resourceGraphResponse));
  }

  private _hasDocumentId(): boolean {
    return !!this.data.dtDocumentId;
  }

  private _buildDocument(resourceGraphResponse: ResourceGraphResponse): void {
    const documentId: string | undefined = this._getResourceValue(resourceGraphResponse, this._DOCUMENT_RESOURCE_NAME);
    const versionId: string | undefined = this._getResourceValue(resourceGraphResponse, this._VERSION_RESOURCE_NAME);

    if (!documentId || !versionId) {
      return;
    }

    this.documentReference = {
      documentId: +documentId,
      versionId: +versionId
    };
    this._setCaseData();
    this._cdr.detectChanges();
  }

  private _getResourceValue(resourceGraphResponse: ResourceGraphResponse | undefined, resourceName: string): string | undefined {
    if (!resourceGraphResponse) {
      return undefined;
    }

    const resource: ResourceRegistryResponse | undefined = resourceGraphResponse.resources.find(
      (resource: ResourceRegistryResponse) => resource.resourceName === resourceName
    );

    return resource?.resourceValue;
  }

  private _setCaseData(): void {
    const commentCaseData: CommentCaseData = {
      caseId: `${this.documentReference.versionId}`,
      caseName: `document_version_${this.documentReference.versionId}`,
      context: this._CONTEXT
    };

    if (!!this.data.instanceId) {
      this._commentResourceGraphsContainerFacade.setCaseData(withScopedProps(this.data.instanceId, commentCaseData));
    }

    if (!!this.data.cmtResourceId) {
      this._commentResourceGraphsContainerFacade.setCaseData(withScopedProps(this.data.cmtResourceId, commentCaseData));
    }
  }

  private _openViewer() {
    //TODO: Implement open viewer
  }

  private _markBulletinAsRead(): void {
    if (!this.data.instanceId) {
      return;
    }

    const bulletinId: string = this.data.instanceId;

    this._wallBulletinsContainerFacade.getBulletinById(bulletinId).pipe(
      take(this._TAKE_COUNT),
      filter((bulletin: BulletinResponse | undefined): bulletin is BulletinResponse =>
        !!bulletin && bulletin.readState === ReadStateEnum.UNREAD
      )
    ).subscribe(() => {
      this._wallBulletinsContainerFacade.bulletinsUpdateReadUnread({
        bulletinId: bulletinId,
        readState: ReadStateEnum.READ
      })
    });
  }
}
