import ATP_map from "./atp_map";
import { shapeRequest } from './atp_server_requests'
let L = require('leaflet')
// let $ = require('jquery')

export default class ATP_map_view {
    mymap: ATP_map;
    
    constructor(map: ATP_map) {
        this.mymap = map;
    }

    initEvents() {
        // map.on('dragend', () => this.mymap.updateArea(map));
        // map.on('zoomend', () => this.mymap.updateArea(map));
        this.mymap.map.on('click', (e: any) => this.onMapClick(e));

        if ($("#av-area").text()) L.rectangle(this.mymap.areaToCoords(JSON.parse($("#av-area").text())), { interactive: false, fillOpacity: 0 }).addTo(this.mymap.map);
    }

    onMapClick(e: any) {
        let latlng = e.latlng;
        let lat = Math.round(latlng.lat*100)/100;
        let lon = Math.round(latlng.lng *100)/100;
        L.circleMarker([lat, lon], {radius : 0.5, color : 'black'}).addTo(this.mymap.map)
        $("input#lat").val(lat);
        $("input#lon").val(lon);
        let selected_option = $("select option:selected").val()?.match("(.*)T(.*)\\+(.*)");
        let date = selected_option[1];
        let step = selected_option[3];
        let time = selected_option[2];
        let loaded_file = $("input#loaded_file").val();

        if (!loaded_file || loaded_file == "") {
            let len = $(".topbar ul li").length + 1
            let id = `#userfb${len} code`
            $(".topbar ul").append(`<li class="topbar-elem" data-user-feedback="#userfb${len}"> ATP4 request n°${len} </li>`)
            let popup_html = `<div class="userfb" id="userfb${len}"><pre class=" language-batch"> \
                                    <code class=" language-batch"> \
                                    </code> \
                                </pre></div>`
            $(".topbar").append(popup_html)
            window.parse_payload = function (payload) {
                let elem = `<span class="token command"> ${payload} </span>`
                $(`#userfb${len} code`).append(elem)
            }
            $(".topbar-elem").on('click', function () {
                let id = $(this).data("user-feedback")
                $(id).toggle(500)
            });
        }

        shapeRequest(lon, lat, date, time, step, this.mymap.map_area, loaded_file).then(data => this.mymap.drawShapes(data, this.mymap.map));
        // if (loaded_file == "" || !loaded_file) {
        //     Genie.WebChannels.sendMessageTo('realtime_atp_prediction', 'shape_request', {"f1" : 1})
        // } else {
        // }
    }
}
