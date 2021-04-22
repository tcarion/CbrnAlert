
export async function shapeRequest(to_send: any) {
    // let to_send: {[k: string]: any } = { lon: lon, lat: lat, date: date, step: step, time: time, loaded_file: loaded_file, area: area.join('/') };

    // if (loaded_file == "") { to_send.channel = Genie.Settings.webchannels_default_route + "/" + uuidv4() }

    let response = await fetch('/atp45/atp_shape_request', {
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
};

export async function marsDataRequest(to_send: any) {
    let response = await fetch('/atp45/mars_request', {
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

export async function flexextractRequest(to_send: FlexextractForm) {
    let response = await fetch('/flexpart/flexextract_request', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(to_send)
    });

    if (response.ok) {
        alert('The flexetract has been sent and is processing')
    }
};

export async function flexpartRunRequest(to_send: FlexpartForm) {
    let response = await fetch('/flexpart/flexpart_run_request', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(to_send)
    });

    if (response.ok) {
        alert('Flexpart has been run')
    }
}

export async function flexpartGetDataToPlot(to_send: any) {
    let response = await fetch('/flexpart/flexpart_run_output', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(to_send)
    });

    let data_to_plot;
    if (response.ok) {
        data_to_plot = await response.json();
    } else {
        let error = await response.json();
        alert(error.info);
        return;
    }

    return data_to_plot;
}