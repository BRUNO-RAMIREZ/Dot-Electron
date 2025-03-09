import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DtFloatingButtonComponent } from './secure/components/dt-floating-button/dt-floating-button.component';
import { DtPanelComponent } from './secure/components/dt-panel/dt-panel.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'secure/floating-button',
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
