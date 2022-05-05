import { FlexpartOutput } from "src/app/flexpart/flexpart-output"

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