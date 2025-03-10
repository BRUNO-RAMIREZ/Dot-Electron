import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {DdHttpConfig} from '@doodle/http-client';
import {defineCustomElements} from '@doodle/thumbnail/loader';
import {
  CommentReferenceTagsContainerFacade,
  CommentWallBulletinsContainerFacade,
  CommentWallNotificationBulletinContainerFacade
} from '@set-social-services/comment-core';
import {SECURITY_CONFIG} from '@set-social-services/common-http';
import {WEBSOCKET_CONFIG, WEBSOCKET_PATH} from '@set/commons-ws';
import {ReferenceDocumentsFacade, ReferenceTagsFacade} from '@set/social-tags-core/src';
import {SetTagsConfig, TagsConfig} from '@set/social-tags-core/src/config';
import {defaultTenant, prefixWs, securityConfig, tagsConfig, websocketConfig} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DtCropComponent} from './components/dt-crop/dt-crop.component';
import {DtModalViewerComponent} from './components/dt-modal-viewer/dt-modal-viewer.component';
import {DtScreenshotComponent} from './components/dt-screenshot/dt-screenshot.component';
import {DtSeeSomethingComponent} from './components/dt-see-something/dt-see-something.component';
import {DtThumbnailWrapperComponent} from './components/dt-thumbnail-wrapper/dt-thumbnail-wrapper.component';
import {DtToolsComponent} from './components/dt-tools/dt-tools.component';
import {DtEntityReferenceFacade} from './facades/dt-entity-reference.facade';
import {doodleModules} from './imports/doodle-modules';
import {ngrxModules} from './imports/ngrx-modules';
import {piModules} from './imports/pi-modules';
import {ssModules} from './imports/ss-modules';
import {DtDocumentService} from './services/dt-document.service';
import {DtEventActionService} from './services/dt-event-action.service';
import {DtEventDocumentActionService} from './services/dt-event-document-action.service';
import {DtTagConfigService} from './services/dt-tag-config.service';
import {SecureModule} from './secure/secure.module';
import {DtCommentsGetDataFacade} from './facades/dt-comments-get-data.facade';
import {DtWallThumbnailModule} from './plugins/dt-wall-thumbnail/dt-wall-thumbnail.module';
import {WallBulletinsContainerFacade, WallNotificationBulletinContainerFacade} from '@set-social-services/wall-core';
import {WallNotificationsModule} from '@set-social-services/wall';


new SetTagsConfig(tagsConfig as TagsConfig);
DdHttpConfig.getSession().setTenantId(defaultTenant);

@NgModule({
  declarations: [
    AppComponent,
    DtModalViewerComponent,
    DtThumbnailWrapperComponent,
    DtSeeSomethingComponent,
    DtScreenshotComponent,
    DtCropComponent,
    DtToolsComponent
  ],
  imports: [
    BrowserModule,
    SecureModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    ...doodleModules,
    ...ngrxModules,
    ...piModules,
    ...ssModules,
    WallNotificationsModule,
  ],
  providers: [
    DtTagConfigService,
    DtEntityReferenceFacade,
    ReferenceDocumentsFacade,
    ReferenceTagsFacade,
    DtDocumentService,
    DtEventDocumentActionService,
    DtEventActionService,
    DtCommentsGetDataFacade,
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
      provide: CommentWallBulletinsContainerFacade,
      useExisting: WallBulletinsContainerFacade
    },
    {
      provide: CommentWallNotificationBulletinContainerFacade,
      useExisting: WallNotificationBulletinContainerFacade
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
