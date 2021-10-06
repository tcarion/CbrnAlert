import { FlexpartResult } from "src/app/flexpart/flexpart-result";


export class AddFlexpartResult {
    static readonly type = '[FlexpartResult] Add'

    constructor(public payload: FlexpartResult) {}
}

export class RemoveFlexpartResult {
    static readonly type = '[FlexpartResult] Remove'

    constructor(public payload: string) {}
}