let mymap = L.map('mapid').setView([50.82, 4.35], 8);
let atp_area_prediction_array = [];
let shapes_color = ['blue', 'red', 'yellow']
L.tileLayer('//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    attribution: 'donn&eacute;es &copy; <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
    minZoom: 1,
    maxZoom: 20
}).addTo(mymap);

let available_dates = $(".available-dates").map(function(){
    return new Date($(this).val())
})

$('#forecast_datepicker').datetimepicker({
    timepicker: true,
    datepicker: true,
    formatDate:'Y-m-d',
    allowTimes: ['00:00', '12:00'],
    allowDates: ['2020-12-23','2020-12-25'], 
})

function onMapClick(e) {
    let latlng = e.latlng;
    let lat = Math.round(latlng.lat*100)/100;
    let lon = Math.round(latlng.lng *100)/100;
    $("input#lat").val(lat);
    $("input#lon").val(lon);
    let date = $("select#select_date option:selected").val();
    let step = $("select#select_step option:selected").val();
    let time = $("select#select_time option:selected").val();
    let loaded_file = $("input#loaded_file").val();
    let to_send = {'lon' : lon, 'lat' : lat, 'date' : date, 'step' : step, 'time' : time, 'loaded_file' : loaded_file};
    L.circleMarker([lat, lon], {radius : 0.5, color : 'black'}).addTo(mymap)
    let atp_area_prediction = []
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        // console.log(this) 
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

    xhr.open('POST', '/atp_coords', true);

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(to_send));

}

function archiveDataRequest() {
    let date_request = $('#date_request').val();
    let times_request = $('.time-item input[type="checkbox"]:checked').map(function(){
        return $(this).val();
    }).get();

    let to_send = {'date_request' : date_request, 'times_request' : times_request}

    let xhr = new XMLHttpRequest();

    xhr.open('POST', '/archive_request', true);

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(to_send));
};
// function updateArea(e) {
//     let bounds = mymap.getBounds();
//     $("input#lolelon").val(bounds.getSouthWest().lng);
//     $("input#lolelat").val(bounds.getSouthWest().lat);
//     $("input#uprilon").val(bounds.getNorthEast().lng);
//     $("input#uprilat").val(bounds.getNorthEast().lat);
// }

// mymap.on('dragend', updateArea);
// mymap.on('zoomend', updateArea);

mymap.on('click', onMapClick);

$('#archive_data_retrieve').on('click', archiveDataRequest);
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