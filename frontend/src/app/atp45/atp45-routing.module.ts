import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreloadedComponent } from './preloaded/preloaded.component';
import { ArchiveComponent } from './archive/archive.component';
import { RealtimeComponent } from './realtime/realtime.component';
import { RunComponent } from './run/run.component';



const routes: Routes = [
    { path: 'preloaded', component: PreloadedComponent },
    { path: 'archive', component: ArchiveComponent },
    { path: 'realtime', component: RealtimeComponent },
    { path: 'run', component: RunComponent },
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


export class Atp45RoutingModule { }
