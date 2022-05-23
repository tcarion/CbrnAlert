import { VariableSelectionComponent } from './flexpart-plot/variable-selection/variable-selection.component';
import { MetDataComponent } from './met-data/met-data.component';
import { FlexpartPlotComponent } from './flexpart-plot/flexpart-plot.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlexpartRunPreloadedComponent } from './flexpart-run-preloaded/flexpart-run-preloaded.component';
import { ChooseOutputComponent } from './flexpart-plot/choose-output/choose-output.component';
import { DimensionsFormComponent } from './flexpart-plot/dimensions-form/dimensions-form.component';



const routes: Routes = [
    {
        path: 'metdata',
        component: MetDataComponent,
    },
    {
        path: 'run',
        component: FlexpartRunPreloadedComponent,
        // component: SelectInputComponent,
    },
    {
        path: 'runs',
        component: FlexpartPlotComponent,
        children: [
            {
                path: ':runId',
                component: ChooseOutputComponent,
                // resolve: {
                //     fpOutputs: OutputsResolverService,
                // },
                children: [
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
                            }
                        ],
                    },
                ]
            }
        ]
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
    exports: [RouterModule]
})


export class FlexpartRoutingModule { }
