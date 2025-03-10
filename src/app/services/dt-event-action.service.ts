import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {DtEventAction} from '../enums/dt-event-action.enum';

@Injectable()
export class DtEventActionService {
  private _actionsMap: Map<DtEventAction, Subject<any>>;

  constructor() {
    this._actionsMap = new Map<DtEventAction, Subject<any>>();
    this._initActionEvents();
  }

  public sendEventAction<T>(action: DtEventAction, payload: T): void {
    return this._getEventActionSubject<T>(action).next(payload);
  }

  public listenEventAction<T>(action: DtEventAction): Observable<T> {
    return this._getEventActionSubject<T>(action).asObservable();
  }

  private _getEventActionSubject<T>(action: DtEventAction): Subject<T> {
    const subject = this._actionsMap.get(action);
    if (!subject) {
      const errorMessage = 'The event action does not exist!';
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    return subject;
  }

  private _initActionEvents(): void {
    for (let action in DtEventAction) {
      this._actionsMap.set((Number(action)), new Subject<any>());
    }
  }
}
