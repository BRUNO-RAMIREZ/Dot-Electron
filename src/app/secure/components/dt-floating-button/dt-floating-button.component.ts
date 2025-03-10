import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {DtElectronService} from '../../../services/dt-electron.service';
import {DtAction} from '../../../enums/dt-action.enum';
import {Router} from '@angular/router';

@Component({
  selector: 'dt-floating-button',
  templateUrl: './dt-floating-button.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DtFloatingButtonComponent implements OnInit, AfterViewInit {
  @ViewChild('floatingViewContainer') public floatingViewContainer!: ElementRef<HTMLElement>;

  public isButtonHidden: boolean;
  public isSwitchActivated: boolean;

  private _clickSwitchStartTime: number;

  private readonly _CLICK_THRESHOLD: number = 230;
  private readonly _INITIAL_TOP_WINDOW_VALUE: number = 25;

  constructor(private _dtElectronService: DtElectronService,
              private _cdr: ChangeDetectorRef,
              private _router: Router) {
    this.isButtonHidden = false;
    this.isSwitchActivated = false;
    this._clickSwitchStartTime = 0;

  }

  ngOnInit(): void {
    this._dtElectronService.sendMessage(DtAction.CHANGE_WINDOW_BOUNDS, {
      width: 50,
      height: 50,
      y: this._INITIAL_TOP_WINDOW_VALUE
    });
  }

  ngAfterViewInit(): void {
    const width: number = this.floatingViewContainer.nativeElement.offsetWidth;
    const height: number = this.floatingViewContainer.nativeElement.offsetHeight;
    this._dtElectronService.sendMessage(DtAction.CHANGE_WINDOW_BOUNDS, {
      width,
      height,
      y: this._INITIAL_TOP_WINDOW_VALUE
    });
  }

  public listenDButtonClick(): void {
    this.isButtonHidden = true;
    this._cdr.detectChanges();
    this._router.navigate(['/secure/panel']);
  }

  public listenDSwitchPointerDown(pointerEvent: PointerEvent): void {
    this._clickSwitchStartTime = pointerEvent.timeStamp;
  }

  public listenDSwitchPointerUp(pointerEvent: PointerEvent): void {
    if (pointerEvent.timeStamp - this._clickSwitchStartTime > this._CLICK_THRESHOLD) {
      return;
    }
    pointerEvent.stopPropagation();
    this.isSwitchActivated = !this.isSwitchActivated;
    // !this._isPanelDotViewsExpanded && this._updateIFrameContainerDimensions();
    this._cdr.markForCheck();
  }
}
