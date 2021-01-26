
export function shapeRequest(lon: number | string, lat: number | string, date: string, time: string, step: string, area: number[], loaded_file = "") {
    let to_send: {[k: string]: any } = { lon: lon, lat: lat, date: date, step: step, time: time, loaded_file: loaded_file, area: area.join('/') };

    if (loaded_file == "") { to_send.channel = Genie.Settings.webchannels_default_route }

    return fetch('/atp_shape_request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(to_send)
    }).then(res => {
        if (res.ok) {
            return res.json();
        } else {
            alert("Couldn't get ATP prediction from server")
        }
    })
    .then(data => {
        let shape_data: ShapeData = data;
        let shapes = shape_data.shapes;
        let speed = Math.round(shape_data.wind.speed * 10) / 10;
        shapes.forEach((shape, i: number) => {
            shape.coords = shape.lon.map((l, i) => [shape.lat[i], l]);
            shape.text =
                `<b>${shape.label}</b><br>
                <b>Coordinates : (${lat}, ${lon})</b><br>
                wind speed = ${speed}<br>
                date = ${date}<br>
                time = ${time}<br>
                step = ${step}`;
        });
        return shape_data;
    })
}

export async function marsDataRequest(map_area: number[], date?: string, time?: string) {
    let to_send;

    if (date && time) {
        to_send = {'date_request' : date, 'time_request' : time, 'area_request' : map_area.join('/')};
    }
    else {
        to_send = {'area_request' : map_area.join('/')};
    }

    const res = await fetch('/mars_request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(to_send)
    });

    if (res.ok) {
        alert('The mars request has been loaded');
    }
};