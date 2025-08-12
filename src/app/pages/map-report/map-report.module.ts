import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapReportPageRoutingModule } from './map-report-routing.module';

import { MapReportPage } from './map-report.page';
import { UtilsModule } from 'src/app/utils/utils.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapReportPageRoutingModule,
    UtilsModule,
    SharedModule
  ],
  declarations: [MapReportPage]
})
export class MapReportPageModule { }
