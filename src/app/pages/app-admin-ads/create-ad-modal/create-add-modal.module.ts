// src/app/pages/app-admin-ads/create-ad-modal/create-ad-modal.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CreateAdModalComponent } from './create-ad-modal.component';

@NgModule({
  declarations: [CreateAdModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule
  ],
  exports: [CreateAdModalComponent]
})
export class CreateAdModalModule { }