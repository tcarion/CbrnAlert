export interface FlexpartOutput {
    resultId: string;
    id: string,
    startDate: Date,
    endDate: Date,
    // times: number[],
    // heights: number[],
    area: number[],
    dx: number,
    dy: number,
    releaseLons: number[],
    releaseLats: number[],
    options?: any,
    description?: {[key:string]: string },
    variables: string[], 
    variables2d : any,
    globAttr: string[],
}
