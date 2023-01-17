import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { Atp45Service } from './atp45.service';
import { Atp45RoutingModule } from './atp45-routing.module';
import { Atp45RunModule } from 'src/app/atp45/atp45-run/atp45-run.module';

@NgModule({
  declarations: [
  ],
  imports: [
    Atp45RoutingModule,
    Atp45RunModule,
    CommonModule,
  ],
  providers: [
    Atp45Service
  ],
  exports: [
  ]
})
export class Atp45Module { }
