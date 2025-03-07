import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {DdDocumentAndVersionResponse} from '@doodle/api';
import {Subject} from 'rxjs';
import {map, take, takeUntil} from 'rxjs/operators';
import {DtDocumentService} from '../services/dt-document.service';

@Component({
  selector: 'dt-home',
  templateUrl: './dt-home.component.html',
  styleUrls: ['./dt-home.component.scss']
})
export class DtHomeComponent implements OnInit, OnDestroy {
  public documentDetail: { documentId: number, versionId: number } | undefined;

  private readonly _TAKE_ONE: number = 1;

  private _unsubscribe: Subject<void>;

  constructor(private _dtDocumentService: DtDocumentService,
              private _cdr: ChangeDetectorRef,
              private _ngZone: NgZone) {
    this.documentDetail = undefined;
    this._unsubscribe = new Subject<void>();
  }

  ngOnInit(): void {
    this._initialize();
  }

  ngOnDestroy(): void {
    this._finalize();
  }

  public initScreenshot(): void {
    window.electronAPI.initScreenshot();
  }

  public initSeeSomething(): void {

  }

  public initCrop(): void {

  }

  public closeViewer(): void {
    this.documentDetail = undefined;
    window.electronAPI.setFullScreen(false);
    this._cdr.detectChanges();
  }

  private _initialize(): void {
    this._listenRenderScreenshot();
  }

  private _finalize(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
    window.electronAPI.removeRenderScreenshotListener();
  }

  private _listenRenderScreenshot(): void {
    window.electronAPI.onRenderScreenshot((buffer) => {
      this._saveScreenshotIntoLibrary(buffer);
      window.electronAPI.setFullScreen(true);
    });
  }

  private _saveScreenshotIntoLibrary(buffer: ArrayBufferLike): void {
    this._dtDocumentService.saveDocumentInLibrary(buffer)
      .pipe(
        take(this._TAKE_ONE),
        takeUntil(this._unsubscribe),
        map((documentData: DdDocumentAndVersionResponse) => ({
          documentId: documentData.document.id,
          versionId: documentData.documentVersion.id
        }))).subscribe((documentDetail) => {
      this._ngZone.run(() => {
        this.documentDetail = documentDetail;
        this._cdr.detectChanges();
      });
    });
  }
}
