import { Atp45RequestService } from './services/atp45-request.service';
import { MapService } from './services/map.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PreloadedFormComponent } from './components/cbrn-models/atp45/preloaded/preloaded-form/preloaded-form.component';
import { MapComponent } from './components/map/map.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { PreloadedComponent } from './components/cbrn-models/atp45/preloaded/preloaded.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatBadgeModule} from '@angular/material/badge';
import { ArchiveComponent } from './components/cbrn-models/atp45/archive/archive.component';
import { MatNativeDateModule } from '@angular/material/core';
import { JoinPipe } from './pipes/join.pipe';
import { AroundPipe } from './pipes/around.pipe';
import { NotificationComponent } from './components/notification/notification.component';
import { RealtimeComponent } from './components/cbrn-models/atp45/realtime/realtime.component';
import { MetDataComponent } from './components/cbrn-models/flexpart/met-data/met-data.component';

@NgModule({
    declarations: [
        AppComponent,
        SidebarComponent,
        PreloadedFormComponent,
        MapComponent,
        PreloadedComponent,
        ArchiveComponent,
        JoinPipe,
        AroundPipe,
        NotificationComponent,
        RealtimeComponent,
        MetDataComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FlexLayoutModule,
        AppRoutingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatIconModule,
        MatExpansionModule,
        MatBadgeModule,
    ],
    providers: [MapService, Atp45RequestService],
    bootstrap: [AppComponent]
})
export class AppModule { }
