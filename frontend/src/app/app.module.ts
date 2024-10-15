import { ErrorInterceptor } from './core/helpers/error.interceptor';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';

import { SharedModule } from './shared/shared.module';
import { AppPipesModule } from './core/pipes/app-pipes.module';
import { JoinPipe } from './core/pipes/join.pipe';
import { AroundPipe } from './core/pipes/around.pipe';
import { DynamicPipe } from './core/pipes/dynamic.pipe';
import { DatePipe } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { CoreModule } from './core/core.module';
import { Atp45Module } from 'src/app/atp45/atp45.module';
import { FlexpartModule } from './flexpart/flexpart.module';
import { HomeComponent } from './home/home.component';
import { LoginModule } from './login/login.module';
import './core/config/custom-methods';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button'; // If you're using buttons in the popup
import { MatDialogModule } from '@angular/material/dialog'; // If using MatDialog


import { SnackbarModule } from './shared/ui/snackbar/snackbar.module';
import { MapPlotsService } from './core/services/map-plots.service';
import { GeometryPopupComponent } from './flexpart/run-simple/release-form/geometry-popup/geometry-popup.component';



@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        GeometryPopupComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FlexLayoutModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatNativeDateModule,
        MatSidenavModule,
        MatListModule,
        MatExpansionModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatDialogModule,

        CoreModule,
        SharedModule,
        AppPipesModule,
        Atp45Module,
        FlexpartModule,
        LoginModule,
        FontAwesomeModule,

        SnackbarModule

    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        // { provide: HTTP_INTERCEPTORS, useClass: HandleDateInterceptor, multi: true },

        JoinPipe,
        AroundPipe,
        DynamicPipe,
        DatePipe,
        MapPlotsService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
