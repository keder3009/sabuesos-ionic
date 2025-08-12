import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchZonePageRoutingModule } from './search-zone-routing.module';

import { SearchZonePage } from './search-zone.page';
import { UtilsModule } from 'src/app/utils/utils.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchZonePageRoutingModule,
    UtilsModule,
    SharedModule
  ],
  declarations: [SearchZonePage],
})
export class SearchZonePageModule { }
