import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DtElectronService {

  constructor() { }

  public sendMessage(channel: string, data: any): void {
    if((window as any).electron) {
      (window as any).electron.sendMessage(channel, data);
    }
  }

  public onMessage(channel: string, callback: (data: any) => void): void {
    if ((window as any).electron) {
      (window as any).electron.onMessage(channel, callback);
    }
  }}
