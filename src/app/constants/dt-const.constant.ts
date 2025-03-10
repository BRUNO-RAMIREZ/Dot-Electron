/**
 * @author Ivan Misericordia
 */
import {DdProjectScope} from '@doodle/annotations';

export const EMPTY: string = '';
export const SPACE_STRING: string = ' ';

// Input type
export const PASSWORD: string = 'password';
export const TEXT: string = 'text';

// Reactive forms
export const REQUIRED: string = 'required';
export const MAX_LENGTH: string = 'maxlength';
export const MIN_LENGTH: string = 'minlength';
export const MATCH: string = 'match';
export const EMAIL: string = 'email';
export const CREDENTIALS: string = 'credentials';
export const CONFIRM_PASSWORD: string = 'confirmPassword';
export const USERNAME: string = 'username';
export const DOCUMENT_ID = 'documentId';
export const VERSION_ID = 'versionId';
export const ANNOTATION_ID = 'annotationId';
export const dtProjectConfig = {
  scaleX: 1,
  scaleY: 1,
  disableMainToolbar: true,
  enabledAutoResize: true,
  disableContextMenu: true,
  disableShapeDetection: true,
  autoSave: true,
  styles: {
    top: '0',
    left: '0',
    position: 'fixed',
    zIndex: '2'
  },
  shapeOptionsConfig: {
    showColorOptionsOnly: true
  },
  projectScope: DdProjectScope.DOT_VIEWER
};
export const ASIDE = 'aside';
export const CLOSED_VIEW = 'closed-view';
export const FULL_SCREEN = 'full-screen';
export const SECURE = 'secure';
export const WALL = 'wall';
export const SEE_SOMETHING_NAME = 'see-something';
export const CROP_NAME = 'crop';
export const SCREENSHOT_NAME = 'screenshot';
export const SECURE_ASIDE = `${SECURE}/${ASIDE}`;
export const SECURE_ASIDE_WALL = `${SECURE_ASIDE}/${WALL}`;
export const SECURE_CLOSED_VIEW = `${SECURE}/${CLOSED_VIEW}`;
export const SECURE_FULL_SCREEN = `${SECURE}/${FULL_SCREEN}`;
