import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DtElectronService} from '../../../services/dt-electron.service';
import {DtPayload} from '../../../interfaces/dt-payload.interface';
import {DtAction} from '../../../enums/dt-action.enum';

@Component({
  selector: 'dt-floating-button',
  templateUrl: './dt-floating-button.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DtFloatingButtonComponent implements OnInit {

  constructor(private _dtElectronService: DtElectronService) {
  }

  ngOnInit(): void {
  }

  public listenDButtonClick(): void {
    const payload: DtPayload = {
      width: 610,
      height: -1
    };
    this._dtElectronService.sendMessage(DtAction.CHANGE_DIMENSIONS, payload);
  }
}
