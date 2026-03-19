import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ShelterAdoptionFormPageRoutingModule } from './shelter-adoption-form-routing.module';
import { ShelterAdoptionFormPage } from './shelter-adoption-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShelterAdoptionFormPageRoutingModule
  ],
  declarations: [ShelterAdoptionFormPage]
})
export class ShelterAdoptionFormPageModule {}
