import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ShelterAnimalDetailPageRoutingModule } from './shelter-animal-detail-routing.module';
import { ShelterAnimalDetailPage } from './shelter-animal-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShelterAnimalDetailPageRoutingModule
  ],
  declarations: [ShelterAnimalDetailPage]
})
export class ShelterAnimalDetailPageModule {}
