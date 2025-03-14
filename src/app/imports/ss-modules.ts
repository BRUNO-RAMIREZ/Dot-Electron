import {
  CmtAttachmentsClipboardModule,
  CmtMessageInputModule,
  CmtMessagesModule,
  CmtMessagesPanelModule
} from '@set-social-services/comment';
import {CommentCoreModule} from '@set-social-services/comment-core';
import {CommentViewModule} from '@set-social-services/comment-view';
import {SsCommentsUnreadMessagesModule, SsThumbnailModule} from '@set-social-services/comments-plugin';
import {SsThumbnailWrapperModule} from '@set-social-services/common-component';
import {BrowserStorageProviderType, CommonCoreModule} from '@set-social-services/common-core';
import {CustomElementModule} from '@set-social-services/common-custom-element';
import {SsPluginModule} from '@set-social-services/common-plugin';
import {SdvModule} from '@set-social-services/sdv';
import {SocialTextModule} from '@set-social-services/social-text';
import {DtThumbnailWrapperComponent} from '../../assets/components/dt-thumbnail-wrapper/dt-thumbnail-wrapper.component';
import {commentViewConfig, socialTextConfig} from '../../environments/environment';


/**
 * @author Bruno Ramirez
 */
export const ssModules = [
  CmtAttachmentsClipboardModule,
  CmtMessageInputModule,
  CmtMessagesModule,
  CmtMessagesPanelModule,
  CommentCoreModule.forRoot(),
  CommentViewModule.forRoot(commentViewConfig),
  CommonCoreModule.forRoot({
    browserStorageOptions: {
      browserStorageProvider: BrowserStorageProviderType.SESSION_STORAGE
    }
  }),
  CustomElementModule.forRoot([
    DtThumbnailWrapperComponent
  ]),
  SdvModule,
  SocialTextModule.forRoot(socialTextConfig),
  SsCommentsUnreadMessagesModule.forRoot(),
  SsPluginModule,
  SsThumbnailModule.forRoot(),
  SsThumbnailWrapperModule,
];
