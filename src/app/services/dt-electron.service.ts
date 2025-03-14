import {Injectable, NgZone} from '@angular/core';
import {DtElectronMessage} from '../interfaces/dt-electron-message.interface';

@Injectable()
export class DtElectronService {
  private _electron: any;

  constructor(private _ngZone: NgZone) {
    this._electron = (window as any).electron;
  }

  public sendMessage<T>(message: DtElectronMessage<T>): void {
    if (!this._electron) return;
    this._electron.sendMessage(message.channel, message.payload);
  }

  public onMessage<T>(channel: string, callback: (message: DtElectronMessage<T>) => void): void {
    if (!this._electron) return;
    this._electron.onMessage(channel, (message: DtElectronMessage<T>) => this._ngZone.run(() => callback(message)));
  }

  public invoke<T>(message: DtElectronMessage<T>): Promise<T> {
    if (!this._electron) return Promise.reject('Electron is not available');
    return this._electron.invoke(message.channel, message?.payload);
  }

  public removeChannel(channel: string): void {
    if (!this._electron) return;
    this._electron.removeListener(channel);
  }
}
