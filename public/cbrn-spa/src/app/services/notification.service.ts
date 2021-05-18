import { Notif } from './../interfaces/notif';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    notifs: Notif[] = [];
    nRealtimeNotif = 0;
    nArchiveNotif = 0;

    constructor() { }

    addNotif(title: string) {
        this.notifs.push({
            title,
            content: [],
            showed: false
        })
    }

    addContent(title: string, line: string) {
        this.notifs.forEach(notif => {
            if (notif.title === title) {
                notif.content.push(line);
            }
        });
    }
}
