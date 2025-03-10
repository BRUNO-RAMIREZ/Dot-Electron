import {DtMinimizedView} from './dt-minimized-view.interface';
import {DtMouseCoordinates} from './dt-mouse-coordinates.interface';
import {DtStyleProperty} from './dt-style-property.interface';

export interface DtPayload {
  route?: string;
  style?: DtStyleProperty[];
  mouseCoordinates?: DtMouseCoordinates;
  tabId?: number;
  minimizedViews?: DtMinimizedView[];
  triggerSource?: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}
