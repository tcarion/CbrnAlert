import { SelectInputComponent } from './select-input/select-input.component';
import { VariableSelectionComponent } from './flexpart-plot/variable-selection/variable-selection.component';
import { MetDataComponent } from './met-data/met-data.component';
import { FlexpartPlotComponent } from './flexpart-plot/flexpart-plot.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlexpartRunPreloadedComponent } from './flexpart-run-preloaded/flexpart-run-preloaded.component';
import { ChooseOutputComponent } from './flexpart-plot/choose-output/choose-output.component';
import { FlexpartPlotFormComponent } from './flexpart-plot/flexpart-plot-form/flexpart-plot-form.component';
import { OutputFormComponent } from './flexpart-plot/output-form/output-form.component';
import { OutputResolverService, OutputsResolverService } from 'src/app/flexpart/output-resolver.service';



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
