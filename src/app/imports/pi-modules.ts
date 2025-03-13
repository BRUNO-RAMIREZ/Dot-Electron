import {NoodleCoreModule} from '@set/noodle-core';
import {ReferenceTagsCustomComponentsModule} from '@set/reference-tags-custom-components';
import {ReferenceTagsNgPluginModule} from '@set/reference-tags-ng-plugin';
import {SocialUserProfileModule, SocialUserProfileStateModule} from '@set/social-user-profile';
import {TopicTagsNgPluginModule} from '@set/topic-tags-ng-plugin';
import {UserTagNgPluginModule} from '@set/user-tag-ng-plugin';
import {WebTagsNgPluginModule} from '@set/web-tags-ng-plugin';
import {socialProfileConfig, userTagsConfig} from '../../environments/environment';

/**
 * @author Bruno Ramirez
 */
export const piModules = [
  TopicTagsNgPluginModule.forRoot({confidenceValue: 0.6, enableUnderline: false}),
  UserTagNgPluginModule.forRoot(userTagsConfig),
  SocialUserProfileModule.forRoot(socialProfileConfig),
  SocialUserProfileStateModule,
  ReferenceTagsNgPluginModule.forRoot({blockPinInTextArea: false}),
  WebTagsNgPluginModule.forRoot({openUrlInNewTab: true}),
  NoodleCoreModule.forRoot(),
  ReferenceTagsCustomComponentsModule
];
