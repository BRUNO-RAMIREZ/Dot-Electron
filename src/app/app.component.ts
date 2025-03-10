import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, NgZone, OnDestroy, OnInit} from '@angular/core';
import {DdDocumentAndVersionResponse} from '@doodle/api';
import {Subject} from 'rxjs';
import {map, take, takeUntil} from 'rxjs/operators';
import {SCREENSHOT_NAME, SECURE_FULL_SCREEN} from './constants';
import {DtDocumentOpenAction} from './interfaces/dt-document-open-action.interface';
import {DtDocumentService} from './services/dt-document.service';
import {DtEventDocumentActionService} from './services/dt-event-document-action.service';
import {DtLocalLoginTest} from './utilis/dt-local-login-test';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  public documentDetail: { documentId: number, versionId: number } | undefined;

  private _localLoginTest: DtLocalLoginTest | undefined;
  private _unsubscribe: Subject<void>;

  private readonly _TAKE_ONE: number = 1;

  constructor(private _dtEventDocumentActionService: DtEventDocumentActionService,
              private _dtDocumentService: DtDocumentService,
              private _cdr: ChangeDetectorRef,
              private _injector: Injector,
              private _ngZone: NgZone,
              private _router: Router) {
    this._localLoginTest = new DtLocalLoginTest(this._injector);
    this._localLoginTest.initSession();
    this._unsubscribe = new Subject<void>();
  }

  ngOnInit(): void {
    this._initialize();
  }

  ngOnDestroy(): void {
    this._finalize();
  }

  public closeViewer(): void {
    this.documentDetail = undefined;
    window?.electronAPI?.setFullScreen(false);
    this._router.navigate(['secure/floating-button']);
    this._cdr.detectChanges();
  }

  private _initialize(): void {
    this._listenRenderScreenshot();
    this._listenDocumentOpen();
  }

  private _finalize(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  private _listenRenderScreenshot(): void {
    window?.electronAPI?.onRenderScreenshot((buffer) => {
      this._saveScreenshotIntoLibrary(buffer);
      window?.electronAPI?.setFullScreen(true);
    });
  }

  private _saveScreenshotIntoLibrary(buffer: ArrayBufferLike): void {
    this._dtDocumentService.saveDocumentInLibrary(buffer, SCREENSHOT_NAME)
      .pipe(
        take(this._TAKE_ONE),
        takeUntil(this._unsubscribe),
        map((documentData: DdDocumentAndVersionResponse) => ({
          documentId: documentData.document.id,
          versionId: documentData.documentVersion.id
        })))
      .subscribe((documentDetail) => {
        this._ngZone.run(() => {
          this.documentDetail = documentDetail;
          this._cdr.detectChanges();
        });
      });
  }

  private _listenDocumentOpen(): void {
    this._dtEventDocumentActionService.onOpenViewer()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(({document}: DtDocumentOpenAction) => {
        if (!document) return;
        window?.electronAPI?.setFullScreen(true);
        this._ngZone.run(() => {
          this.documentDetail = {documentId: document.documentId, versionId: document.versionId};
          this._cdr.detectChanges();
        });
      });
  }
}
