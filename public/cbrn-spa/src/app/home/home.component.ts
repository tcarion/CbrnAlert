import { WebsocketService } from 'src/app/core/services/websocket.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

    mobileQuery: MediaQueryList;

    constructor(
      mediaMatcher: MediaMatcher,
      private websocketService: WebsocketService,
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
