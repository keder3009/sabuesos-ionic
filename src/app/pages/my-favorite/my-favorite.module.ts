import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyFavoritePageRoutingModule } from './my-favorite-routing.module';

import { MyFavoritePage } from './my-favorite.page';
import { UtilsModule } from 'src/app/utils/utils.module';
import { PipesModule } from 'src/app/utils/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyFavoritePageRoutingModule,
    UtilsModule,
    PipesModule,
    SharedModule
  ],
  declarations: [MyFavoritePage],
})
export class MyFavoritePageModule { }
