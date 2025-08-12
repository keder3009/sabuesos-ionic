import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

import { SearchZonePage } from './search-zone.page';

const routes: Routes = [
  {
    path: '',
    component: SearchZonePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchZonePageRoutingModule { }
