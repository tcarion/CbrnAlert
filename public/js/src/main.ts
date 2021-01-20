import ATP_map from './atp_js/atp_map';
import ATP_map_view from './atp_js/atp_map_view'
import MapForms from './atp_js/map_forms-view'
// let $ = require('jquery')

// $(document).ready(function(){
//     $(".nav-item.active").removeClass("active")
//     $(".nav-item a[href*='" + location.pathname + "']").parent().addClass("active");
// });

// $('#realtime_datepicker').datetimepicker({
//     timepicker: true,
//     datepicker: true,
//     formatDate:'Y-m-d',
//     allowTimes: ['00:00', '12:00'],
//     allowDates: ['2020-12-23','2020-12-25'], 
// })

$(() => {
    let my_atp_map = new ATP_map('mapid', [50.82, 4.35], 8);
    let atp_map_view = new ATP_map_view(my_atp_map);
    atp_map_view.initEvents()

    let map_form = new MapForms(my_atp_map)
    map_form.initEvents()

    window.parse_payload = function (payload) {
        $(".mars-output code").append(payload + '<br>')
    }
}) 

