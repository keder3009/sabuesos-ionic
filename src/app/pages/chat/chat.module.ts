import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChatPageRoutingModule } from './chat-routing.module';
import { ChatPage } from './chat.page';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { ChatService } from 'src/app/services/chat.service';
import { environment } from 'src/environments/environment';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageRoutingModule,
    SharedModule
  ],
  declarations: [ChatPage],
  providers: [ChatService]
})
export class ChatPageModule { }
