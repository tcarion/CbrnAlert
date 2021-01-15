interface Shape {
    lon: number[],
    lat: number[],
    type: string,
    label: string
    coords?: number[][],
    text?: string
}
interface Wind {
    u: number,
    v: number,
    speed: number
}
interface ShapeData {
    shapes: Shape[],
    wind: Wind,
    date: string,
    time: string,
    step: string
}

export function shapeRequest(lon: number | string, lat: number | string, date: string, time: string, step: string, area: number[], loaded_file = "") {
    return new Promise((resolve, reject) => {
        let to_send = { 'lon': lon, 'lat': lat, 'date': date, 'step': step, 'time': time, 'loaded_file': loaded_file, 'area': area.join('/') };
        let xhr = new XMLHttpRequest();

        xhr.open('POST', '/atp_shape_request', true);

        xhr.onload = function () {
            let shape_data: ShapeData = JSON.parse(this.response);
            let shapes = shape_data.shapes
            let speed = Math.round(shape_data.wind.speed * 10) / 10;
            shapes.forEach((shape, i) => {
                shape.coords = shape.lon.map((l, i) => [shape.lat[i], l]);
                shape.text =
                    `<b>${shape.label}</b><br>
                    <b>Coordinates : (${lat}, ${lon})</b><br>
                    wind speed = ${speed}<br>
                    date = ${date}<br>
                    time = ${time}<br>
                    step = ${step}`;
            })
            resolve(shape_data)
        };
        xhr.onerror = () => {
            alert("error in shape request")
            reject("ERROR IN SHAPE REQUEST")
        }
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(to_send));
    })
}

export function marsDataRequest(map_area: number[], date?: string, time?: string) {
    let to_send;

    if (date && time) {
        to_send = {'date_request' : date, 'time_request' : time, 'area_request' : map_area.join('/')};
    }
    else {
        to_send = {'area_request' : map_area.join('/')};
    }

    let xhr = new XMLHttpRequest();

    xhr.open('POST', '/mars_request', true);

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(to_send));
};