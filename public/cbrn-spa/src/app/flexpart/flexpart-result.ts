// export interface FlexpartResult {
//     startDate: Date,
//     endDate: Date,
//     times: number[],
//     heights: number[],
//     area: number[],
//     dx: number,
//     dy: number,
//     releaseLons: number[],
//     releaseLats: number[],
//     dataDirname: string,
//     options?: any,
//     description?: {[key:string]: string },
//     variables: string[], 
//     variables2d : any,
//     globAttr: string[],
// }

import { FlexpartOutput } from "./flexpart-output";

export interface FlexpartResult {
    id: string,
    outputs?: FlexpartOutput[],
}
    