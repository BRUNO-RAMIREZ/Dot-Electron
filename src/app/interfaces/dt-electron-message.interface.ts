export interface DtElectronMessage<T = any> {
  channel: string;
  payload?: T;
}
