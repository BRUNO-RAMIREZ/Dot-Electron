/**
 * @author Ivan Misericordia
 */
import {Injectable} from '@angular/core';
import {CommentEntityReference, CommentRecentDocument} from '@set-social-services/comment-api';
import {DocumentInterface, ProfileTypes, ReferenceDocumentsFacade, ReferenceTagsFacade} from '@set/social-tags-core/src';
import {AsyncSubject, Observable} from 'rxjs';
import {mergeMap} from 'rxjs/operators';

@Injectable()
export class DtEntityReferenceFacade {
  constructor(private _referenceDocumentsFacade: ReferenceDocumentsFacade,
              private _referenceTagsFacade: ReferenceTagsFacade) {
  }

  private static _buildRecentDocuments(documentsRecently: DocumentInterface[]): Observable<CommentRecentDocument[]> {
    const attachments: AsyncSubject<CommentRecentDocument[]> = new AsyncSubject<CommentRecentDocument[]>();
    let attachmentList: CommentRecentDocument[] = [];

    if (documentsRecently && !!documentsRecently.length) {
      attachmentList = documentsRecently.map((document: DocumentInterface) => {
        return {
          documentId: document.additionalDocumentInfo.document,
          icon: document.icon,
          imageUrl: document.imageUrl,
          label: document.label,
          versionId: document.additionalDocumentInfo.documentVersion
        };
      });

      attachments.next(attachmentList);
      attachments.complete();
    }

    return attachments.asObservable();
  }

  public getDocumentsRecently(): Observable<CommentRecentDocument[]> {
    return this._referenceDocumentsFacade.getDocumentsRecentlyProfile([ProfileTypes.VIEW_DOCUMENT])
      .pipe(mergeMap((documentsRecently: DocumentInterface[]) => DtEntityReferenceFacade._buildRecentDocuments(documentsRecently)));
  }

  public getIssuesRecently(): Observable<CommentEntityReference[]> {
    return this._referenceTagsFacade.getIssuesRecently();
  }
}
