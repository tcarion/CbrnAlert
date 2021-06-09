import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JoinPipe } from 'src/app/core/pipes/join.pipe';
import { AroundPipe } from 'src/app/core/pipes/around.pipe';
import { FormControlPipe } from 'src/app/core/pipes/form-control.pipe';
import { DynamicPipe } from 'src/app/core/pipes/dynamic.pipe';

@NgModule({
  declarations: [
    JoinPipe, 
    AroundPipe,
    FormControlPipe,
    DynamicPipe,
  ],
  imports: [
    // CommonModule
  ],
  exports: [
    JoinPipe, 
    AroundPipe,
    FormControlPipe,
    DynamicPipe,
  ]
})
export class AppPipesModule { }
