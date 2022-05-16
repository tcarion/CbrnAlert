import { FlexpartOutput } from 'src/app/flexpart/flexpart-output';
import { MapPlotsService } from '../services/map-plots.service';
import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { FlexpartResult } from "src/app/flexpart/flexpart-result";
import { FlexpartInput } from 'src/app/flexpart/flexpart-input';
import { MapService } from 'src/app/core/services/map.service';

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

export namespace FlexpartResultAction {
    export class Add {
        static readonly type = '[FlexpartResult] Add'
    
        constructor(public payload: FlexpartResult) {}
    }
    
    export class Remove {
        static readonly type = '[FlexpartResult] Remove'
    
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
    fpResults: FlexpartResult[]
    fpOutput?: FlexpartOutput
}

@State<FlexpartStateModel>({
    name: 'flexpart',
    defaults: {
        fpInputs: [],
        fpResults: [],
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
        return state.fpResults;
    }

    @Selector()
    static fpOutput(state: FlexpartStateModel) {
        return state.fpOutput;
    }

    @Selector()
    static fpInputs(state: FlexpartStateModel) {
        return state.fpInputs;
    }

    @Action(FlexpartResultAction.Add)
    addResult({getState, patchState}: StateContext<FlexpartStateModel>, { payload }: FlexpartResultAction.Add ) {
        const state = getState();
        if (state.fpResults.map(res => res.name).indexOf(payload.name) === -1) {
            patchState({
                fpResults: [...state.fpResults, payload]
            })
        }
    }

    @Action(FlexpartResultAction.Remove)
    removeResult({getState, patchState}: StateContext<FlexpartStateModel>, { payload }: FlexpartResultAction.Remove ) {
        patchState({
            fpResults: getState().fpResults.filter(a => a.name != payload)
        })
    }

    @Action(FlexpartOutputAction.Add)
    addOutput({patchState}: StateContext<FlexpartStateModel>, action: FlexpartOutputAction.Add ) {
        this.mapService.cbrnMap.newAvailableArea(action.payload.area)
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