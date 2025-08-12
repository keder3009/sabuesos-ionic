import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyReportsPageRoutingModule } from './my-reports-routing.module';

import { MyReportsPage } from './my-reports.page';
import { UtilsModule } from 'src/app/utils/utils.module';
import { PipesModule } from 'src/app/utils/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UtilsModule,
    MyReportsPageRoutingModule,
    PipesModule,
    SharedModule
  ],
  declarations: [MyReportsPage],
})
export class MyReportsPageModule { }
