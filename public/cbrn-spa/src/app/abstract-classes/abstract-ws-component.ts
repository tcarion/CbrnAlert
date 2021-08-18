import { Component } from '@angular/core';
import { NotificationService } from 'src/app/core/services/notification.service';
import { WebsocketService } from 'src/app/core/services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
    template: ''
  })
export abstract class AbstractWsComponent {
    wsSubscription: Subscription;

    constructor(
        public websocketService: WebsocketService,
        public notificationService: NotificationService,
        ) {
    }

    ngOnInit() {
        this.initWsSubscription();
    }

    initWsSubscription() {
        this.wsSubscription = this.websocketService.connection$.subscribe(
            msg => {
                if (msg.payload !== undefined) {
                    this.notificationService.addContent(msg.payload.backid, msg.payload.displayed);
                }
            },
            err => console.error("Error in receiving websocket output" + err)
        );
    }

    ngOnDestroy() {
        // this.wsSubscription.unsubscribe();
    }
}
