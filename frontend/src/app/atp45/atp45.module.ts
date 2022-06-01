import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloadedComponent } from './preloaded/preloaded.component';
import { PreloadedFormComponent } from './preloaded/preloaded-form/preloaded-form.component';
import { RealtimeComponent } from './realtime/realtime.component';
import { ArchiveComponent } from './archive/archive.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Atp45Service } from './atp45.service';
import { Atp45RoutingModule } from './atp45-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { WindFormComponent } from './wind-form/wind-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RunComponent } from './run/run.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@NgModule({
    declarations: [
        PreloadedComponent,
        PreloadedFormComponent,
        RealtimeComponent,
        ArchiveComponent,
        WindFormComponent,
        RunComponent
    ],
    imports: [
        Atp45RoutingModule,
        CommonModule,
        MatButtonModule,
        SharedModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        MatTooltipModule,
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
