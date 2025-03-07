import {ViewerViewConfig} from '@doodle/viewer';
import {SdvCaptionTagConfig} from '@sdv/sdv-components';
import {SdvConfig} from '@sdv/sdv-core';
import {MovingTicklerDesignEnum} from '@set-social-services/comment-api';
import {CommentViewConfig, ThumbnailWrapperSdvComponent} from '@set-social-services/comment-view';
import {SocialTextConfig} from '@set-social-services/social-text';
import {WebsocketConfig} from '@set/commons-ws';
import {TagsConfig} from '@set/social-tags-core/src/config';
import {SocialProfileConfigProperties} from '@set/social-user-profile';
import {UserTagsConfig} from '@set/user-tag-ng-plugin/lib/config/user-tags.config';
import {DtThumbnailWrapperComponent} from '../app/components/dt-thumbnail-wrapper/dt-thumbnail-wrapper.component';
import {DtSpellcheckUtility} from '../app/utilis/dt-spellcheck.utility';

export const environment = {
  production: false
};

export const dotServer = {
  lbUri: 'https://dev.platform.ss.set.digitalharbor.us'
};
export const piSsoUrl: string = `${dotServer.lbUri}/pi/pi-sso`;

export const defaultTenant = 'dtde';

export const SOCIAL_TEXT_BASE_PATH: string = 'https://social-text.digitalharbor.us';

export const prefixWs: String = '';

export const websocketConfig: WebsocketConfig = {
  enableDebugging: true
};

export const ddViewerConfig: ViewerViewConfig = {
  doodleStandAlonePath: 'https://dev.ss.set.digitalharbor.us/dot-app',
  socialTextPath: SOCIAL_TEXT_BASE_PATH
};

export const sdvConfig: SdvConfig = {
  prefixSds: 'sds'
};

export const sdvCaptionTagsConfig: SdvCaptionTagConfig = {
  captionTags: ['Bug Evidence', 'Requirements']
};

export const socialProfileConfig: SocialProfileConfigProperties = {
  tenantId: defaultTenant,
  basicAuthentication: 'c2V0X3NvY2lhbHNlcnZpY2VzOlZYaHVhbE4xV2xoRFUyNVFLMDVuUTBwamN6VkhVbFJyUVhKek9GUXZRbmhsUzB0YVpYSnVNSGQ2VTIxbk5tWnpOWFk1TWtkT1QwTnNOVGRuYzNSM05sWmtVRGRZYzFOWVNrcFJkSGM0VEUxUWVtbDFlRlp0UjFCWk1EbExWM1JwTkhCV2R6aHNRVmhRUld4SGEwTnNOSEJNYlVWYWNXWmllQ3RtTmxGVlkwSkNXa055WlZSTUt6azBkMnczTkhod05FVlVkRmxKTDBodlJESXJjRzVIU2psamJIVk1WemxzWjBWbVprSk1jazFZYm1kR2FYZFpkbFJPVDB0NFYyTktjREZzVERCak0xcFBWbGRWUzB4WVRsSjVLek5OUVdaaVNtdFZNMW81WlVKU0szVnBLMUZOZG5GblVYUlRWV1JQY0VKT1pHaERkblZ3ZW5wWmRVSlRTekJJYUhJNGIzRjRjalZsU1VneE5rdDNSemRRWlV0UmFGY3ZRVmhPUVc1UWFIZGxjbTFFTTJ0VU5rVkZTME4yYkRoWlMzaHdlVWRGY1N0WWRHbENMMkowYWxGQkx6bERZbEV5TVdWTFZtUmxibk5tZURaM1BUMD0=',
  prefixName: 'social-profile-service'
};

export const thumbnailSdvWrapper: ThumbnailWrapperSdvComponent = {
  selector: 'dt-thumbnail-wrapper',
  component: DtThumbnailWrapperComponent
};

export const commentViewConfig: CommentViewConfig = {
  doodleSettings: {
    defaultThumbnail: {
      actionableSelector: 'sdv-thumbnail-image',
      thumbnailWrapper: thumbnailSdvWrapper
    }
  },
  wallSettings: {
    bulletinOptions: {
      drafts: true,
      pluginDesigns: {
        'DOODLE_THUMBNAIL': [
          MovingTicklerDesignEnum.GREEN,
          MovingTicklerDesignEnum.ORANGE,
          MovingTicklerDesignEnum.PURPLE,
          MovingTicklerDesignEnum.RED,
          MovingTicklerDesignEnum.SKY_BLUE,
          MovingTicklerDesignEnum.YELLOW_NOTE
        ],
        'DOT_THUMBNAIL': [
          MovingTicklerDesignEnum.GREEN,
          MovingTicklerDesignEnum.ORANGE,
          MovingTicklerDesignEnum.PURPLE,
          MovingTicklerDesignEnum.RED,
          MovingTicklerDesignEnum.SKY_BLUE,
          MovingTicklerDesignEnum.YELLOW_NOTE
        ],
        'YEDY_TICKET_INFO': [
          MovingTicklerDesignEnum.ORANGE,
          MovingTicklerDesignEnum.PURPLE
        ]
      }
    },
    notificationOptions: {
      externalNotifications: true
    }
  }
};

export const HEADER_TAGS_SESSION = 'SOCIAL_SERVICE_HEADER_TAGS_SESSION';
export const SOCIAL_SERVICE_USER_ID_SESSION = 'SOCIAL_SERVICE_USER_ID_SESSION';

export const tagsConfig: Partial<TagsConfig> = {
  topicTagsConfig: {
    limit: 5,
    applicationName: 'YEDY',
    averageThreshold: 0.8,
    linkedTagThreshold: 0.3,
    wordThreshold: 0.5
  },
  sessionStorage: {
    headers: `${HEADER_TAGS_SESSION}`,
    storageActionTagSolution: 'storage-action-tag-solution-fields'
  },
  localStorageConfig: {
    headers: `${HEADER_TAGS_SESSION}`,
    storageActionTagSolution: 'storage-action-tag-solution-fields'
  },
  defaultValue: {
    defaultImagAvatar: '214f97ef-93da-43e8-9c7e-3fe9e201dce1',
    serverPathTags: 'tag-service',
    serverPathDocuments: 'sds',
    serverPathProfile: 'social-profile-service/',
    serverPathSearch: '',
    serverPathSocialImage: 'social-image',
    imagePath: 'set/socialServices/identity/dmsDocument/',
    isLocalStorage: true
  },
};

export const userTagsConfig: Partial<UserTagsConfig> = {
  storeType: {isLocalStorage: false},
  nameFieldStorage: `${SOCIAL_SERVICE_USER_ID_SESSION}`,
  profileConfig: {lastCollaboratorsMaxFrequency: 10, lastCollaboratorsMaxRegistersQuantity: 10},
  userCardConfig: {enableChatButton: true, enableCallButton: false, enableVideoButton: false},
  showRoleOnList: true,
  showUserNameOnList: false,
  rolesToFilter: ['dev-role', 'qa-role', 'pm-role']
};

export const securityConfig = {
  basicAuthentication: 'c2V0X3NvY2lhbHNlcnZpY2VzOlZYaHVhbE4xV2xoRFUyNVFLMDVuUTBwamN6VkhVbFJyUVhKek9GUXZRbmhsUzB0YVpYSnVNSGQ2VTIxbk5tWnpOWFk1TWtkT1QwTnNOVGRuYzNSM05sWmtVRGRZYzFOWVNrcFJkSGM0VEUxUWVtbDFlRlp0UjFCWk1EbExWM1JwTkhCV2R6aHNRVmhRUld4SGEwTnNOSEJNYlVWYWNXWmllQ3RtTmxGVlkwSkNXa055WlZSTUt6azBkMnczTkhod05FVlVkRmxKTDBodlJESXJjRzVIU2psamJIVk1WemxzWjBWbVprSk1jazFZYm1kR2FYZFpkbFJPVDB0NFYyTktjREZzVERCak0xcFBWbGRWUzB4WVRsSjVLek5OUVdaaVNtdFZNMW81WlVKU0szVnBLMUZOZG5GblVYUlRWV1JQY0VKT1pHaERkblZ3ZW5wWmRVSlRTekJJYUhJNGIzRjRjalZsU1VneE5rdDNSemRRWlV0UmFGY3ZRVmhPUVc1UWFIZGxjbTFFTTJ0VU5rVkZTME4yYkRoWlMzaHdlVWRGY1N0WWRHbENMMkowYWxGQkx6bERZbEV5TVdWTFZtUmxibk5tZURaM1BUMD0='
};

export const nlpAiTrainingSocialText = {
  NLP_SERVER_AI_TRAINING: 'https://social-text.digitalharbor.us/spacy-nlp-server-ai-training/'
};

export const socialTextConfig: SocialTextConfig = {
  socialTextAttributes: {
    enableDojis: 'false',
    initialEditor: true,
    language: 'en-US',
    nlpServerAiTraining: nlpAiTrainingSocialText.NLP_SERVER_AI_TRAINING,
    personalityIcons: 'true',
    showImageToolbar: 'false',
    spellcheckAllowedWords: DtSpellcheckUtility.getAllAllowedWords(),
    templates: 'social-services,ss-bables',
    templatesExcept: 'Theme,Bables,yd_bables,ss-header-templates,callout-templates,ST-2-5-0,ss-question-and-answer',
    theme: '{%quot%NumberBullet%quot%:%quot%SSBableBase%quot%}',
    wrappable: 'false'
  }
};

export const BASE_URL = 'https://dev.platform.ss.set.digitalharbor.us';

export const SOCIAL_SERVICES_PATH = {
  IDENTITY_DMS_DOCUMENT: `${BASE_URL}/set/socialServices/identity/dmsDocument/`,
  DOODLE_DOCUMENTS: `${BASE_URL}/doodle/documents`,
};

