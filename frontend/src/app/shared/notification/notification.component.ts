import { Notif } from '../../core/models/notif';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NotifState } from 'src/app/core/state/notification.state';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

    // @Input() notif: any;

    // notifs = this.notificationService.notifs;
    @Select(NotifState.notifs) notifs$: Observable<Notif[]>
    // @Output() newNotifEvent: EventEmitter<boolean> = this.notificationService.newNotifEvent;

    constructor(
        private notificationService: NotificationService,
    ) { }

    ngOnInit(): void {
    }

    onShowNotif(notif: Notif) {
        // const showed = notif.showed;
        // this.hideNotifs;
        // notif.showed = !showed;
    }

    showedNotif() {
        // return this.notifs.some(e => e.showed === true)
    }

    hideNotifs(): void {
        // this.notifs.forEach((elem: Notif) => {
        //     elem.showed = false;
        // });
    }
}
