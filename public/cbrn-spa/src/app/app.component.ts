import { FormItem } from './interfaces/form-item';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { WebsocketService } from './services/websocket.service';
import { NotificationService } from './services/notification.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;

  showNotifs: boolean = false;
  hasNewNotif: boolean = false;

  notifSubscription: Subscription;

  constructor(
    mediaMatcher: MediaMatcher,
    private websocketService: WebsocketService,
    private notificationService: NotificationService,
  ) {
    this.mobileQuery = mediaMatcher.matchMedia('(max-width: 600px)');
  }

  ngOnInit() {
    this.websocketService.connect();
    this.notifSubscription = this.notificationService.newNotifSubject.subscribe((val: boolean) => {
      this.hasNewNotif = val;
    })
  }

  onNotif() {
    this.showNotifs = !this.showNotifs;
    this.hasNewNotif = false;
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
    this.notifSubscription.unsubscribe();
  }
}
