import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Router} from '@angular/router';
import {CROP_NAME, SCREENSHOT_NAME, SECURE_FULL_SCREEN} from '../../../constants';

@Component({
  selector: 'dt-tools',
  templateUrl: './dt-tools.component.html',
  styleUrls: ['./dt-tools.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DtToolsComponent {
  public documentDetail: { documentId: number, versionId: number } | undefined;

  constructor(private _router: Router) {
    this.documentDetail = undefined;
  }

  public initScreenshot(): void {
    window?.electronAPI?.buildBrowserWindowFromRoute(SCREENSHOT_NAME);
  }

  public initSeeSomething(): void {
    window?.electronAPI?.setFullScreen(true);
    this._router.navigate([`${SECURE_FULL_SCREEN}/see-something`]);
  }

  public initCrop(): void {
    window?.electronAPI?.buildBrowserWindowFromRoute(CROP_NAME);
  }
}
