import { RealtimeComponent } from './atp45/realtime/realtime.component';
import { ArchiveComponent } from './atp45/archive/archive.component';
import { PreloadedComponent } from './atp45/preloaded/preloaded.component';
import { NgModule, Component } from '@angular/core';
import { ExtraOptions, PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/helpers/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

// const routes: Routes = [
//     {
//       path: 'settings',
//       loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
//     },
//     {
//       path: 'profile',
//       loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
//     },
//     {
//       path: 'editor',
//       loadChildren: () => import('./editor/editor.module').then(m => m.EditorModule)
//     },
//     {
//       path: 'article',
//       loadChildren: () => import('./article/article.module').then(m => m.ArticleModule)
//     }
//   ];

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard],
        children: [
            {
                path: 'atp45',
                loadChildren: () => import('./atp45/atp45.module').then(m => m.Atp45Module)
            },
            // { path: 'metdata', component: MetDataComponent },
            // { path: 'run-flexpart', component: FlexpartRunPreloadedComponent },
            // { path: 'results', component: FlexpartPlotComponent}
            {
                path: 'flexpart',
                loadChildren: () => import('./flexpart/flexpart.module').then(m => m.FlexpartModule)
            }
        ]},
    
    { path: 'login', component: LoginComponent},
    
    { path: '**', redirectTo: '' }
];


export const routingConfiguration: ExtraOptions = {
    paramsInheritanceStrategy: 'always',
    // preload all modules; optionally we could
    // implement a custom preloading strategy for just some
    // of the modules (PRs welcome 😉)
    preloadingStrategy: PreloadAllModules
};
  
@NgModule({
  imports: [RouterModule.forRoot(routes,routingConfiguration)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
