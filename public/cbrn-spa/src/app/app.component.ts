import { FormItem } from './core/models/form-item';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { WebsocketService } from 'src/app/core/services/websocket.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{

  ngOnInit() {
  }
}
