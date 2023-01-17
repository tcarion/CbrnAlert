import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreloadedComponent } from './preloaded/preloaded.component';
import { RealtimeComponent } from './realtime/realtime.component';
import { RunComponent } from './run/run.component';
import { Atp45RunComponent } from 'src/app/atp45/atp45-run/atp45-run/atp45-run.component';



const routes: Routes = [
    { path: 'run', component: Atp45RunComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})


export class Atp45RoutingModule { }
