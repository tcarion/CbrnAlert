import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { FlexpartOutput } from "src/app/flexpart/flexpart-output";
import { MapService } from "../services/map.service";
import { FlexpartOutputAction } from "./actions/flexpart-output.actions";

export class FlexpartOutputStateModel {
    fpOutput?: FlexpartOutput
}

@State<FlexpartOutputStateModel>({
    name: 'fpOutput',
    defaults: {
        fpOutput: undefined
    }
})

@Injectable()
export class FlexpartOutputState {

    constructor(
        private mapService: MapService,
    ) {}

    @Selector()
    static getFlexpartOutput(state: FlexpartOutputStateModel) {
        return state.fpOutput;
    }

    @Action(FlexpartOutputAction.Add)
    add({patchState}: StateContext<FlexpartOutputStateModel>, action: FlexpartOutputAction.Add ) {
        this.mapService.cbrnMap.newAvailableArea(action.payload.area)
        patchState({
            fpOutput: action.payload
        })
    }

    @Action(FlexpartOutputAction.Remove)
    remove({patchState}: StateContext<FlexpartOutputStateModel>, action: FlexpartOutputAction.Remove ) {
        patchState({
        })
    }
}