import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminAdsPageRoutingModule } from './app-admin-ads-routing.module';

import { AppAdminAdsComponent } from './app-admin-ads.component'; // ← Cambiar import
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateAdModalComponent } from './create-ad-modal/create-ad-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    AdminAdsPageRoutingModule
  ],
  declarations: [AppAdminAdsComponent, CreateAdModalComponent],
  schemas: []
})
export class AdminAdsPageModule { }