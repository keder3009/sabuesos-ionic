import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogOutPageRoutingModule } from './log-out-routing.module';

import { LogOutPage } from './log-out.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    LogOutPageRoutingModule
  ],
  declarations: [LogOutPage]
})
export class LogOutPageModule { }
