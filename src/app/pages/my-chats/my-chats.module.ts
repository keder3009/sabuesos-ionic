import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyChatsPageRoutingModule } from './my-chats-routing.module';

import { MyChatsPage } from './my-chats.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MyChatsPageRoutingModule
  ],
  declarations: [MyChatsPage]
})
export class MyChatsPageModule { }
