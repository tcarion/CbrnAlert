import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JoinPipe } from 'src/app/core/pipes/join.pipe';
import { AroundPipe } from 'src/app/core/pipes/around.pipe';
import { DynamicPipe } from 'src/app/core/pipes/dynamic.pipe';

@NgModule({
  declarations: [
    JoinPipe,
    AroundPipe,
    DynamicPipe,
  ],
  imports: [
    // CommonModule
  ],
  exports: [
    JoinPipe,
    AroundPipe,
    DynamicPipe,
  ]
})
export class AppPipesModule { }
