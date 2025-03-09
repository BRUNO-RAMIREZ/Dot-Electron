import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';

/**
 * @author Bruno Ramirez
 */
export const ngrxModules = [
  StoreModule.forRoot({}, {}),
  EffectsModule.forRoot([]),
  StoreDevtoolsModule.instrument({maxAge: 50, logOnly: true}),
];
