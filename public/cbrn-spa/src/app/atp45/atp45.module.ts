import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloadedComponent } from './preloaded/preloaded.component';
import { PreloadedFormComponent } from './preloaded/preloaded-form/preloaded-form.component';
import { RealtimeComponent } from './realtime/realtime.component';
import { ArchiveComponent } from './archive/archive.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Atp45Service } from './atp45.service';



@NgModule({
  declarations: [
    PreloadedComponent,
    PreloadedFormComponent,
    RealtimeComponent,
    ArchiveComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [
    Atp45Service
  ],
  exports: [
    PreloadedComponent,
    RealtimeComponent,
    ArchiveComponent,
  ]
})
export class Atp45Module { }
