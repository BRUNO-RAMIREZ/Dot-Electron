import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DtElectronService} from '../../../services/dt-electron.service';

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
    console.info('look');
    this._dtElectronService.sendMessage('mensaje','!Hola desde angular')
  }
}
