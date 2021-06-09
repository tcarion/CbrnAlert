// import { MapService } from './core/services/map.service';
// import { ApiService } from './core/services/api.service';
import { FlexpartRunPreloadedFormComponent } from './flexpart/flexpart-preloaded/flexpart-run-preloaded/flexpart-run-preloaded-form/flexpart-run-preloaded-form.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { PreloadedFormComponent } from './atp45/preloaded/preloaded-form/preloaded-form.component';
// import { PreloadedComponent } from './atp45/preloaded/preloaded.component';
// import { ArchiveComponent } from './atp45/archive/archive.component';
// import { RealtimeComponent } from './atp45/realtime/realtime.component';


import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTabsModule} from '@angular/material/tabs';

import { MetDataComponent } from './flexpart/met-data/met-data.component';
import { FlexpartPreloadedComponent } from './flexpart/flexpart-preloaded/flexpart-preloaded.component';
import { FlexpartRunPreloadedComponent } from './flexpart/flexpart-preloaded/flexpart-run-preloaded/flexpart-run-preloaded.component';
// import { FormService } from './core/services/form.service';

import { FlexpartPlotComponent } from './flexpart/flexpart-preloaded/flexpart-plot/flexpart-plot.component';
import { FlexpartPlotFormComponent } from './flexpart/flexpart-preloaded/flexpart-plot/flexpart-plot-form/flexpart-plot-form.component';
// import { FlexpartService } from './services/flexpart/flexpart.service';
import { SharedModule } from './shared/shared.module';
// import { WebsocketService } from './core/services/websocket.service';
// import { NotificationService } from './core/services/notification.service';
import { AppPipesModule } from './core/pipes/app-pipes.module';
import { JoinPipe } from './core/pipes/join.pipe';
import { AroundPipe } from './core/pipes/around.pipe';
import { DynamicPipe } from './core/pipes/dynamic.pipe';
import { DatePipe } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { CoreModule } from './core/core.module';
import { Atp45Module } from 'src/app/atp45/atp45.module';
import { FlexpartModule } from './flexpart/flexpart.module';

@NgModule({
    declarations: [
        AppComponent,
        // PreloadedFormComponent,
        // PreloadedComponent,
        // ArchiveComponent,
        // RealtimeComponent,
        // MetDataComponent,
        // FlexpartPreloadedComponent,
        // FlexpartRunPreloadedComponent,
        // FlexpartRunPreloadedFormComponent,
        // FlexpartPlotComponent,
        // FlexpartPlotFormComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FlexLayoutModule,
        AppRoutingModule,
        // ReactiveFormsModule,
        BrowserAnimationsModule,
        MatNativeDateModule,
        // MatTableModule,
        // MatPaginatorModule,
        // MatSortModule,
        // MatCheckboxModule,
        // MatProgressSpinnerModule,
        MatSidenavModule,
        // MatToolbarModule,
        MatListModule,
        // MatIconModule,
        MatExpansionModule,
        // MatBadgeModule,
        MatTabsModule,

        CoreModule,
        SharedModule,
        AppPipesModule,
        Atp45Module,
        FlexpartModule,
    ],
    providers: [
        // MapService,
        // FormService,
        // WebsocketService,
        // ApiService,
        // NotificationService,
        // FlexpartService,
        JoinPipe,
        AroundPipe,
        DynamicPipe,
        DatePipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
