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

    export class ChangeAreaSelection {
        static readonly type = '[Map] ChangeAreaSelection'

        constructor(public area: MapArea) {}
    }

    export class RemoveArea {
        static readonly type = '[Map] RemoveArea'

        constructor() {}
    }

    export class RemoveMarker {
        static readonly type = '[Map] RemoveMarker'

        constructor() {}
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
        this.mapService.updateRetrievedRectangle(action.area);
        ctx.patchState({
          area: action.area
        })
    }

    @Action(MapAction.ChangeMarker)
    changeMarker(ctx: StateContext<MapStateModel>, action : MapAction.ChangeMarker ) {
        this.mapService.changeMarkerPosition(action.marker)
        return ctx.patchState({
            userPoint: action.marker
        })
    }

    @Action(MapAction.ChangeAreaSelection)
    changeAreaSelection(ctx: StateContext<MapStateModel>, action : MapAction.ChangeAreaSelection ) {
        this.mapService.updateSelectionRectangle(action.area)
        return ctx.patchState({
          userArea: action.area
        })
    }

    @Action(MapAction.RemoveArea)
    removeArea(ctx: StateContext<MapStateModel> ) {
        this.mapService.removeRetrievedRectangle()
        return ctx.patchState({
          area: undefined
        })
    }

    @Action(MapAction.RemoveMarker)
    removeMarker(ctx: StateContext<MapStateModel> ) {
        this.mapService.removeMarker()
        return ctx.patchState({
          userPoint: undefined
        })
    }

    @Action(MapAction.RemoveAreaSelection)
    removeAreaSelection(ctx: StateContext<MapStateModel> ) {
        this.mapService.removeSelectionRectangle()
        return ctx.patchState({
          userArea: undefined
        })
    }

}
