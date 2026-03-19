import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShelterAnimalsListPage } from './shelter-animals-list.page';

const routes: Routes = [
  {
    path: '',
    component: ShelterAnimalsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShelterAnimalsListPageRoutingModule {}
