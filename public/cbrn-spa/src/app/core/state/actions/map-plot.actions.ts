import { MapPlot, PlotType } from 'src/app/core/models/map-plot';

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