import {Injectable} from '@angular/core';
import {DtAction} from '../enums/dt-action.enum';
import {DtPayload} from '../interfaces/dt-payload.interface';

@Injectable({
  providedIn: 'root'
})
export class DtElectronService {

  constructor() {
  }

  public sendMessage(action: DtAction, payload: Partial<DtPayload>): void {
    if (!((window as any).electron)) return;

    (window as any).electron.sendMessage(action, payload);
  }

  public onMessage(channel: string, callback: (data: any) => void): void {
    if (!((window as any).electron)) return;

    (window as any).electron.onMessage(channel, callback);
  }
}
