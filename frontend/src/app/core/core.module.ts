import { FlexpartState } from './state/flexpart.state';
import { MapPlotsService } from './services/map-plots.service';
import { CommonModule } from '@angular/common';

import { MapService, } from './services/map.service';
import { ApiService } from './services/api.service';
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

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxsModule.forRoot([
        MapPlotState,
        FlexpartState,
    ],
    { developmentMode: !environment.production }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
  ],
  providers: [
    MapService,
    FormService,
    WebsocketService,
    ApiService,
    NotificationService,
    MapPlotsService,
    AuthenticationService,
  ]
})
export class CoreModule { }
