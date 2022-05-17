import { MapService } from 'src/app/core/services/map.service';
import { MapPlotsService } from 'src/app/core/services/map-plots.service';
import { Injectable } from '@angular/core';
import { Action, createSelector, Selector, State, StateContext } from '@ngxs/store';
import produce from "immer"

export namespace MapAction {
    export class ChangeArea {
        static readonly type = '[Map] ChangeArea'
    
        constructor(public area: number[]) {}
    }

    export class ChangeMarker {
        static readonly type = '[Map] ChangeMarker'
    
        constructor(public marker: {lon:number, lat:number}) {}
    }

    export class RemoveArea {
        static readonly type = '[Map] RemoveArea'
    
        constructor() {}
    }

    export class ChangeAreaSelection {
        static readonly type = '[Map] ChangeAreaSelection'
    
        constructor(public area: number[]) {}
    }

    export class RemoveAreaSelection {
        static readonly type = '[Map] RemoveAreaSelection'
    
        constructor() {}
    }
}

export class MapStateModel {
    area?:number[]
    areaSelection?:number[]
    marker?:{lon:number, lat:number}
}

@State<MapStateModel>({
    name: 'mapState',
    defaults: {
        area: undefined,
        areaSelection: undefined,
        marker:undefined
    }
})
@Injectable()
export class MapState {

    constructor(
        private mapService: MapService) {}

    @Selector()
    static marker(state: MapStateModel) {
        return state.marker;
    }

    @Action(MapAction.ChangeArea)
    changeArea(ctx: StateContext<MapStateModel>, action : MapAction.ChangeArea ) {
        this.mapService.changeArea(action.area);
        ctx.patchState({
            area: action.area
        })

        // return ctx.dispatch(new MapAction.SetActive(mapPlot.id))
    }

    @Action(MapAction.ChangeMarker)
    changeMarker(ctx: StateContext<MapStateModel>, action : MapAction.ChangeMarker ) {
        this.mapService.cbrnMap.marker = action.marker
        return ctx.patchState({
            marker: action.marker
        })
        // return ctx.dispatch(new MapAction.SetActive(mapPlot.id))
    }

    @Action(MapAction.RemoveArea)
    removeArea({getState, patchState}: StateContext<MapStateModel>) {
        this.mapService.removeArea();        
        patchState({
            area: undefined
        })
    }
    // @Action(MapAction.Show)
    // show(ctx: StateContext<MapStateModel>, action : MapAction.Show ) {
    //     ctx.setState(produce(draft => {
    //         draft.mapPlots.forEach(plt => {
    //             if (plt.id == action.mapPlotId) {
    //                 this.mapPlotService.showMapPlot(plt);
    //                 plt.visible = true;
    //             }
    //         })
    //     }))
    // }

    // @Action(MapAction.Hide)
    // hide(ctx: StateContext<MapStateModel>, action :MapAction.Hide ) {
    //     ctx.setState(produce(draft => {
    //         draft.mapPlots.forEach(plt => {
    //             if (plt.id == action.mapPlotId) {
    //                 this.mapPlotService.hideMapPlot(plt);
    //                 plt.visible = false;
    //             }
    //         })
    //     }))
    // }

    // @Action(MapAction.SetActive)
    // setActive(ctx: StateContext<MapStateModel>, action : MapAction.SetActive ) {
    //     ctx.setState(produce(draft => {
    //         draft.mapPlots.forEach(plt => {
    //             if (plt.id == action.mapPlotId) {
    //                 this.mapPlotService.setActive(plt);
    //                 plt.isActive = true;
    //             } else {
    //                 plt.isActive = false;
    //             }
    //         })
    //     }))
    // }


    // @Action(MapAction.Remove)
    // remove({getState, patchState}: StateContext<MapStateModel>, { mapPlotId }: MapAction.Remove ) {
    //     const state = getState();
    //     const toDelete = state.mapPlots.find(e => e.id == mapPlotId);
    //     !!toDelete && this.mapPlotService.deleteMapPlot(toDelete);
    //     patchState({
    //         mapPlots: getState().mapPlots.filter(a => a.id != mapPlotId)
    //     })
    // }
}