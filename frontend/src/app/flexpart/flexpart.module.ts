import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { FlexpartPlotComponent } from './flexpart-plot/flexpart-plot.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetDataComponent } from './met-data/met-data.component';
import { FlexpartRunPreloadedComponent } from './flexpart-run-preloaded/flexpart-run-preloaded.component';
import { FlexpartRunPreloadedFormComponent } from './flexpart-run-preloaded/flexpart-run-preloaded-form/flexpart-run-preloaded-form.component';
import { SharedModule } from '../shared/shared.module';
import { FlexpartService } from './flexpart.service';
import { FlexpartRoutingModule } from './flexpart-routing.module';
import { VariableSelectionComponent } from './flexpart-plot/variable-selection/variable-selection.component';
import { FlexpartInputComponent } from './flexpart-input/flexpart-input.component';
import { DimensionsFormComponent } from './flexpart-plot/dimensions-form/dimensions-form.component';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {MatStepperModule} from '@angular/material/stepper';
import { PlotStepperComponent } from './plot-stepper/plot-stepper.component';
import { OutputsComponent } from './flexpart-plot/outputs/outputs.component';

@NgModule({
    declarations: [
        MetDataComponent,
        FlexpartRunPreloadedComponent,
        FlexpartRunPreloadedFormComponent,
        FlexpartPlotComponent,
        OutputsComponent,
        VariableSelectionComponent,
        FlexpartInputComponent,
        DimensionsFormComponent,
        PlotStepperComponent,
    ],
    providers: [
        FlexpartService,
        // ResultResolverService,
    ],
    imports: [
        FlexpartRoutingModule,
        CommonModule,
        SharedModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatSelectModule,
        MatButtonModule,
        MatTabsModule,
        MatStepperModule
        // MatDialog
    ],
    exports: [
        // MetDataComponent,
        // FlexpartRunPreloadedComponent,
        // FlexpartPlotComponent,
    ]
})
export class FlexpartModule { }
