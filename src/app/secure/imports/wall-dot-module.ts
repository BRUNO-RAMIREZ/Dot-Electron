/**
 * @author Francisco Camacho
 */
import {WallModule} from '@set-social-services/wall';
import {WallApiModule} from '@set-social-services/wall-api';
import {WallCoreModule} from '@set-social-services/wall-core';
import {WallViewModule} from '@set-social-services/wall-view';
import {wallConfig} from '../../../environments/environment';

export const wallDotModules = [
  WallApiModule,
  WallCoreModule.forRoot(),
  WallModule,
  WallViewModule.forRoot(wallConfig)
];
