import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListReportsPageRoutingModule } from './list-reports-routing.module';
import { ListReportsPage } from './list-reports.page';
import { UtilsModule } from 'src/app/utils/utils.module';
import { PipesModule } from 'src/app/utils/pipes/pipes.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UtilsModule,
    ListReportsPageRoutingModule,
    PipesModule,
    NgSelectModule
  ],
  declarations: [ListReportsPage],
  exports: [ListReportsPage],
})
export class ListReportsPageModule { }
