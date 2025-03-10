/**
 * @author Josue Jimenez
 */
export interface DtDocumentOpenAction {
  imageBlob?: Blob;
  document?: DtDocument;
}

export interface DtDocument {
  documentId: number;
  versionId: number;
  documentToCompare?: DtDocument;
  documentsCarousel?: DtDocument[];
  showDocumentTitle?: boolean;
}
