import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShelterAdoptionFormPage } from './shelter-adoption-form.page';

const routes: Routes = [
  {
    path: '',
    component: ShelterAdoptionFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShelterAdoptionFormPageRoutingModule {}
