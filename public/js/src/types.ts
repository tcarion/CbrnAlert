interface ATP_map {
    map: any;
    drawn_shapes: ShapeData[];
    clickable: boolean;
    areaToCoords(area: number[]): number[][];
    map_area: number[];
    drawShapes(shape_data: ShapeData, map: any): void;
    newMarker(lon: number, lat: number) : void;
}
interface Form_view {
    form: Form | undefined;
    lon_selector: string;
    lat_selector: string;
    error_selector: string;
    atp45_request_selector: string;
    getForm : Form;
    initEvents(): void;
    verifyLonLatInput(): string[];
}

interface MapForm_interactions {
    mymap: ATP_map;
    form: Form_view;
    initEvents(): void;
    onMapClick(e: any): void;
    shapeRequestWithLocation(lon: number, lat: number): void;
}


interface Shape {
    lon: number[],
    lat: number[],
    type: string,
    label: string
    coords?: number[][],
    text?: string
}

interface Wind {
    v: number,
    speed: number
    u: number,
}

interface ShapeData {
    shapes: Shape[],
    wind: Wind,
    date: string,
    time: string,
    step: string
}

interface Form {
    date: string,
    time: string,
}

interface ArchiveForm extends Form {}

interface PredictionForm extends Form {
    lon: string,
    lat: string,
    step: string
}