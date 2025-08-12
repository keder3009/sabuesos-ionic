import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { AdvertisementModalComponent } from '../components/advertisement-modal/advertisement-modal.component';
import { AuthComponent } from "../components/auth/auth.component";

@NgModule({
  declarations: [HeaderComponent, AdvertisementModalComponent, AuthComponent],
  exports: [HeaderComponent, AdvertisementModalComponent, AuthComponent],
  imports: [CommonModule, IonicModule],
})
export class SharedModule { }
