import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdoptionsFormPage } from './adoptions-form.page';

const routes: Routes = [
  {
    path: '',
    component: AdoptionsFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdoptionsFormPageRoutingModule {}
