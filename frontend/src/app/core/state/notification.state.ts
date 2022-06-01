import { FlexpartRun } from './../api/models/flexpart-run';
import { MapPlotsService } from '../services/map-plots.service';
import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { FlexpartInput } from 'src/app/flexpart/flexpart-input';
import { MapService } from 'src/app/core/services/map.service';
import { FlexpartOutput } from 'src/app/core/api/models';
import { Notif, NotifStatus, NotifType } from '../models/notif';
import produce from 'immer';

export namespace NotifAction {
  export class Add {
    static readonly type = '[Notif] Add'

    constructor(public title: string, public type: NotifType) { }
  }

  export class ChangeStatus {
    static readonly type = '[Notif] ChangeStatus'

    constructor(public id: number, public newStatus: NotifStatus) { }
  }

  export class Remove {
    static readonly type = '[Notif] Remove'

    constructor(public id: number) { }
  }
}

export class NotifStateModel {
  notifs: Notif[]
  unseenNotif: boolean
}

@State<NotifStateModel>({
  name: 'notification',
  defaults: {
    notifs: [],
    unseenNotif: false
  }
})
@Injectable()
export class NotifState {

  constructor(
    private mapService: MapService,
  ) { }

  @Selector()
  static notifs(state: NotifStateModel) {
    return state.notifs;
  }


  @Action(NotifAction.Add)
  addNotif({ getState, patchState }: StateContext<NotifStateModel>, { title, type }: NotifAction.Add) {
    const state = getState();
    patchState({
      notifs: [...state.notifs, new Notif(title, type)]
    })
  }

  @Action(NotifAction.ChangeStatus)
  changeStatus(ctx: StateContext<NotifStateModel>, { id, newStatus }: NotifAction.ChangeStatus) {
    ctx.setState(produce(draft => {
      draft.notifs.forEach(n => {
          if (n.id == id) {
              // this.mapPlotService.showMapPlot(plt);
              n.status = newStatus;
          }
      })
  }))
  }

}
