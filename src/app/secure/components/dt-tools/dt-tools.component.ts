import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Router} from '@angular/router';
import {CROP_NAME, SCREENSHOT_NAME, SECURE_FULL_SCREEN} from '../../../constants';

@Component({
  selector: 'dt-see-something',
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
    try {
      window.electronAPI.buildBrowserWindowFormRoute(SCREENSHOT_NAME);
    } catch (e) {
      console.error(e)
    }
  }

  public initSeeSomething(): void {
    // window.electronAPI.buildBrowserWindowFormRoute(SEE_SOMETHING_NAME);
    console.info('Aqui')
    try {
      window.electronAPI.setFullScreen(true);
    } catch (e) {
      console.error(e)
    }
    console.info('Aqui')

    this._router.navigate([`${SECURE_FULL_SCREEN}/see-something`]);
  }

  public initCrop(): void {
    window.electronAPI.buildBrowserWindowFormRoute(CROP_NAME);
  }
}
