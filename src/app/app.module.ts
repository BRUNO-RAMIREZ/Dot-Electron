import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {DdHttpConfig} from '@doodle/http-client';
import {defineCustomElements} from '@doodle/thumbnail/loader';
import {CommentReferenceTagsContainerFacade} from '@set-social-services/comment-core';
import {SECURITY_CONFIG} from '@set-social-services/common-http';
import {WEBSOCKET_CONFIG, WEBSOCKET_PATH} from '@set/commons-ws';
import {ReferenceDocumentsFacade, ReferenceTagsFacade} from '@set/social-tags-core/src';
import {SetTagsConfig, TagsConfig} from '@set/social-tags-core/src/config';
import {defaultTenant, prefixWs, securityConfig, tagsConfig, websocketConfig} from '../environments/environment';
import {AppComponent} from './app.component';
import {DtModalViewerComponent} from './components/dt-modal-viewer/dt-modal-viewer.component';
import {DtThumbnailWrapperComponent} from './components/dt-thumbnail-wrapper/dt-thumbnail-wrapper.component';
import {DtHomeComponent} from './dt-home/dt-home.component';
import {DtEntityReferenceFacade} from './facades/dt-entity-reference.facade';
import {doodleModules} from './imports/doodle-modules';
import {ngrxModules} from './imports/ngrx-modules';
import {piModules} from './imports/pi-modules';
import {ssModules} from './imports/ss-modules';
import {DtDocumentService} from './services/dt-document.service';
import {DtTagConfigService} from './services/dt-tag-config.service';

new SetTagsConfig(tagsConfig as TagsConfig);
DdHttpConfig.getSession().setTenantId(defaultTenant);

@NgModule({
  declarations: [
    AppComponent,
    DtHomeComponent,
    DtModalViewerComponent,
    DtThumbnailWrapperComponent
  ],
  imports: [
    BrowserModule,
    ...doodleModules,
    ...ngrxModules,
    ...piModules,
    ...ssModules,
    HttpClientModule
  ],
  providers: [
    DtTagConfigService,
    DtEntityReferenceFacade,
    ReferenceDocumentsFacade,
    ReferenceTagsFacade,
    DtDocumentService,
    {
      provide: WEBSOCKET_PATH,
      useValue: {host: prefixWs, port: ''},
      multi: false
    },
    {
      provide: WEBSOCKET_CONFIG,
      useValue: websocketConfig,
      multi: false
    },
    {
      provide: SECURITY_CONFIG,
      useValue: securityConfig
    },
    {
      provide: CommentReferenceTagsContainerFacade,
      useExisting: DtEntityReferenceFacade
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    defineCustomElements(window);
  }
}
