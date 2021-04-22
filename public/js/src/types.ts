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
    drawHeatmap(lons:string[], lats:string[], values:string[]): void;
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
    flexextract_request_selector: string

    flexpart_startdatetime_selector: string
    flexpart_enddatetime_selector: string
    flexpart_releasestartdatetime_selector: string
    flexpart_releaseenddatetime_selector: string
    flexpart_releaseheight_selector: string
    flexpart_timestep_selector: string
    flexpart_gridres_selector: string
    flexpart_area_selector: string
    flexpart_particules_selector: string
    flexpart_run_selector: string

    flexpart_plot_time: string
    flexpart_plot_height: string

    getForm : Form;
    initEvents(): void;
    updateOptions(selector: string, new_val: string[]): void;
    checkFormValidity(): string[];
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

interface ModelForm extends Form {
    lon: string,
    lat: string,
}

interface ATP45Form extends Form {
    date: string,
    time: string,
}
interface ArchiveForm extends ATP45Form {
}

interface PredictionForm extends ATP45Form, ModelForm {
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

interface FlexpartForm extends Form, ModelForm {
    startdatetime: string,
    enddatetime: string,
    releasestartdatetime: string,
    releaseenddatetime: string,
    releaseheight: string,
    timestep: string,
    gridres: string,
    area: string,
    particules: string
}

interface FlexpartPlotForm extends Form {
    time: string,
    height: string,
}