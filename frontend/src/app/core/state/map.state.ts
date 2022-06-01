import { Marker, Rectangle } from 'leaflet';
import { MapService } from 'src/app/core/services/map.service';
import { MapPlotsService } from 'src/app/core/services/map-plots.service';
import { Injectable } from '@angular/core';
import { Action, createSelector, Selector, State, StateContext } from '@ngxs/store';
import produce from "immer"
import { MapArea } from 'src/app/core/models/map-area';
import { GeoPoint } from 'src/app/core/api/models';

export namespace MapAction {
    export class ChangeArea {
        static readonly type = '[Map] ChangeArea'

        constructor(public area: MapArea) {}
    }

    export class ChangeMarker {
        static readonly type = '[Map] ChangeMarker'

        constructor(public marker: GeoPoint) {}
    }

    export class RemoveArea {
        static readonly type = '[Map] RemoveArea'

        constructor() {}
    }

    export class ChangeAreaSelection {
        static readonly type = '[Map] ChangeAreaSelection'

        constructor(public area: MapArea) {}
    }

    export class RemoveAreaSelection {
        static readonly type = '[Map] RemoveAreaSelection'

        constructor() {}
    }
}

export class MapStateModel {
    area?:MapArea
    userArea?:MapArea
    userPoint?:GeoPoint
}

@State<MapStateModel>({
    name: 'mapState',
    defaults: {
        area: undefined,
        userArea: undefined,
        userPoint:undefined
    }
})
@Injectable()
export class MapState {

    constructor(
        private mapService: MapService) {}

    @Selector()
    static userPoint(state: MapStateModel) {
        return state.userPoint;
    }

    @Selector()
    static userArea(state: MapStateModel) {
        return state.userArea;
    }

    @Action(MapAction.ChangeArea)
    changeArea(ctx: StateContext<MapStateModel>, action : MapAction.ChangeArea ) {
        this.mapService.updateShowRectangle(action.area);
        ctx.patchState({
          area: action.area
        })

        // return ctx.dispatch(new MapAction.SetActive(mapPlot.id))
    }

    @Action(MapAction.ChangeMarker)
    changeMarker(ctx: StateContext<MapStateModel>, action : MapAction.ChangeMarker ) {
        this.mapService.changeMarkerPosition(action.marker)
        return ctx.patchState({
            userPoint: action.marker
        })
        // return ctx.dispatch(new MapAction.SetActive(mapPlot.id))
    }

    @Action(MapAction.ChangeAreaSelection)
    changeAreaSelection(ctx: StateContext<MapStateModel>, action : MapAction.ChangeAreaSelection ) {
        // this.mapService.cbrnMap.areaSelection = action.area
        this.mapService.updateDrawnRectangle(action.area)
        return ctx.patchState({
          userArea: action.area
        })
        // return ctx.dispatch(new MapAction.SetActive(mapPlot.id))
    }

    @Action(MapAction.RemoveArea)
    removeArea({getState, patchState}: StateContext<MapStateModel>) {
        this.mapService.removeShowRectangle();
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
