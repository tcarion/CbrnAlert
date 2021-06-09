import { CommonModule } from '@angular/common';

import { MapService, } from './services/map.service';
import { ApiService } from './services/api.service';
import { FormService } from './services/form.service';
// import { FlexpartService } from './services/flexpart/flexpart.service';
import { WebsocketService } from './services/websocket.service';
import { NotificationService } from './services/notification.service';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    MapService,
    FormService,
    WebsocketService,
    ApiService,
    NotificationService,
    // FlexpartService,
  ]
})
export class CoreModule { }
