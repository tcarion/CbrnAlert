import { NotificationService } from 'src/app/core/services/notification.service';
import { WebsocketService } from 'src/app/core/services/websocket.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    mobileQuery: MediaQueryList;
    wsSubscription: Subscription;

    constructor(
        mediaMatcher: MediaMatcher,
        private websocketService: WebsocketService,
        public notificationService: NotificationService
    ) {
        this.mobileQuery = mediaMatcher.matchMedia('(max-width: 600px)');
    }

    ngOnInit() {
        this.websocketService.connect();

        this.wsSubscription = this.websocketService.connection$.subscribe(
            msg => {
                if (msg.payload === undefined) {
                    console.log(msg)
                }
            },
            err => console.error("Error in receiving websocket output" + err)
        );
    }

    ngOnDestroy(): void {
        this.wsSubscription.unsubscribe();
        this.websocketService.disconnect();
    }
}
