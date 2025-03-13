import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtFloatingButtonComponent } from './components/dt-floating-button/dt-floating-button.component';
import { DtPanelComponent } from './components/dt-panel/dt-panel.component';
import {RouterModule} from '@angular/router';
import { DtSideBarComponent } from './components/dt-side-bar/dt-side-bar.component';
import {wallDotModules} from './imports/wall-dot-module';
import {WallBulletinsPanelModule} from '@set-social-services/wall';
import {DtToolsComponent} from './components/dt-tools/dt-tools.component';

@NgModule({
  declarations: [
    DtFloatingButtonComponent,
    DtPanelComponent,
    DtSideBarComponent,
    DtToolsComponent
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
export class SecureModule { }
