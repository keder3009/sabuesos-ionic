import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DonationsPageRoutingModule } from './donations-routing.module';

import { DonationsPage } from './donations.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      IonicModule,
      SharedModule,
      DonationsPageRoutingModule
    ],
    declarations: [DonationsPage]
  })
export class DonationsPageModule { }