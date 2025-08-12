import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ViewReportPageRoutingModule } from './view-report-routing.module';
import { ViewReportPage } from './view-report.page';
import { UtilsModule } from 'src/app/utils/utils.module';
import { ChatService } from 'src/app/services/chat.service';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewReportPageRoutingModule,
    UtilsModule,
    SharedModule
  ],
  declarations: [ViewReportPage],
  providers: [ChatService]
})
export class ViewReportPageModule { }
