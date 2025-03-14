import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {DdViewerConfig, DdViewerConfiguration} from '@doodle/core';
import {DdDotActions, DdDotViewerActionsFacade} from '@doodle/viewer';
import {CommentClipboardContainerFacade} from '@set-social-services/comment-core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

/**
 * @author Bruno Ramirez
 */
@Component({
  selector: 'dt-modal-viewer',
  templateUrl: './dt-modal-viewer.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DtModalViewerComponent implements OnChanges, OnInit, OnDestroy {
  @ViewChild('dotModalContainer') public dotModalContainer!: ElementRef<HTMLDivElement>;

  @Input() public documentId: number;
  @Input() public versionId: number;

  @Output() public closeEmitter: EventEmitter<void>;

  public doodleConfig: DdViewerConfig;

  public readonly DOODLE_CONFIG: Partial<DdViewerConfiguration> = {
    sourceIdentifiers: {
      groupingFields: 'dtDocumentId,dtVersionId'
    }
  };

  private _dotActionMap: Map<DdDotActions, () => void>;
  private _unsubscribe: Subject<void>;

  private readonly _VIEWER_MODAL_CLASS: string = 'dt-modal-flex';

  constructor(private _commentClipboardContainerFacade: CommentClipboardContainerFacade,
              private _dotViewerActionsFacade: DdDotViewerActionsFacade,
              private _render2: Renderer2,
              private _cdr: ChangeDetectorRef) {
    this.closeEmitter = new EventEmitter<void>();
    this.documentId = 0;
    this.versionId = 0;
    this.doodleConfig = {};
    this._unsubscribe = new Subject<void>();
    this._dotActionMap = new Map<DdDotActions, () => void>([
      [DdDotActions.CLOSE, () => this.closeViewer()],
    ]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.documentId && this.versionId) {
      this._cdr.detectChanges()
    }
  }

  ngOnInit(): void {
    this._listenDotViewerActionService();
  }

  ngOnDestroy(): void {
    this._finalize();
  }

  public isRenderFinished(): void {
    this._render2.addClass(this.dotModalContainer.nativeElement, this._VIEWER_MODAL_CLASS);
    this._cdr.detectChanges();
  }

  public closeViewer(): void {
    this.closeEmitter.emit();
  }

  private _listenDotViewerActionService(): void {
    this._dotViewerActionsFacade.getDotViewerActions()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(({action}) => this._dotActionMap.get(action)?.());
  }

  private _finalize(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }
}
