import { FlexpartPreloadedComponent } from './flexpart/flexpart-preloaded/flexpart-preloaded.component';
import { MetDataComponent } from './flexpart/met-data/met-data.component';
import { RealtimeComponent } from './atp45/realtime/realtime.component';
import { ArchiveComponent } from './atp45/archive/archive.component';
import { PreloadedComponent } from './atp45/preloaded/preloaded.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: 'preloaded', component: PreloadedComponent },
    { path: 'archive', component: ArchiveComponent },
    { path: 'realtime', component: RealtimeComponent },
    { path: 'metdata', component: MetDataComponent },
    { path: 'run-flexpart', component: FlexpartPreloadedComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
