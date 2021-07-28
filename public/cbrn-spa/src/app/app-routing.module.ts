import { MetDataComponent } from './flexpart/met-data/met-data.component';
import { RealtimeComponent } from './atp45/realtime/realtime.component';
import { ArchiveComponent } from './atp45/archive/archive.component';
import { PreloadedComponent } from './atp45/preloaded/preloaded.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlexpartRunPreloadedComponent } from './flexpart/flexpart-run-preloaded/flexpart-run-preloaded.component';
import { FlexpartPlotComponent } from './flexpart/flexpart-plot/flexpart-plot.component';
import { AuthGuard } from './core/helpers/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            { path: 'preloaded', component: PreloadedComponent },
            { path: 'archive', component: ArchiveComponent },
            { path: 'realtime', component: RealtimeComponent },
            { path: 'metdata', component: MetDataComponent },
            { path: 'run-flexpart', component: FlexpartRunPreloadedComponent },
            { path: 'plot-flexpart', component: FlexpartPlotComponent}
        ]},
    
    { path: 'login', component: LoginComponent},
    
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
