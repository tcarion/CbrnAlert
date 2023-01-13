import { RetrieveMeteoSimpleComponent } from './retrieve-meteo-simple/retrieve-meteo-simple.component';
import { VariableSelectionComponent } from './flexpart-plot/variable-selection/variable-selection.component';
import { FlexpartPlotComponent } from './flexpart-plot/flexpart-plot.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DimensionsFormComponent } from './flexpart-plot/dimensions-form/dimensions-form.component';
import { OutputsResolverService } from 'src/app/flexpart/resolvers/output-resolver.service';
import { PlotStepperComponent } from 'src/app/flexpart/plot-stepper/plot-stepper.component';
import { OutputsComponent } from './flexpart-plot/outputs/outputs.component';
import { RunStepperComponent } from './run-stepper/run-stepper.component';

const routes: Routes = [
  {
    path: 'retrieve',
    component: RetrieveMeteoSimpleComponent,
  },
  {
    path: 'run',
    component: RunStepperComponent,
    // component: SelectInputComponent,
  },
  {
    path: 'plots',
    component: PlotStepperComponent,

    children: [
      {
        path: 'runs',
        component: FlexpartPlotComponent,
        children: [
          {
            path: ':runId',
            component: OutputsComponent,
            resolve: {
                fpOutputs: OutputsResolverService,
            },
            children: [
              // {
              //   path: 'outputs/:outputId',
              //   component: VariableSelectionComponent,
              //   // resolve: {
              //   //     fpOutput: OutputResolverService,
              //   // },
              //   children: [
              //     {
              //       path: 'dimensions/:layerName',
              //       component: DimensionsFormComponent,
              //     },
              //   ],
              // },
            ],
          },
        ],
      },
      {
        path: 'outputs/:outputId',
        component: VariableSelectionComponent,
        // resolve: {
        //     fpOutput: OutputResolverService,
        // },
        children: [
          {
            path: 'dimensions/:layerName',
            component: DimensionsFormComponent,
          },
        ],
      }
    ],
  },
  // {
  //     path: ':slug',
  //     component: EditorComponent,
  //     canActivate: [AuthGuard],
  //     resolve: {
  //         article: EditableArticleResolver
  //     }
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlexpartRoutingModule {}
