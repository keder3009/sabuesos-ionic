import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VerifyEmailPageRoutingModule } from './verify-email-routing.module';
import { VerifyEmailPage } from './verify-email.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SharedModule,
    VerifyEmailPageRoutingModule
  ],
  declarations: [VerifyEmailPage]
})
export class VerifyEmailPageModule { }
