/**
 * @author Francisco Camacho
 */
import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {DoodleThumbnailModule} from '@doodle/viewer';
import {SS_PLUGINS, SsPlugins} from '@set-social-services/common-plugin';
import {DtWallThumbnailComponent} from './dt-wall-thumbnail.component';

@NgModule({
  imports: [
    CommonModule,
    DoodleThumbnailModule
  ],
  declarations: [
    DtWallThumbnailComponent
  ],
  exports: [
    DtWallThumbnailComponent
  ],
  entryComponents: [
    DtWallThumbnailComponent
  ]
})
export class DtWallThumbnailModule {
  constructor(@Optional() @SkipSelf() parentModule?: DtWallThumbnailModule) {
    if (parentModule) {
      throw new Error(
        'DtWallThumbnailModule is already loaded. Import it in your root module only.');
    }
  }

  public static forRoot(): ModuleWithProviders<DtWallThumbnailModule> {
    const PLUGIN_IDENTIFIER: string = 'DOT_THUMBNAIL';
    return {
      ngModule: DtWallThumbnailModule,
      providers: [
        {
          provide: SS_PLUGINS,
          useValue: <SsPlugins>{component: DtWallThumbnailComponent, identifier: PLUGIN_IDENTIFIER},
          multi: true
        }
      ]
    };
  }
}
