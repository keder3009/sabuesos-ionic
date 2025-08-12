import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainTabPageRoutingModule } from './main-tab-routing.module';

import { MainTabComponent } from './main-tab.component';
import { DonationsPageModule } from '../donations/donations.module';
import { SupportPageModule } from '../support/support.module';
import { UtilsModule } from 'src/app/utils/utils.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListReportsPageModule } from '../list-reports/list-reports.module';
import { PipesModule } from 'src/app/utils/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainTabPageRoutingModule,
    DonationsPageModule,
    SupportPageModule,
    UtilsModule,
    SharedModule,
    ListReportsPageModule,
    PipesModule,
  ],
  declarations: [MainTabComponent],
})
export class MainTabPageModule {}
