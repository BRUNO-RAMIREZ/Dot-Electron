import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

declare global {
  interface Window {
    electronAPI: {
      initTakeScreenshot: () => void;
      initSeeSomething: () => Promise<ArrayBufferLike>;
      onRenderScreenshot: (callback: (buffer: ArrayBufferLike) => void) => void;
      buildBrowserWindowFromRoute: (route: string) => void;
      setIgnoreMouseEvents: (ignore: boolean) => void;
      setFullScreen: (isFullScreen: boolean) => void;
    };
  }
}
