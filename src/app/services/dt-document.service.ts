import {Injectable} from '@angular/core';
import {DdDocumentAndVersionResponse, DdUploadToLibraryRequest} from '@doodle/api';
import {DdUploadDocumentLibraryFacade} from '@doodle/http-client';
import {DD_DOT_FRAMES, selectRandomIndexByArray} from '@doodle/viewer';
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';
import {EMPTY} from '../constants';

/**
 * @author Bruno Ramirez
 */
@Injectable()
export class DtDocumentService {
  public saveDocumentInLibrary(buffer: ArrayBufferLike): Observable<DdDocumentAndVersionResponse> {
    const file = this.arrayBufferToFile(buffer);
    const uploadDocumentToLibrary = this.buildUploadToLibraryRequest(`${file.name}.png`, `${file.name}`);
    return this.uploadDocumentToLibrary(uploadDocumentToLibrary, file).pipe(take(1));
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
}
