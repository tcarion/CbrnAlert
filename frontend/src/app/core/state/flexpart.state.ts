import { FlexpartRun } from './../api/models/flexpart-run';
import { MapPlotsService } from '../services/map-plots.service';
import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { MapService } from 'src/app/core/services/map.service';
import { FlexpartInput, FlexpartOutput } from 'src/app/core/api/models';

export namespace FlexpartInputAction {
    export class Add {
        static readonly type = '[FlexpartInput] Add'

        constructor(public payload: FlexpartInput) {}
    }

    export class Remove {
        static readonly type = '[FlexpartInput] Remove'

        constructor(public payload: string) {}
    }
}

export namespace FlexpartRunAction {
    export class Add {
        static readonly type = '[FlexpartRun] Add'

        constructor(public payload: FlexpartRun) {}
    }

    export class Remove {
        static readonly type = '[FlexpartRun] Remove'

        constructor(public payload: string) {}
    }
}

export namespace FlexpartOutputAction {
    export class Add {
        static readonly type = '[FlexpartOutput] Add'

        constructor(public payload: FlexpartOutput) {}
    }

    export class Remove {
        static readonly type = '[FlexpartOutput] Remove'

        constructor() {}
    }
}

export class FlexpartStateModel {
    fpInputs: FlexpartInput[]
    runs: FlexpartRun[]
    fpOutput?: FlexpartOutput
}

@State<FlexpartStateModel>({
    name: 'flexpart',
    defaults: {
        fpInputs: [],
        runs: [],
        fpOutput: undefined,
    }
})
@Injectable()
export class FlexpartState {

    constructor(
        private mapService: MapService,
    ) {}

    @Selector()
    static fpResults(state: FlexpartStateModel) {
        return state.runs;
    }

    @Selector()
    static fpOutput(state: FlexpartStateModel) {
        return state.fpOutput;
    }

    @Selector()
    static fpInputs(state: FlexpartStateModel) {
        return state.fpInputs;
    }

    @Action(FlexpartRunAction.Add)
    addRun({getState, patchState}: StateContext<FlexpartStateModel>, { payload }: FlexpartRunAction.Add ) {
        const state = getState();
        if (state.runs.map(res => res.name).indexOf(payload.name) === -1) {
            patchState({
                runs: [...state.runs, payload]
            })
        }
    }

    @Action(FlexpartRunAction.Remove)
    removeResult({getState, patchState}: StateContext<FlexpartStateModel>, { payload }: FlexpartRunAction.Remove ) {
        patchState({
            runs: getState().runs.filter(a => a.name != payload)
        })
    }

    @Action(FlexpartOutputAction.Add)
    addOutput({patchState}: StateContext<FlexpartStateModel>, action: FlexpartOutputAction.Add ) {
        // TODO: FIX THIS:
        // this.mapService.cbrnMap.newAvailableArea(action.payload.area)
        patchState({
            fpOutput: action.payload
        })
    }

    @Action(FlexpartOutputAction.Remove)
    removeOutput({patchState}: StateContext<FlexpartStateModel>, action: FlexpartOutputAction.Remove ) {
        patchState({
        })
    }

    @Action(FlexpartInputAction.Add)
    addInput({getState, patchState}: StateContext<FlexpartStateModel>, { payload }: FlexpartInputAction.Add ) {
        const state = getState();
        if (state.fpInputs.map(res => res.name).indexOf(payload.name) === -1) {
            patchState({
                fpInputs: [...state.fpInputs, payload]
            })
        }
    }

    @Action(FlexpartInputAction.Remove)
    removeInput({getState, patchState}: StateContext<FlexpartStateModel>, { payload }: FlexpartInputAction.Remove ) {
        patchState({
            fpInputs: getState().fpInputs.filter(a => a.name != payload)
        })
    }
}
