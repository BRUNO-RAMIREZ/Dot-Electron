import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'dt-screenshot',
  templateUrl: './dt-screenshot.component.html',
  styleUrls: ['./dt-screenshot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DtScreenshotComponent {
  private readonly _SCREENSHOT_AUDIO_PATH: string = 'assets/sound/dt-screenshot-sound.mp3';

  constructor() {
    window?.electronAPI?.setIgnoreMouseEvents(true);
  }

  public setIgnoreMouseEvents(ignoreEvents: boolean): void {
    window?.electronAPI?.setIgnoreMouseEvents(ignoreEvents);
  }

  public takeScreenshot(): void {
    const audio = new Audio(this._SCREENSHOT_AUDIO_PATH);
    audio.play();
    window?.electronAPI?.initTakeScreenshot();
  }
}
