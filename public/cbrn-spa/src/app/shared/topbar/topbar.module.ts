import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './topbar.component';
import { MatIconModule } from '@angular/material/icon';
import { NotificationComponent } from '../notification/notification.component';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';



@NgModule({
    declarations: [
        TopbarComponent,
        NotificationComponent
    ],
    imports: [
        CommonModule,
        MatListModule,
        MatIconModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        MatBadgeModule
    ],
    exports: [
        TopbarComponent,
        NotificationComponent,
    ]
})
export class TopbarModule { }
