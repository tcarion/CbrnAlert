export interface Notif {
    id: number,
    title: string,
    content: string[],
    status: NotifStatus,
    type: NotifType,
    showed: boolean
}

type NotifCount = {
  [K in NotifType]: number;
}


export class Notif implements Notif {
  public static _id = 0
  public static notifTypes: NotifCount = {
    'atp45Request': 1,
    'archiveRequest': 1,
    'metDataRequest': 1,
    'flexpartRun': 1,
  }

  public content: string[] = [];
  public showed = false;
  public status: NotifStatus = 'none';
  public title: string;
  public id: number;
  constructor(
    title: string,
    public type: NotifType
  ) {
    this.title = `${title} ${Notif.notifTypes[type]}`;
    this.id = Notif._id;
    Notif.notifTypes[type]++;
    Notif._id++;
  }
}

export type NotifStatus = 'succeeded' | 'failed' | 'pending' | 'none'

export type NotifType = 'atp45Request' | 'archiveRequest' | 'metDataRequest' | 'flexpartRun'
