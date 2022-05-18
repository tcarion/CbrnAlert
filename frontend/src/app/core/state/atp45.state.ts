import { ForecastAvailableSteps } from './../api/models/forecast-available-steps';
import { MapPlotsService } from '../services/map-plots.service';
import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import * as dayjs from 'dayjs';


export namespace ForecastStartAction {
    export class Update {
        static readonly type = '[ForecastStart] Update'
    
        constructor(public payload: ForecastAvailableSteps) {}
    }
}

export class Atp45StateModel {
    forecastStart: string;
}

@State<Atp45StateModel>({
    name: 'atp45',
    defaults: {
        forecastStart: "",
        // forecastStart: dayjs().subtract(1, 'day').format(),
    }
})
@Injectable()
export class Atp45State {

    constructor(
    ) {}
    
    @Selector()
    static forecastStart(state: Atp45StateModel) {
        return state.forecastStart;
    }

    @Action(ForecastStartAction.Update)
    addResult(ctx: StateContext<Atp45StateModel>, { payload }: ForecastStartAction.Update ) {
        ctx.patchState({
            forecastStart: payload.start
        })
    }
}