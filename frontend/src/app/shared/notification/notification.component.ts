import { Notif } from '../../core/models/notif';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

    // @Input() notif: any;

    notifs = this.notificationService.notifs;
    // @Output() newNotifEvent: EventEmitter<boolean> = this.notificationService.newNotifEvent;

    constructor(
        private notificationService: NotificationService,
    ) { }

    ngOnInit(): void {
    }

    onShowNotif(notif: Notif) {
        const showed = notif.showed;
        this.hideNotifs;
        notif.showed = !showed;
    }

    showedNotif(): boolean {
        return this.notifs.some(e => e.showed === true)
    }

    hideNotifs(): void {
        this.notifs.forEach((elem: Notif) => {
            elem.showed = false;
        });
    }
}
