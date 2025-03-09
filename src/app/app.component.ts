import {Component, Injector} from '@angular/core';
import {DtLocalLoginTest} from './util/dt-local-login-test';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private _localLoginTest: DtLocalLoginTest | undefined;

  constructor(private _injector: Injector) {
    this._localLoginTest = new DtLocalLoginTest(this._injector);
    this._localLoginTest.initSession();
  }
}
