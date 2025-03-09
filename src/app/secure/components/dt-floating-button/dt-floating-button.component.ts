import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Renderer2,
  ViewEncapsulation
} from '@angular/core';
import {DtElectronService} from '../../../services/dt-electron.service';
import {DtPayload} from '../../../interfaces/dt-payload.interface';
import {DtAction} from '../../../enums/dt-action.enum';
import {Router} from '@angular/router';

@Component({
  selector: 'dt-floating-button',
  templateUrl: './dt-floating-button.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DtFloatingButtonComponent implements OnInit {
  public isButtonHidden: boolean

  constructor(private _dtElectronService: DtElectronService,
              private _cdr: ChangeDetectorRef,
              private _router: Router) {
    this.isButtonHidden = false;
  }

  ngOnInit(): void {
    this._dtElectronService.sendMessage(DtAction.CHANGE_DIMENSIONS, {width: 50, height: 50})
  }

  public listenDButtonClick(): void {
    this.isButtonHidden = true;
    this._cdr.detectChanges();
    this._router.navigate(['/secure/panel']);
  }
}
