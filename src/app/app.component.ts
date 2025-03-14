import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DdDocumentAndVersionResponse} from '@doodle/api';
import {fromEvent, Subject} from 'rxjs';
import {map, take, takeUntil} from 'rxjs/operators';
import {SCREENSHOT_NAME} from './constants';
import {DtAction} from './enums/dt-action.enum';
import {DtDocumentOpenAction} from './interfaces/dt-document-open-action.interface';
import {DtElectronMessage} from './interfaces/dt-electron-message.interface';
import {DtDocumentService} from './services/dt-document.service';
import {DtElectronService} from './services/dt-electron.service';
import {DtEventDocumentActionService} from './services/dt-event-document-action.service';
import {DtLocalLoginTest} from './utilis/dt-local-login-test';

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
              private _dtElectronService: DtElectronService,
              private _dtDocumentService: DtDocumentService,
              private _cdr: ChangeDetectorRef,
              private _injector: Injector,
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
    this._dtElectronService.sendMessage({channel: DtAction.SET_FULL_SCREEN, payload: {isFullScreen: false}});
    this._router.navigate(['secure/floating-button']);
    this._cdr.detectChanges();
  }

  private _initialize(): void {
    this._listenRenderScreenshot();
    this._listenDocumentOpen();
    this._listenEscapeKey();
  }

  private _finalize(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  private _listenRenderScreenshot(): void {
    this._dtElectronService.onMessage(DtAction.LISTEN_TO_SCREENSHOT_TAKEN, (message: DtElectronMessage) => {
      this._saveScreenshotIntoLibrary(message?.payload.screenshotBuffer);
      this._dtElectronService.sendMessage({channel: DtAction.SET_FULL_SCREEN, payload: {isFullScreen: true}});
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
        this.documentDetail = documentDetail;
        this._cdr.detectChanges();
      });
  }

  private _listenDocumentOpen(): void {
    this._dtEventDocumentActionService.onOpenViewer()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(({document}: DtDocumentOpenAction) => {
        if (!document) return;
        this.documentDetail = {documentId: document.documentId, versionId: document.versionId};
        this._cdr.detectChanges();
      });
  }

  private _listenEscapeKey(): void {
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((event: KeyboardEvent) => event.key === 'Escape' && this.closeViewer());
  }
}
