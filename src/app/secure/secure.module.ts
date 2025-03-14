import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {WallBulletinsPanelModule} from '@set-social-services/wall';
import {DtFloatingButtonComponent} from './components/dt-floating-button/dt-floating-button.component';
import {DtCropComponent} from './components/dt-full-screen/dt-crop/dt-crop.component';
import {DtFullScreenComponent} from './components/dt-full-screen/dt-full-screen.component';
import {DtScreenshotComponent} from './components/dt-full-screen/dt-screenshot/dt-screenshot.component';
import {DtSeeSomethingComponent} from './components/dt-full-screen/dt-see-something/dt-see-something.component';
import {DtPanelComponent} from './components/dt-panel/dt-panel.component';
import {DtSideBarComponent} from './components/dt-side-bar/dt-side-bar.component';
import {DtToolsComponent} from './components/dt-tools/dt-tools.component';
import {wallDotModules} from './imports/wall-dot-module';

@NgModule({
  declarations: [
    DtFloatingButtonComponent,
    DtPanelComponent,
    DtSideBarComponent,
    DtToolsComponent,
    DtFullScreenComponent,
    DtSeeSomethingComponent,
    DtScreenshotComponent,
    DtCropComponent
  ],
  imports: [
    ...wallDotModules,
    CommonModule,
    RouterModule,
    WallBulletinsPanelModule,
  ],
  exports: [
    DtFloatingButtonComponent,
    DtPanelComponent
  ]
})
export class SecureModule {
}
