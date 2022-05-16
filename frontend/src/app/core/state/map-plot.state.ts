import { MapPlotsService } from 'src/app/core/services/map-plots.service';
import { Injectable } from '@angular/core';
import { Action, createSelector, Selector, State, StateContext } from '@ngxs/store';
import { MapPlot, PlotType } from 'src/app/core/models/map-plot';
import produce from "immer"

export namespace MapPlotAction {
    export class Add {
        static readonly type = '[MapPlot] Add'
    
        constructor(public plotData: any, public type: PlotType) {}
    }
    
    export class Hide {
        static readonly type = '[MapPlot] Hide'
    
        constructor(public mapPlotId: number) {}
    }
    
    export class Show {
        static readonly type = '[MapPlot] Show'
    
        constructor(public mapPlotId: number) {}
    }
    
    export class SetActive {
        static readonly type = '[MapPlot] SetActive'
    
        constructor(public mapPlotId: number) {}
    }
    
    export class SetInactive {
        static readonly type = '[MapPlot] SetInactive'
    
        constructor(public mapPlotId: number) {}
    }
    
    export class Remove {
        static readonly type = '[MapPlot] Remove'
    
        constructor(public mapPlotId: number) {}
    }
}

export class MapPlotStateModel {
    mapPlots: MapPlot[]
}

@State<MapPlotStateModel>({
    name: 'mapPlots',
    defaults: {
        mapPlots: []
    }
})
@Injectable()
export class MapPlotState {

    constructor(
        private mapPlotService: MapPlotsService) {}

    // @Selector()
    // static getFlexpartPlots(state: MapPlotStateModel) {
    //     return state.mapPlots.filter(plot => plot.type == 'flexpart')       
    // }

    // @Selector()
    // static getAtp45Plots(state: MapPlotStateModel) {
    //     return state.mapPlots.filter(plot => plot.type == 'atp45')       
    // }
    static filterType(type: PlotType) {
        return createSelector([MapPlotState], (state: MapPlotStateModel) => {
            return state.mapPlots.filter(plot => plot.type == type);
        })
    }

    @Action(MapPlotAction.Add)
    add(ctx: StateContext<MapPlotStateModel>, action : MapPlotAction.Add ) {
        const state = ctx.getState();
        let mapPlot = this.mapPlotService.addPlot(action);

        ctx.patchState({
            mapPlots: [...state.mapPlots, mapPlot]
        })

        return ctx.dispatch(new MapPlotAction.SetActive(mapPlot.id))
    }

    @Action(MapPlotAction.Show)
    show(ctx: StateContext<MapPlotStateModel>, action : MapPlotAction.Show ) {
        ctx.setState(produce(draft => {
            draft.mapPlots.forEach(plt => {
                if (plt.id == action.mapPlotId) {
                    this.mapPlotService.showMapPlot(plt);
                    plt.visible = true;
                }
            })
        }))
    }

    @Action(MapPlotAction.Hide)
    hide(ctx: StateContext<MapPlotStateModel>, action :MapPlotAction.Hide ) {
        ctx.setState(produce(draft => {
            draft.mapPlots.forEach(plt => {
                if (plt.id == action.mapPlotId) {
                    this.mapPlotService.hideMapPlot(plt);
                    plt.visible = false;
                }
            })
        }))
    }

    @Action(MapPlotAction.SetActive)
    setActive(ctx: StateContext<MapPlotStateModel>, action : MapPlotAction.SetActive ) {
        ctx.setState(produce(draft => {
            draft.mapPlots.forEach(plt => {
                if (plt.id == action.mapPlotId) {
                    this.mapPlotService.setActive(plt);
                    plt.isActive = true;
                } else {
                    plt.isActive = false;
                }
            })
        }))
    }


    @Action(MapPlotAction.Remove)
    remove({getState, patchState}: StateContext<MapPlotStateModel>, { mapPlotId }: MapPlotAction.Remove ) {
        const state = getState();
        const toDelete = state.mapPlots.find(e => e.id == mapPlotId);
        !!toDelete && this.mapPlotService.deleteMapPlot(toDelete);
        patchState({
            mapPlots: getState().mapPlots.filter(a => a.id != mapPlotId)
        })
    }
}