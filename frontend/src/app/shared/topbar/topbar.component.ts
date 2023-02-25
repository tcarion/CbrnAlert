import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit, OnDestroy {

    @Input() snav: any;

    hasNewNotif: boolean = false;
    showNotifs: boolean = false;


    notifSubscription: Subscription;

    showPlotList: boolean = false;

    currentUser$ = this.auth.currentUser$

    constructor(
        private notificationService: NotificationService,
        private auth: AuthenticationService
    ) { }

    ngOnInit(): void {
        // this.notifSubscription = this.notificationService.newNotifSubject.subscribe((val: boolean) => {
        //     this.hasNewNotif = val;
        // })
    }

    toggleNav() {
        this.snav.toggle();
    }

    onNotif() {
        this.showNotifs = !this.showNotifs;
        this.hasNewNotif = false;
    }

    onPlotList() {
        this.showPlotList = !this.showPlotList;
    }

    onLogout() {
        this.auth.logout();
    }

    ngOnDestroy(): void {
        this.notifSubscription.unsubscribe();
    }

}
