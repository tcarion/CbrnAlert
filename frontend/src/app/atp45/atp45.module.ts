import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloadedComponent } from './preloaded/preloaded.component';
import { PreloadedFormComponent } from './preloaded/preloaded-form/preloaded-form.component';
import { RealtimeComponent } from './realtime/realtime.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Atp45Service } from './atp45.service';
import { Atp45RoutingModule } from './atp45-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { WindFormComponent } from './wind-form/wind-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RunComponent } from './run/run.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { Atp45RunModule } from 'src/app/atp45/atp45-run/atp45-run.module';

@NgModule({
    declarations: [
        PreloadedComponent,
        PreloadedFormComponent,
        RealtimeComponent,
        WindFormComponent,
        RunComponent
    ],
    imports: [
        Atp45RoutingModule,
        Atp45RunModule,
        CommonModule,
        MatButtonModule,
        SharedModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatSelectModule,
        MatDividerModule,
        MatButtonToggleModule,
    ],
    providers: [
        Atp45Service
    ],
    exports: [
        PreloadedComponent,
        RealtimeComponent,
    ]
})
export class Atp45Module { }
