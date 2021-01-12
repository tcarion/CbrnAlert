$(document).ready(function(){
    $(".nav-item.active").removeClass("active")
    $(".nav-item a[href*='" + location.pathname + "']").parent().addClass("active");
});

let mymap = L.map('mapid').setView([50.82, 4.35], 8);

let atp_area_prediction_array = [];
let shapes_color = ['blue', 'red', 'yellow']
L.tileLayer('//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    attribution: 'donn&eacute;es &copy; <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
    minZoom: 1,
    maxZoom: 20
}).addTo(mymap);

function areaToCoords(area) {
    let newArr = [];
    while(area.length) newArr.push(area.splice(0,2));
    return newArr;
}

let map_area;
updateArea();

let available_area
if ($("#av-area").text()) {
    available_area = JSON.parse($("#av-area").text())
    L.rectangle(areaToCoords(available_area), {interactive : false, fillOpacity : 0}).addTo(mymap)
}

function shapeRequest(lon, lat) {
    let selected_option = $("select#forecast_time option:selected").val().match("(.*)T(.*)\\+(.*)");
    let date = selected_option[1];
    let step = selected_option[3];
    let time = selected_option[2];
    let loaded_file = $("input#loaded_file").val();
    let to_send = {'lon' : lon, 'lat' : lat, 'date' : date, 'step' : step, 'time' : time, 'loaded_file' : loaded_file};
    L.circleMarker([lat, lon], {radius : 0.5, color : 'black'}).addTo(mymap)
    let atp_area_prediction = []
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            let shape_data = JSON.parse(this.response);
            let shapes = shape_data.shapes
            let speed = Math.round(shape_data.wind.speed*10)/10;
            shapes.forEach((shape, i) => {
                let coords = shape.lon.map((l, i) => [shape.lat[i], l]);
                let text = 
                    `<b>${shape.label}</b><br>
                    <b>Coordinates : (${lat}, ${lon})</b><br>
                    wind speed = ${speed}<br>
                    date = ${date}<br>
                    time = ${time}<br>
                    step = ${step}`;

                let new_shape = L.polygon(coords, {color : shapes_color[i]}).addTo(mymap);
                new_shape.bindPopup(text);
                atp_area_prediction.push(new_shape)
            })
            if ('nearest_u' in shape_data && 'nearest_v' in shape_data) {
                console.table(shape_data.nearest_u)
                console.table(shape_data.nearest_v)
                console.table(shape_data.wind)
            }
            atp_area_prediction_array.push(atp_area_prediction);
        }
    }

    xhr.open('POST', '/atp_shape_request', true);

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(to_send));
}
function onMapClick(e) {
    let latlng = e.latlng;
    let lat = Math.round(latlng.lat*100)/100;
    let lon = Math.round(latlng.lng *100)/100;
    $("input#lat").val(lat);
    $("input#lon").val(lon);
    shapeRequest(lon, lat)
}

function manualEntryRequest(e) {
    let messages = [];
    let lat = $("input#lat").val().trim();
    let lon = $("input#lon").val().trim();
    let lonlat_format = /^\d{1,3}[,|.]?\d*$/gm
    if (lat=="") {
        messages.push("A latitude must be specified");
    }
    else if (!lat.match(/^\d{1,3}[,|.]?\d*$/gm)){
        messages.push("Wrong format for latitude");
    }

    if (lon=="") {
        messages.push("A longitude must be specified");
    }
    else if (!lon.match(/^\d{1,3}[,|.]?\d*$/gm)){
        messages.push("Wrong format for longitude");
    }

    if (messages.length == 0) {
        shapeRequest(lon, lat);
    }
    else {
        e.stopPropagation();
        $("#error_loaded_data").text(messages.join(', '));
        $("#error_loaded_data").show("slow");
    }
}

function realTimeRequest() {
    let xhr = new XMLHttpRequest();

    xhr.open('POST', '/realtime_request', true);

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function marsDataRequest(event) {
    let date_request = $('#date_request').val();
    let time_request = $('.time-item input[type=radio]:checked').val()
    let area_request = map_area.join('/');
    let to_send;
    if (event.data.req_flag) {
        to_send = {'area_request' : area_request};
    }
    else {
        to_send = {'date_request' : date_request, 'time_request' : time_request, 'area_request' : area_request};
    }

    let xhr = new XMLHttpRequest();

    xhr.open('POST', '/mars_request', true);

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(to_send));
};

function updateArea() {
    let bounds = mymap.getBounds();
    map_area = [
        Math.ceil(bounds.getNorthWest().lat),
        Math.floor(bounds.getNorthWest().lng),
        Math.floor(bounds.getSouthEast().lat),
        Math.ceil(bounds.getSouthEast().lng)
    ];
};

mymap.on('dragend', updateArea);
mymap.on('zoomend', updateArea);

mymap.on('click', onMapClick);

$('#archive_data_retrieve').on('click', {req_flag: 0}, marsDataRequest);
$('#real_time_fc').on('click', {req_flag: 1}, marsDataRequest);

$('#manual_entry_button').on('click', manualEntryRequest);

$('.atp-prediction-form .lonlat').keypress((e) => {
    if(e.keyCode==13)
    $('#manual_entry_button').click();
});

$(document).click(function() {
    $("#error_loaded_data").hide("slow");
});

// let bounds = mymap.getBounds();
// $("input#lolelon").val(bounds.getSouthWest().lng);
// $("input#lolelat").val(bounds.getSouthWest().lat);
// $("input#uprilon").val(bounds.getNorthEast().lng);
// $("input#uprilat").val(bounds.getNorthEast().lat);


//   // Toggle the side navigation
// $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
//   $("body").toggleClass("sidebar-toggled");
//   $(".sidebar").toggleClass("toggled");
//   if ($(".sidebar").hasClass("toggled")) {
//     $('.sidebar .collapse').collapse('hide');
//   };
// });