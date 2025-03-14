import {DtElectronMessage} from '../interfaces/dt-electron-message.interface';

/**
 * @author Bruno Ramirez
 */
export function buildElectronMessage<T>(channel: string, payload?: T): DtElectronMessage<T> {
  return {
    channel,
    payload
  }
}