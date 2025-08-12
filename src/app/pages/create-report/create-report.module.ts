import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateReportPageRoutingModule } from './create-report-routing.module';

import { CreateReportPage } from './create-report.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { UtilsModule } from 'src/app/utils/utils.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateReportPageRoutingModule,
    SharedModule,
    UtilsModule,
    ReactiveFormsModule,
  ],
  declarations: [CreateReportPage],
})
export class CreateReportPageModule { }
