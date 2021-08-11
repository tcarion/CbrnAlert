import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './topbar.component';
import { MatIconModule } from '@angular/material/icon';
import { NotificationComponent } from '../notification/notification.component';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { MapPlotListComponent } from '../map-plot-list/map-plot-list/map-plot-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MapPlotListModule } from '../map-plot-list/map-plot-list.module';
import { MatButtonModule } from '@angular/material/button';




@NgModule({
    declarations: [
        TopbarComponent,
        NotificationComponent,
        // MapPlotListComponent,
    ],
    imports: [
        CommonModule,
        MatListModule,
        MatIconModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        MatBadgeModule,
        MatExpansionModule,
        MatButtonModule,
        MapPlotListModule
    ],
    exports: [
        TopbarComponent,
        NotificationComponent,
    ]
})
export class TopbarModule { }
