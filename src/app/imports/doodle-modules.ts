import {DdCoreModule} from '@doodle/core';
import {DdDotViewerModule, DoodleViewerModule} from '@doodle/viewer';
import {SdvComponentsModule, SdvCropModule, SdvSocialMarkupModule} from '@sdv/sdv-components';
import {SdvCoreModule} from '@sdv/sdv-core';
import {ddViewerConfig, sdvCaptionTagsConfig, sdvConfig} from '../../environments/environment';

/**
 * @author Bruno Ramirez
 */
export const doodleModules = [
  SdvSocialMarkupModule.forRoot(),
  SdvCropModule.forRoot(sdvCaptionTagsConfig),
  SdvComponentsModule,
  SdvCoreModule.forRoot(sdvConfig),
  DdCoreModule.forRoot(),
  DoodleViewerModule.forRoot(ddViewerConfig),
  DdDotViewerModule
];
