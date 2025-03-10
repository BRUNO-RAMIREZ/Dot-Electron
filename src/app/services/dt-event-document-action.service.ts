import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DtEventAction} from '../enums/dt-event-action.enum';
import {DtDocument, DtDocumentOpenAction} from '../interfaces/dt-document-open-action.interface';
import {DtEventActionService} from './dt-event-action.service';


@Injectable()
export class DtEventDocumentActionService {

  constructor(private _dtEventActionService: DtEventActionService) {
  }

  public openViewer(document: DtDocument): void {
    const openAction: DtDocumentOpenAction = {document: document};
    this._dtEventActionService.sendEventAction<DtDocumentOpenAction>(DtEventAction.DOCUMENT_OPEN, openAction);
  }

  public openViewerFromBlob(imageBlob: Blob): void {
    const openAction: DtDocumentOpenAction = {imageBlob: imageBlob};
    this._dtEventActionService.sendEventAction<DtDocumentOpenAction>(DtEventAction.DOCUMENT_OPEN, openAction);
  }

  public onOpenViewer(): Observable<DtDocumentOpenAction> {
    return this._dtEventActionService.listenEventAction<DtDocumentOpenAction>(DtEventAction.DOCUMENT_OPEN);
  }

  public closeViewer(document: DtDocument): void {
    this._dtEventActionService.sendEventAction<DtDocument>(DtEventAction.DOCUMENT_CLOSED, document);
  }

  public onCloseViewer(): Observable<DtDocument> {
    return this._dtEventActionService.listenEventAction<DtDocument>(DtEventAction.DOCUMENT_CLOSED);
  }
}
