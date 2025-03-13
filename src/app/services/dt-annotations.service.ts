import {ApplicationRef, Injectable, OnDestroy, Renderer2} from '@angular/core';
import {
  DdAnnotationPayload,
  DdArrowShapeUtility,
  DoodleAnnotation,
  DoodleDrawMode,
  DoodleLineShape,
  DoodleProject,
  DoodleShape
} from '@doodle/annotations';
import {DdAnnotation, DoodleAnnotationsFacade} from '@doodle/core';
import {DdProjectFacade, DdProjectResponse, DdResourceRequest, DdShapeType} from '@doodle/http-client';
import {
  DdAnnotationsProjectConfig,
  DdBoardService,
  DdCommentType,
  DdSsssCommentComponent,
  DdStrategyForUpdateExpressive,
  mapDdAnnotationPayloadToDdAnnotationResponse
} from '@doodle/viewer';
import {CommentResourceGraphsEffectsFacade} from '@set-social-services/comment-core';
import {Observable, Subject} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';
import {ANNOTATION_ID, dtProjectConfig} from '../constants';
import {DtDrawModeConfig} from '../interfaces/dt-draw-mode-config.interface';
import {DtCommentsService} from './dt-comments.service';
import {DtDocumentService} from './dt-document.service';

/**
 * @author Bruno Ramirez
 */
@Injectable()
export class DtAnnotationsService implements OnDestroy {
  private _annotationRemovedSubject: Subject<void>;
  private _ddAnnotation: DoodleAnnotation | undefined;
  private _ddProject: DoodleProject | undefined;
  private _drawModeCurrent: DoodleDrawMode;
  private _drawModeMap: Map<DoodleDrawMode, DtDrawModeConfig>;
  private _initialDocumentResources: DdResourceRequest[];
  private _originDrawShape: DoodleDrawMode;
  private _unsubscribe: Subject<void>;

  private readonly _MAX_VALUE_ID: number = 90000;
  private readonly _MIN_VALUE_ID: number = 10000;

  constructor(private _commentResourceGraphsEffectsFacade: CommentResourceGraphsEffectsFacade,
              private _ddAnnotationsFacade: DoodleAnnotationsFacade,
              private _dtDocumentService: DtDocumentService,
              private _dtCommentService: DtCommentsService,
              private _ddBoardService: DdBoardService,
              private _appRef: ApplicationRef,
              private _renderer: Renderer2) {
    this._annotationRemovedSubject = new Subject<void>();
    this._drawModeMap = new Map([
      [DoodleDrawMode.UNDERLINE, {color: 'yellow', nextDrawMode: DoodleDrawMode.HIGHLIGHTER}],
      [DoodleDrawMode.HIGHLIGHTER, {color: 'red', nextDrawMode: DoodleDrawMode.UNDERLINE}]
    ]);
    this._drawModeCurrent = DoodleDrawMode.UNDERLINE;
    this._initialDocumentResources = [];
    this._originDrawShape = DoodleDrawMode.UNDERLINE;
    this._unsubscribe = new Subject<void>();
  }

  ngOnDestroy(): void {
    this._finalize();
  }

  public get currentAnnotation(): DoodleAnnotation | undefined {
    return this._ddAnnotation;
  }

  public buildDdBoard(imageElement: HTMLImageElement, projectElement: HTMLDivElement): void {
    const annotationsProjectConfig = this._buildAnnotationsProjectConfig(imageElement);
    const numberRandom = Math.floor(this._MIN_VALUE_ID + Math.random() * this._MAX_VALUE_ID);
    this._initialDocumentResources = this._dtDocumentService.buildResources(`${numberRandom}`, `${numberRandom + 1}`);
    this._ddBoardService.buildDdBoardComponentRef(projectElement, Date.now().toString(), annotationsProjectConfig, this._initialDocumentResources, DdCommentType.SSSS_COMMENT);
    this._listenProjectCreate();
    this._dtDocumentService.setInitialDocumentResources(this._initialDocumentResources);
  }

  public updateProjectKey(newProjectKey: string): Observable<DdProjectResponse> {
    return DdProjectFacade.updateProjectKey({
      currentKey: this._ddProject!.getProjectKey(),
      newKey: newProjectKey
    }).pipe(take(1), takeUntil(this._unsubscribe))
  }

  public getSsssCommentRef(annotationId: string): DdSsssCommentComponent | undefined {
    return this._ddBoardService.getCommentRef(annotationId) as DdSsssCommentComponent;
  }

  public addExpressiveShape(): void {
    const annotationId = this._ddAnnotation?.getId();
    if (!annotationId) return;

    const commentRef = this.getSsssCommentRef(annotationId);
    if (!commentRef) return;

    const sentimentContent = commentRef.sentimentContent;
    const shapeTypeCurrent = this._ddAnnotation!.getShape().getProps().type;
    const newAnnotation: DdAnnotation = {...commentRef.annotation, type: shapeTypeCurrent};
    this._ddBoardService.addExpressiveFeelingIfHasSentimentContent(sentimentContent, newAnnotation, DdStrategyForUpdateExpressive.AFTER);
  }

  public getOriginShapeDraw(): DoodleDrawMode {
    return this._originDrawShape;
  }

  public updateAnnotationInBaseDetection(): void {
    if (!this._ddProject || !this._ddAnnotation) {
      return;
    }

    const detectedShape = this._ddProject.getProjectFacade().buildShapeInBaseToDetection(this._ddAnnotation.getShape());
    this._updateDimensionsDetectedShape(detectedShape);
    this._ddAnnotation.setShape(detectedShape);
  }

  private _buildAnnotationsProjectConfig(imageElement: HTMLImageElement): DdAnnotationsProjectConfig {
    return {
      width: imageElement.naturalWidth,
      height: imageElement.naturalHeight,
      ...dtProjectConfig
    };
  }

  private _listenProjectCreate(): void {
    this._ddBoardService.listenProjectCreated()
      .pipe(take(1))
      .subscribe((projectCreated) => {
        this._ddProject = projectCreated;
        this._ddProject!.setDrawModeState(DoodleDrawMode.UNDERLINE);
        this._ddProject!.enableBoardDraw(1);
        this._updateMouseCursor();
        this._addStyleToShapeOptions();
        this._listenAnnotationsEvents();
      });
  }

  private _addStyleToShapeOptions(): void {
    const glassBoard = this._ddProject!.getGlassBoard();
    const shapeOptionsElement = glassBoard!.getDoodleShapeOptionsElement();
    this._renderer.setStyle(shapeOptionsElement, 'zIndex', 2);
  }

  private _listenAnnotationsEvents(): void {
    this._listenAnnotationChanged();
    this._listenAnnotationDoubleClicked();
    this._listenAnnotationDrawFinish();
    this._listenNewAnnotationSaved();
    this._listenAnnotationRemoved();
    this._listenAnnotationEdit();
    this._listenFocusInComment();
    this._listenBoardRightClick();
    this._listenBoardClicked();
  }

  private _listenNewAnnotationSaved(): void {
    this._ddProject!.getDoodleProjectEventsFacade()
      .getNewAnnotationSaved$()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((annotationPayload) => {
        const ddAnnotationResponse = mapDdAnnotationPayloadToDdAnnotationResponse(annotationPayload);
        ddAnnotationResponse.isNewAnnotation = true;
        this._ddProject!.disableBoardDraw(1);
        this._updateMouseCursor();
        this._ddAnnotation = annotationPayload.content;
        this._ddAnnotationsFacade.add(this._ddProject!.getProjectKey(), ddAnnotationResponse);
        this._listenCommentInputContent(annotationPayload.content.getId());
      });
  }

  private _listenAnnotationRemoved(): void {
    this._ddProject!.getDoodleProjectEventsFacade().getAnnotationRemoved$()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((annotationPayload) => {
        this._ddAnnotation = undefined;
        this._ddProject!.enableBoardDraw(1);
        this._updateMouseCursor();
        this._ddAnnotationsFacade.remove(annotationPayload.projectKey, mapDdAnnotationPayloadToDdAnnotationResponse(annotationPayload));
        this._annotationRemovedSubject.next();
      });
  }

  private _listenAnnotationChanged(): void {
    this._ddBoardService.listenAnnotationChanged()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((annotationPayload: DdAnnotationPayload) => {
        const commentRef = this._ddBoardService.getCommentRef(annotationPayload.content.getId());
        if (commentRef) {
          const annotationResponse = mapDdAnnotationPayloadToDdAnnotationResponse(annotationPayload);
          this._ddAnnotationsFacade.update(annotationPayload.projectKey, annotationResponse);
          commentRef.calculatePosition();
        }
      });
  }

  private _listenAnnotationDoubleClicked(): void {
    this._ddBoardService.listenAnnotationDoubleClicked()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((annotationPayload: DdAnnotationPayload) => {
        const commentRef = this._ddBoardService.getCommentRef(annotationPayload.content.getId());
        if (commentRef) {
          commentRef.doubleClickOnComment();
        }
      });
  }

  private _listenAnnotationDrawFinish(): void {
    this._ddProject!.getDoodleProjectEventsFacade().getStopDraw$()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(() => {
        this._ddProject!.disableBoardDraw(1);
        this._originDrawShape = this._drawModeCurrent;
        this._updateMouseCursor();
      });
  }

  private _listenAnnotationEdit(): void {
    this._ddProject!.getDoodleProjectEventsFacade().getEditAnnotation$()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(() => this._ddAnnotationsFacade.clearAnnotationIdToFocus(this._ddProject!.getProjectKey()));
  }

  private _listenBoardRightClick(): void {
    this._ddProject!.getDoodleProjectEventsFacade().getBoardRightClick$()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(() => this._switchDrawMode());
  }

  private _listenBoardClicked(): void {
    this._ddBoardService.listenBoardClicked()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(() => this._ddAnnotationsFacade.clearAnnotationIdToFocus(this._ddProject!.getProjectKey()));
  }

  private _switchDrawMode(): void {
    const currentModeSettings = this._drawModeMap.get(this._drawModeCurrent);
    if (currentModeSettings && !this._ddAnnotation) {
      this._drawModeCurrent = currentModeSettings.nextDrawMode;
      this._ddProject!.setColor(currentModeSettings.color);
      this._ddProject!.setDrawModeState(this._drawModeCurrent);
      this._updateMouseCursor();
    }
  }

  private _updateMouseCursor(): void {
    const glassBoard = this._ddProject!.getGlassBoard();
    glassBoard && glassBoard.updateCursorStyleImage();
  }

  private _listenCommentInputContent(annotationId: string): void {
    const commentResources = this._initialDocumentResources.concat({resourceName: ANNOTATION_ID, resourceValue: annotationId});
    commentResources.push({
      resourceName: 'boardNumber',
      resourceValue: '1'
    });
    this._dtCommentService.listenCommentInputContent(commentResources)
      .pipe(takeUntil(this._annotationRemovedSubject))
      .subscribe();

    this._dtCommentService.listenOnImagePasted(commentResources)
      .pipe(takeUntil(this._annotationRemovedSubject))
      .subscribe();
  }


  private _listenFocusInComment(): void {
    this._ddAnnotationsFacade.getAnnotationIdToFocus(this._ddProject!.getProjectKey())
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(() => this._ddBoardService.saveCurrentAnnotationEdits(this._ddProject!));
  }

  private _updateDimensionsDetectedShape(detectedShape: DoodleShape): void {
    if (DdArrowShapeUtility.isImageArrow(detectedShape.getProps())) {
      return;
    }

    const lineShapeCurrent = this._ddAnnotation!.getShape() as DoodleLineShape;
    const lineShapeDimensions = lineShapeCurrent.getKonvaShape().getClientRect();
    const shapeType = detectedShape.getType();
    const pixelRatio = window.devicePixelRatio;

    detectedShape.setProps({
      ...detectedShape.getProps(),
      x: lineShapeDimensions.x * pixelRatio,
      y: lineShapeDimensions.y * pixelRatio,
      width: (shapeType === DdShapeType.IMAGE ? lineShapeDimensions.width : detectedShape.getProps().width) * pixelRatio,
      height: (shapeType === DdShapeType.IMAGE ? lineShapeDimensions.height : detectedShape.getProps().height) * pixelRatio
    });
  }

  private _finalize(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }
}
