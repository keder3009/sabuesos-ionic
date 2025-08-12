import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterAnimalsPipe } from './filterAnimals.pipe';
import { ImageSanitizerPipe } from './image-sanitizer.pipe';

@NgModule({
    declarations: [FilterAnimalsPipe, ImageSanitizerPipe],
    imports: [CommonModule],
    exports: [FilterAnimalsPipe, ImageSanitizerPipe],
})
export class PipesModule { }
