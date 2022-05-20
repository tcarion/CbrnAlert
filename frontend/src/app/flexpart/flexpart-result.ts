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

import { FlexpartOutput } from "src/app/core/api/models";


export interface FlexpartResult {
    name: string,
    options: string,
    outputs?: FlexpartOutput[],
}
    