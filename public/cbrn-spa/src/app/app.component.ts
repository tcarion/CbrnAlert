import { FormItem } from './interfaces/form-item';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { WebsocketService } from './services/websocket.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;

  showNotifs: boolean = false;
  constructor(
    mediaMatcher: MediaMatcher,
    private websocketService: WebsocketService
  ) {
    this.mobileQuery = mediaMatcher.matchMedia('(max-width: 600px)');
  }

  ngOnInit() {
    this.websocketService.connect();
  }
  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }
}
