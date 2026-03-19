import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShelterAnimalDetailPage } from './shelter-animal-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ShelterAnimalDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShelterAnimalDetailPageRoutingModule {}
