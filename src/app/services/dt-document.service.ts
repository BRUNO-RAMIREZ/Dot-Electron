import {Injectable} from '@angular/core';
import {
  DdDocumentAndVersionResponse,
  DdDocumentResponse,
  DdDocumentVersionResponse,
  DdResourceRequest,
  DdUploadToLibraryRequest
} from '@doodle/api';
import {DdUploadDocumentLibraryFacade} from '@doodle/http-client';
import {DD_DOT_FRAMES, selectRandomIndexByArray} from '@doodle/viewer';
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';
import {ANNOTATION_ID, DOCUMENT_ID, EMPTY, VERSION_ID} from '../constants';

/**
 * @author Bruno Ramirez
 */
@Injectable()
export class DtDocumentService {
  private _initialDocumentResources: DdResourceRequest[];

  constructor() {
    this._initialDocumentResources = [];
  }

  public saveDocumentInLibrary(buffer: ArrayBufferLike, fileName: string): Observable<DdDocumentAndVersionResponse> {
    const file = this.arrayBufferToFile(buffer);
    const uploadDocumentToLibrary = this.buildUploadToLibraryRequest(`${fileName}.png`, `${fileName}`);
    return this.uploadDocumentToLibrary(uploadDocumentToLibrary, file).pipe(take(1));
  }

  public getInitialDocumentResources(): DdResourceRequest[] {
    return this._initialDocumentResources;
  }

  public setInitialDocumentResources(documentResources: DdResourceRequest[]): void {
    this._initialDocumentResources = documentResources
  }

  public arrayBufferToFile(buffer: ArrayBufferLike, fileName: string = 'file.png', mimeType: string = 'image/png'): File {
    const blob = new Blob([buffer], {type: mimeType});
    return new File([blob], fileName, {type: mimeType});
  }

  public buildUploadToLibraryRequest(name: string, description: string, isSensitive: boolean = false): DdUploadToLibraryRequest {
    return {
      description: description,
      isSensitive: isSensitive,
      name: name,
      title: name,
    };
  }

  public uploadDocumentToLibrary(uploadDocumentToLibrary: DdUploadToLibraryRequest, file: File): Observable<DdDocumentAndVersionResponse> {
    const ddFrameIndex = selectRandomIndexByArray(DD_DOT_FRAMES);
    return DdUploadDocumentLibraryFacade.uploadDocumentToLibrary(uploadDocumentToLibrary, file, EMPTY, DD_DOT_FRAMES[ddFrameIndex]).response$;
  }

  public buildResources(documentId: string, versionId: string, annotationId?: string): DdResourceRequest[] {
    const resources: DdResourceRequest[] = [
      {resourceName: DOCUMENT_ID, resourceValue: documentId},
      {resourceName: VERSION_ID, resourceValue: versionId}

    ];

    annotationId && resources.push({resourceName: ANNOTATION_ID, resourceValue: annotationId});

    return resources;
  }

  public buildDocumentDetail(document: DdDocumentResponse, documentVersion: DdDocumentVersionResponse): DdDocumentAndVersionResponse {
    return {
      document: document,
      documentVersion: documentVersion
    };
  }
}
