import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';

@Component({
  selector: 'dt-home',
  templateUrl: './dt-home.component.html',
  styleUrls: ['./dt-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DtHomeComponent implements OnInit {

  constructor(private _cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this._initialize();
  }

  public initScreenshot(): void {
    window.electronAPI.initScreenshot();
  }

  public initSeeSomething(): void {

  }

  public initCrop(): void {

  }

  private _initialize(): void {
    window.electronAPI.onRenderScreenshot((base64Image) => {
      console.log('Captura recibida:', base64Image);
      window.electronAPI.setFullScreen(true);
    });
  }
}
