import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SnackBarOptions, SnackBarProvider } from 'src/app/shared/ui/snackbar/snackbar-provider';
import { Notif, NotifStatus, NotifType } from '../models/notif';

type NotifCount = {
  [K in NotifType]: number;
}


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notifs: Notif[] = [
  ];
  notifTypes: NotifCount = {
    'atp45Request': 0,
    'archiveRequest': 0,
    'metDataRequest': 0,
    'flexpartRun': 0,
  }

  private _snackBarProvider: SnackBarProvider;
  set snackBarProvider(provider: SnackBarProvider) {
    this._snackBarProvider = provider;
  }

  constructor() { }

  addContent(title: string, line: string) {
    this.getNotif(title)?.content.push(line);
    // this.newNotifSubject.next(true);
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
    if (notif !== undefined) { notif.status = st };
    // this.newNotifSubject.next(true);
  }

  /**
   * Shows a snack bar message (quick message on the bottom)
   */
  snackBar(message: string, options?: SnackBarOptions): void {
    this._snackBarProvider.show(message, options);
  }

}
