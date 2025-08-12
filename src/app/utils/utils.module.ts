import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category/category.component';
import { CardComponent } from './card/card.component';
import { ReportsComponent } from './reports/reports.component';
import { SlidesComponent } from './slides/slides.component';
import { MapComponent } from './map/map.component';
import { LogoHeaderComponent } from './logo-header/logo-header.component';
import { SegmentComponent } from './segment/segment.component';
import { FullCardComponent } from './full-card/full-card.component';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from './pipes/pipes.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  declarations: [
    CategoryComponent,
    CardComponent,
    ReportsComponent,
    SlidesComponent,
    MapComponent,
    LogoHeaderComponent,
    SegmentComponent,
    FullCardComponent,
  ],
  imports: [
    CommonModule, IonicModule, PipesModule, NgSelectModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    CategoryComponent,
    CardComponent,
    ReportsComponent,
    SlidesComponent,
    MapComponent,
    LogoHeaderComponent,
    SegmentComponent,
    FullCardComponent,
  ]
})
export class UtilsModule { }
