import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {DtAction} from '../../../../enums/dt-action.enum';
import {DtElectronService} from '../../../../services/dt-electron.service';

@Component({
  selector: 'dt-screenshot',
  templateUrl: './dt-screenshot.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DtScreenshotComponent {
  private readonly _SCREENSHOT_AUDIO_PATH: string = 'assets/sound/dt-screenshot-sound.mp3';

  constructor(private _electronService: DtElectronService) {
    this._electronService.sendMessage({channel: DtAction.SET_IGNORE_MOUSE_EVENTS, payload: {ignoreEvents: true}});
  }

  public setIgnoreMouseEvents(ignoreEvents: boolean): void {
    this._electronService.sendMessage({channel: DtAction.SET_IGNORE_MOUSE_EVENTS, payload: {ignoreEvents}});
  }

  public takeScreenshot(): void {
    const audio = new Audio(this._SCREENSHOT_AUDIO_PATH);
    audio.play();
    this._electronService.sendMessage({channel: DtAction.INIT_TAKE_SCREENSHOT});
  }
}
