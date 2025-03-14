import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DtFloatingButtonComponent} from './secure/components/dt-floating-button/dt-floating-button.component';
import {DtCropComponent} from './secure/components/dt-full-screen/dt-crop/dt-crop.component';
import {DtFullScreenComponent} from './secure/components/dt-full-screen/dt-full-screen.component';
import {DtScreenshotComponent} from './secure/components/dt-full-screen/dt-screenshot/dt-screenshot.component';
import {DtSeeSomethingComponent} from './secure/components/dt-full-screen/dt-see-something/dt-see-something.component';
import {DtPanelComponent} from './secure/components/dt-panel/dt-panel.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'floating-button',
    pathMatch: 'full'
  },
  {
    path: 'secure',
    children: [
      {
        path: '',
        redirectTo: 'floating-button',
        pathMatch: 'full'
      },
      {
        path: 'floating-button',
        component: DtFloatingButtonComponent
      },
      {
        path: 'panel',
        component: DtPanelComponent
      },
      {
        path: 'full-screen',
        children: [
          {path: 'screenshot', component: DtScreenshotComponent},
          {path: 'see-something', component: DtSeeSomethingComponent},
          {path: 'crop', component: DtCropComponent},
          {path: '', component: DtFullScreenComponent}
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'secure/floating-button'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
