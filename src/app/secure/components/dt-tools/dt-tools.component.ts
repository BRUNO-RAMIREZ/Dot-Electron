import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {CROP_NAME, SCREENSHOT_NAME, SECURE_FULL_SCREEN} from '../../../constants';
import {DtAction} from '../../../enums/dt-action.enum';
import {DtElectronService} from '../../../services/dt-electron.service';

@Component({
  selector: 'dt-tools',
  templateUrl: './dt-tools.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DtToolsComponent {
  public documentDetail: { documentId: number, versionId: number } | undefined;

  constructor(private _dtElectronService: DtElectronService,
              private _router: Router) {
    this.documentDetail = undefined;
  }

  public initScreenshot(): void {
    this._dtElectronService.sendMessage({channel: DtAction.BUILD_BROWSER_WINDOW, payload: {path: SCREENSHOT_NAME}});
  }

  public initSeeSomething(): void {
    this._dtElectronService.sendMessage({channel: DtAction.SET_FULL_SCREEN, payload: {isFullScreen: true}});
    this._router.navigate([`${SECURE_FULL_SCREEN}/see-something`]);
  }

  public initCrop(): void {
    this._dtElectronService.sendMessage({channel: DtAction.BUILD_BROWSER_WINDOW, payload: {path: CROP_NAME}});
  }
}
