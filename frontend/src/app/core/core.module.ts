import { ErrorHandlerService } from './services/error-handler.service';
import { MapState } from './state/map.state';
import { FlexpartState } from './state/flexpart.state';
import { MapPlotsService } from './services/map-plots.service';
import { CommonModule } from '@angular/common';

import { MapService, } from './services/map.service';
// import { ApiService } from './services/api.service';
import { FormService } from './services/form.service';
// import { FlexpartService } from './services/flexpart/flexpart.service';
import { WebsocketService } from './services/websocket.service';
import { NotificationService } from './services/notification.service';
import { NgModule } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { environment } from 'src/environments/environment';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { MapPlotState } from './state/map-plot.state';
import { Atp45State } from 'src/app/core/state/atp45.state';
import { NotifState } from './state/notification.state';
import { ApiModule } from './api/api.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxsModule.forRoot([
        MapPlotState,
        Atp45State,
        FlexpartState,
        MapState,
        NotifState
    ],
    { developmentMode: !environment.production }),
    NgxsReduxDevtoolsPluginModule.forRoot({
        disabled: environment.production,
    }),
    NgxsLoggerPluginModule.forRoot({
        disabled: environment.production,
    }),
    ApiModule.forRoot({
        rootUrl: environment.apiUrl
    }),
  ],
  providers: [
    MapService,
    FormService,
    WebsocketService,
    ApiModule,
    NotificationService,
    MapPlotsService,
    AuthenticationService,
    ErrorHandlerService,
  ]
})
export class CoreModule { }
