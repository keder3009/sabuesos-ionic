import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrganizationFormPage } from './organization-form.page';

const routes: Routes = [
  {
    path: '',
    component: OrganizationFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationFormPageRoutingModule {}
