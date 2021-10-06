import { MapPlotsService } from './../services/map-plots.service';
import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { FlexpartResult } from "src/app/flexpart/flexpart-result";
import { AddFlexpartResult, RemoveFlexpartResult } from "./actions/flexpart-results.actions";

export class FlexpartResultStateModel {
    fpResults: FlexpartResult[]
}

@State<FlexpartResultStateModel>({
    name: 'fpResults',
    defaults: {
        fpResults: []
    }
})
@Injectable()
export class FlexpartResultState {

    @Selector()
    static getFlexpartResults(state: FlexpartResultStateModel) {
        return state.fpResults;
    }

    @Action(AddFlexpartResult)
    add({getState, patchState}: StateContext<FlexpartResultStateModel>, { payload }: AddFlexpartResult ) {
        const state = getState();
        if (state.fpResults.map(res => res.id).indexOf(payload.id) === -1) {
            patchState({
                fpResults: [...state.fpResults, payload]
            })
        }
    }

    @Action(RemoveFlexpartResult)
    remove({getState, patchState}: StateContext<FlexpartResultStateModel>, { payload }: RemoveFlexpartResult ) {
        patchState({
            fpResults: getState().fpResults.filter(a => a.id != payload)
        })
    }
}