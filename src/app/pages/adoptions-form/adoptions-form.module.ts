import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AdoptionsFormPageRoutingModule } from './adoptions-form-routing.module';
import { AdoptionsFormPage } from './adoptions-form.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { UtilsModule } from 'src/app/utils/utils.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdoptionsFormPageRoutingModule,
    SharedModule,
    UtilsModule,
  ],
  declarations: [AdoptionsFormPage],
})
export class AdoptionsFormPageModule {}
