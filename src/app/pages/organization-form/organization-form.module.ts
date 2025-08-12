import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrganizationFormPageRoutingModule } from './organization-form-routing.module';

import { OrganizationFormPage } from './organization-form.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrganizationFormPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [OrganizationFormPage]
})
export class OrganizationFormPageModule { }
