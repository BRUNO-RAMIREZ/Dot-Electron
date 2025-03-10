import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {DoodleDrawMode} from '@doodle/annotations';
import {DdDocumentAndVersionResponse, DdProjectResponse} from '@doodle/api';
import {buildProjectKey, DdBoardService} from '@doodle/viewer';
import {ResourceGraphResponse} from '@set-social-services/comment-api';
import {forkJoin, Observable, Subject} from 'rxjs';
import {filter, switchMap, takeUntil, tap} from 'rxjs/operators';
import {SECURE_FULL_SCREEN, SEE_SOMETHING_NAME} from '../../constants';
import {DtDocument} from '../../interfaces/dt-document-open-action.interface';
import {DtAnnotationsService} from '../../services/dt-annotations.service';
import {DtCommentsService} from '../../services/dt-comments.service';
import {DtDocumentService} from '../../services/dt-document.service';
import {DtEventDocumentActionService} from '../../services/dt-event-document-action.service';

@Component({
  selector: 'dt-see-something',
  templateUrl: './dt-see-something.component.html',
  styleUrls: ['./dt-see-something.component.scss'],
  providers: [DdBoardService, DtAnnotationsService, DtCommentsService]
})
export class DtSeeSomethingComponent implements OnInit, OnDestroy {
  @ViewChild('projectContainer') private _projectContainer!: ElementRef<HTMLDivElement>;

  public imageSafeUrl: SafeUrl | undefined;
  public isHiddenImage: boolean;

  private _documentDetail: DdDocumentAndVersionResponse | undefined;
  private _imageArrayBuffer!: ArrayBufferLike;
  private _unsubscribe: Subject<void>;

  constructor(private _dtEventDocumentActionService: DtEventDocumentActionService,
              private _dtAnnotationsService: DtAnnotationsService,
              private _dtCommentsService: DtCommentsService,
              private _dtDocumentService: DtDocumentService,
              private _sanitizer: DomSanitizer,
              private _cdr: ChangeDetectorRef,
              private _router: Router) {
    this.imageSafeUrl = undefined;
    this.isHiddenImage = true;
    this._unsubscribe = new Subject<void>();
  }

  ngOnInit(): void {
    this._initialize();
  }

  ngOnDestroy(): void {
    this._finalize();
  }

  public loadDoodleBoard(imageElement: HTMLImageElement): void {
    const projectElement = this._projectContainer.nativeElement;
    if (projectElement) {
      this._dtAnnotationsService.buildDdBoard(imageElement, projectElement);
      this._listenCommentSendOptionClicked();
      this._listenCommentPosted();
      this._cdr.detectChanges();
    }
  }

  private _initialize(): void {
    this._takeCapture();
  }

  private _finalize(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  private _takeCapture(): void {
    window?.electronAPI?.initSeeSomething()
      .then((imageArrayBuffer: ArrayBufferLike) => {
        const imageUrl = URL.createObjectURL(new Blob([imageArrayBuffer], {type: 'image/png'}));
        this.imageSafeUrl = this._sanitizer.bypassSecurityTrustUrl(imageUrl);
        this._imageArrayBuffer = imageArrayBuffer;
        this._cdr.detectChanges();
      });
  }

  private _listenCommentPosted(): void {
    this._dtCommentsService.listenCommentPosted()
      .pipe(
        switchMap(() => this._saveDocumentInLibrary()),
        tap(({document, documentVersion}) => this._documentDetail = this._dtDocumentService.buildDocumentDetail(document, documentVersion)),
        switchMap(() => this._updateProjectKeyAndCommentResourceGraphs()),
        tap(() => this._handlerCommentAfterSubmitted())
      ).subscribe();
  }

  private _listenCommentSendOptionClicked(): void {
    this._dtCommentsService.listenCommentSendOptionClicked()
      .pipe(
        filter(() => this._dtCommentsService.hasContentCommentInput === false),
        switchMap(() => this._saveDocumentInLibrary()),
        tap(({document, documentVersion}) => this._documentDetail = this._dtDocumentService.buildDocumentDetail(document, documentVersion)),
        switchMap(() => {
          const projectKey = buildProjectKey(this._documentDetail!.document.id, this._documentDetail!.documentVersion.id);
          return this._dtAnnotationsService.updateProjectKey(projectKey);
        }),
        tap(() => this._handlerCommentAfterSubmitted())
      ).subscribe();
  }

  private _saveDocumentInLibrary(): Observable<DdDocumentAndVersionResponse> {
    return this._dtDocumentService.saveDocumentInLibrary(this._imageArrayBuffer!, SEE_SOMETHING_NAME)
      .pipe(takeUntil(this._unsubscribe));
  }

  private _updateProjectKeyAndCommentResourceGraphs(): Observable<{ updateProjectKey: DdProjectResponse, updateCommentResourceGraphs: ResourceGraphResponse[] }> {
    const {id: documentId} = this._documentDetail!.document;
    const {id: versionId} = this._documentDetail!.documentVersion;
    const annotationId = this._dtAnnotationsService.currentAnnotation!.getId();

    const projectKeyToUpdate = buildProjectKey(documentId, versionId);
    const commentResourceGraphToUpdate = this._dtDocumentService.buildResources(documentId.toString(), versionId.toString(), annotationId);
    commentResourceGraphToUpdate.push({
      resourceName: 'boardNumber',
      resourceValue: '1'
    });

    return forkJoin({
      updateProjectKey: this._dtAnnotationsService.updateProjectKey(projectKeyToUpdate),
      updateCommentResourceGraphs: this._dtCommentsService.updateCommentResourceGraphs(commentResourceGraphToUpdate),
      updateCommentCasiIdAndCaseName: this._dtCommentsService.updateCommentCaseIdAndCaseName(commentResourceGraphToUpdate)
    });
  }

  private _handlerCommentAfterSubmitted(): void {
    if (this._dtAnnotationsService.getOriginShapeDraw() === DoodleDrawMode.UNDERLINE) {
      this._dtAnnotationsService.updateAnnotationInBaseDetection();
      this._dtAnnotationsService.addExpressiveShape();
    }

    this._navigateToFullScreen();
  }

  private _navigateToFullScreen(): void {
    this._router.navigate([SECURE_FULL_SCREEN], {skipLocationChange: true}).then(() => this._openDocument());
  }

  private _openDocument(): void {
    if (!this._documentDetail) {
      console.error('The document detail is undefined, can not open viewer');
      return;
    }

    const document: DtDocument = {
      documentId: this._documentDetail.document.id,
      versionId: this._documentDetail.documentVersion.id
    };

    this._dtEventDocumentActionService.openViewer(document);
  }
}
