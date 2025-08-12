import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppAdminAdsComponent } from './app-admin-ads.component';

const routes: Routes = [
  {
    path: '',
    component: AppAdminAdsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminAdsPageRoutingModule {}
