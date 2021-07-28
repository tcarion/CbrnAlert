// export interface Shape {
//     lons: number[],
//     lats: number[],
//     type: string,
//     label: string
//     coords?: number[][],
//     text?: string
// }

import { FeatureCollection } from "geojson";

export interface Wind {
    v: number,
    speed: number
    u: number,
}

export interface Atp45ShapeData {
    shapes: FeatureCollection,
    wind: Wind,
    date: string,
    time: string,
    step: string
}