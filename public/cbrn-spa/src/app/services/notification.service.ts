import { Notif, NotifStatus } from './../interfaces/notif';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subject } from 'rxjs';

interface NotifCount {
    [name: string]: number,
}


@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    notifs: Notif[] = [
    //     {
    //     title: 'test',
    //     content: [],
    //     status: 'pending',
    //     showed: false
    // },
    // {
    //     title: 'test',
    //     content: [],
    //     status: 'succeeded',
    //     showed: false
    // },{
    //     title: 'test',
    //     content: [],
    //     status: 'failed',
    //     showed: false
    // }
];
    nRealtimeNotif = 0;
    nArchiveNotif = 0;

    newNotifSubject = new Subject<boolean>();

    notifTypes: NotifCount = {
        'atp45Request': 0,
        'archiveRequest': 0,
        'metDataRequest': 0
    }

    constructor() { }

    addNotif(title: string, type: 'atp45Request' | 'archiveRequest' | 'metDataRequest'): string {
        this.notifTypes[type]++;
        const tit = `${title} ${this.notifTypes[type]}`
        this.notifs.push({
            title: tit,
            content: [],
            status: 'none',
            showed: false
        })
        this.newNotifSubject.next(true);
        return tit;
    }

    addContent(title: string, line: string) {
        this.getNotif(title)?.content.push(line);
        this.newNotifSubject.next(true);
    }

    getNotif(title: string): Notif | undefined {
        let n;
        this.notifs.forEach(notif => {
            if (notif.title === title) {
                n = notif;
            }
        });
        return n;
    }

    changeStatus(title: string, st: NotifStatus) {
        let notif = this.getNotif(title);
        if(notif !== undefined) {notif.status = st};
        this.newNotifSubject.next(true);
    }
}
