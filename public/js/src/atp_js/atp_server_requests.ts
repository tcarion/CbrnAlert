
export async function shapeRequest(to_send: any) {
    // let to_send: {[k: string]: any } = { lon: lon, lat: lat, date: date, step: step, time: time, loaded_file: loaded_file, area: area.join('/') };

    // if (loaded_file == "") { to_send.channel = Genie.Settings.webchannels_default_route + "/" + uuidv4() }

    let response = await fetch('/atp_shape_request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(to_send)
    })
    
    let shape_data;
    if (response.ok) {
        shape_data = await response.json();
    } else {
        let error = await response.json();
        alert(error.info);
        return;
    }
    
    let shapes = shape_data.shapes;
    let speed = Math.round(shape_data.wind.speed * 3.6 * 10) / 10;
    shapes.forEach((shape: Shape, i: number) => {
        shape.coords = shape.lon.map((l, i) => [shape.lat[i], l]);
        shape.text =
            `<b>${shape.label}</b><br>
            <b>Coordinates : (${to_send.lat}, ${to_send.lon})</b><br>
            wind speed = ${speed} km/h<br>
            date = ${to_send.date}<br>
            time = ${to_send.time}<br>
            step = ${to_send.step}`;
    });
    return shape_data;
}

export async function marsDataRequest(to_send: any) {
    const response = await fetch('/mars_request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(to_send)
    });

    if (response.ok) {
        alert('The mars request has been loaded');
    }
    else {
        let error = await response.json();
        alert(error.info)
        throw(error.info)
    }
};