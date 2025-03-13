import {Injectable} from '@angular/core';
import {HEADER_TAGS_SESSION} from '../../environments/environment';

export const enum DtHeadersRequest {
  AUTHORIZATION = 'Authorization',
  BEARER = 'Bearer',
  TRANSACTION_ID = 'TransactionId',
  X_FINGERPRINT = 'X-FINGERPRINT',
  X_TENANT_ID = 'X-TENANT-ID',
  X_USER_ID = 'X-USERID'
}

export interface DtLoginCredential {
  userId: string;
  tenantId: string;
  accessToken: string;
  rol: string;
  userName: string;
  firstName: string;
  lastName: string;
  fingerPrint: string;
  refreshToken: string;
}

/**
 * @author Ivan Misericordia
 */
@Injectable({
  providedIn: 'root',
})
export class DtTagConfigService {
  private readonly _HEADER_FINGERPRINT: string = 'fingerprint';
  private readonly _TRANSACTION_ID: string = '100';

  public initializeTagConfig(dtLoginCredential: DtLoginCredential): void {
    const map: Map<string, string> = this._getSolutionFieldsCustomize(dtLoginCredential);
    localStorage.setItem(HEADER_TAGS_SESSION, JSON.stringify(Array.from(map.entries())));
    localStorage.setItem(this._HEADER_FINGERPRINT, dtLoginCredential.fingerPrint);
  }

  private _getSolutionFieldsCustomize(dtLoginCredential: DtLoginCredential): Map<string, string> {
    const map: Map<string, string> = new Map();
    map.set(DtHeadersRequest.AUTHORIZATION, `${DtHeadersRequest.BEARER} ${dtLoginCredential.accessToken}`);
    map.set(DtHeadersRequest.TRANSACTION_ID, this._TRANSACTION_ID);
    map.set(DtHeadersRequest.X_TENANT_ID, `${dtLoginCredential.tenantId}`);
    map.set(DtHeadersRequest.X_USER_ID, `${dtLoginCredential.userId}`);
    map.set(DtHeadersRequest.X_FINGERPRINT, `${dtLoginCredential.fingerPrint}`);
    return map;
  }
}
