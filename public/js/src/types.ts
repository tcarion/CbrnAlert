interface ATP_map {
    map: any;
    drawn_shapes: ShapeData[];
    clickable: boolean;
    areaToCoords(area: number[]): number[][];
    map_area: number[];
    rect_area: number[];
    drawShapes(shape_data: ShapeData, map: any): void;
    newMarker(lon: string | number, lat: string | number) : void;
    newRectangle(rect:any) : void;
}
interface Form_view {
    form: Form | undefined;
    lon_selector: string;
    lat_selector: string;
    error_selector: string;
    atp45_request_selector: string;

    flexextract_startdate_selector: string
    flexextract_starttime_selector: string
    flexextract_enddate_selector: string
    flexextract_endtime_selector: string
    flexextract_timestep_selector: string
    flexextract_gridres_selector: string
    flexextract_area_selector: string

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
}

interface ATP45Form extends Form {
    date: string,
    time: string,
}
interface ArchiveForm extends ATP45Form {
}

interface PredictionForm extends ATP45Form {
    lon: string,
    lat: string,
    step: string
}

interface FlexextractForm extends Form {
    startdate: string,
    starttime: string,
    enddate: string,
    endtime: string,
    timestep: string,
    gridres: string,
    area: string
}