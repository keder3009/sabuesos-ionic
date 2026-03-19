import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ShelterAnimalsListPageRoutingModule } from './shelter-animals-list-routing.module';
import { ShelterAnimalsListPage } from './shelter-animals-list.page';
import { UtilsModule } from 'src/app/utils/utils.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShelterAnimalsListPageRoutingModule,
    UtilsModule
  ],
  declarations: [ShelterAnimalsListPage]
})
export class ShelterAnimalsListPageModule {}
