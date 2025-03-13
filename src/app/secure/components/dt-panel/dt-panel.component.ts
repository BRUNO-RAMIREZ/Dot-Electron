import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {DtElectronService} from '../../../services/dt-electron.service';
import {DtAction} from '../../../enums/dt-action.enum';
import {fromEvent, Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {Router} from '@angular/router';
import {DtPayload} from '../../../interfaces/dt-payload.interface';
import {FeaturesConfig} from '@set-social-services/wall-api';
import {WallBulletinsContainerFacade} from '@set-social-services/wall-core';

@Component({
  selector: 'app-dt-panel',
  templateUrl: './dt-panel.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DtPanelComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('panelView') public panelView!: ElementRef<HTMLDivElement>;
  @ViewChild('panelContainer') public panelContainer!: ElementRef<HTMLElement>;

  public isAnimationFinished: boolean;
  public isMinimized: boolean;
  public wallFeatures: FeaturesConfig;

  private _unsubscribe: Subject<void>;

  private readonly _CONTAINER_ORIGINAL_TRANSLATE_VALUE: string = 'translateX(0)';
  private readonly _CONTAINER_TRANSITION_VALUE: string = 'opacity 0.5s ease, transform 0.5s ease';
  private readonly _CONTAINER_TRANSLATE_X_VALUE: string = 'translateX(40px)';
  private readonly _EXPANDED_PANEL_WIDTH: number = 500;
  private readonly _PANEL_TRANSITION_VALUE: string = 'width 0.5s ease';
  private readonly _SIDE_BAR_WIDTH: number = 95;

  constructor(private _wallBulletinsContainerFacade: WallBulletinsContainerFacade,
              private _electronService: DtElectronService,
              private _cdr: ChangeDetectorRef,
              private _render2: Renderer2,
              private _router: Router) {
    this.isAnimationFinished = false;
    this.isMinimized = true;
    this.wallFeatures = {
      enableCounter: false
    };
    this._unsubscribe = new Subject<void>();
  }

  ngOnInit(): void {
    this._initialize();
  }

  ngAfterViewInit(): void {
    this._listenChangeOpacityTransitionEnd();
    this._listenChangePanelWidthTransitionEnd();
    this._openAsideComponent();
  }

  ngOnDestroy(): void {
    this._finalize();
  }

  public closeComponent(): void {
    this._render2.setStyle(this.panelContainer.nativeElement, 'opacity', '0');
    if (this.isMinimized) {
      this._render2.setStyle(this.panelContainer.nativeElement, 'transform', this._CONTAINER_TRANSLATE_X_VALUE);
    }
  }

  public toggleMinimize(): void {
    this.isMinimized = !this.isMinimized;
    !this.isMinimized && this._updateWindowDimensions();
    this.isMinimized ? this._wallBulletinsContainerFacade.bulletinsClosePanel() : this._wallBulletinsContainerFacade.bulletinsOpenPanel();
    this._changePanelWidthWithAnimation();
    this._cdr.markForCheck();
  }

  private _changePanelWidthWithAnimation(): void {
    this._render2.setStyle(this.panelView.nativeElement, 'transition', this._PANEL_TRANSITION_VALUE);
    if (this.isMinimized) {
      this._render2.setStyle(this.panelView.nativeElement, 'width', '0');
    } else {
      this._render2.setStyle(this.panelView.nativeElement, 'width', `${this._EXPANDED_PANEL_WIDTH}px`);
    }
    this._cdr.markForCheck();
  }

  private _updateWindowDimensions(): void {
    const expandedPanelContainerWidth = this._EXPANDED_PANEL_WIDTH + this._SIDE_BAR_WIDTH;
    const width = this.isMinimized ? this._SIDE_BAR_WIDTH : expandedPanelContainerWidth;
    this._electronService.sendMessage(DtAction.CHANGE_WINDOW_BOUNDS, {width})
  }

  private _listenChangeOpacityTransitionEnd(): void {
    fromEvent<TransitionEvent>(this.panelContainer.nativeElement, 'transitionend')
      .pipe(
        filter((transitionEvent: TransitionEvent) => transitionEvent.propertyName === 'opacity' && getComputedStyle(this.panelContainer.nativeElement).opacity === '0'),
        takeUntil(this._unsubscribe)
      ).subscribe(() => this._router.navigate(['/secure/floating-button']));
  }

  private _listenChangePanelWidthTransitionEnd(): void {
    fromEvent<TransitionEvent>(this.panelView.nativeElement, 'transitionend')
      .pipe(
        takeUntil(this._unsubscribe),
        filter(() => this.isMinimized))
      .subscribe(() => this._updateWindowDimensions());
  }

  private _finalize(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  private _openAsideComponent(): void {
    this._render2.setStyle(this.panelContainer.nativeElement, 'opacity', '0');
    if (this.isMinimized) {
      this._render2.setStyle(this.panelContainer.nativeElement, 'transform', this._CONTAINER_TRANSLATE_X_VALUE);
      this._render2.setStyle(this.panelView.nativeElement, 'width', '0');
    } else {
      this._render2.removeStyle(this.panelView.nativeElement, 'width');
    }
    requestAnimationFrame(() => {
      this._render2.setStyle(this.panelContainer.nativeElement, 'transition', this._CONTAINER_TRANSITION_VALUE);
      this._render2.setStyle(this.panelContainer.nativeElement, 'opacity', '1');
      if (this.isMinimized) {
        this._render2.setStyle(this.panelContainer.nativeElement, 'transform', this._CONTAINER_ORIGINAL_TRANSLATE_VALUE);
      }
    });
    this.isAnimationFinished = true;
    this._cdr.detectChanges();
  }

  private _initialize(): void {
    const expandedPanelContainerWidth = this._EXPANDED_PANEL_WIDTH + this._SIDE_BAR_WIDTH;
    const width = this.isMinimized ? this._SIDE_BAR_WIDTH : expandedPanelContainerWidth;
    const payload: DtPayload = {
      width: width,
      height: -1,
      y: 0
    };
    this._electronService.sendMessage(DtAction.CHANGE_WINDOW_BOUNDS, payload);
  }
}
