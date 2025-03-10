import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DtCropComponent} from './components/dt-crop/dt-crop.component';
import {DtScreenshotComponent} from './components/dt-screenshot/dt-screenshot.component';
import {DtSeeSomethingComponent} from './components/dt-see-something/dt-see-something.component';
import {DtToolsComponent} from './components/dt-tools/dt-tools.component';

const routes: Routes = [
  {path: '', redirectTo: 'secure/aside/tools', pathMatch: 'full'},
  {path: 'secure/aside/tools', component: DtToolsComponent},
  {path: 'secure/full-screen/screenshot', component: DtScreenshotComponent},
  {path: 'secure/full-screen/see-something', component: DtSeeSomethingComponent},
  {path: 'secure/full-screen/crop', component: DtCropComponent},
  {path: '**', redirectTo: 'secure/aside/tools'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
