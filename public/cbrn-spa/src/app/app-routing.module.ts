import { RealtimeComponent } from './components/cbrn-models/atp45/realtime/realtime.component';
import { ArchiveComponent } from './components/cbrn-models/atp45/archive/archive.component';
import { PreloadedComponent } from './components/cbrn-models/atp45/preloaded/preloaded.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: 'preloaded', component: PreloadedComponent },
    { path: 'archive', component: ArchiveComponent },
    { path: 'realtime', component: RealtimeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
