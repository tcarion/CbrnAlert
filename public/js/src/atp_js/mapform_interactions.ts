// import ATP_map from "./atp_map";
import { shapeRequest, marsDataRequest } from './atp_server_requests'
let L = require('leaflet')
// let $ = require('jquery')

export default class MapForm_interactions implements MapForm_interactions {
    constructor(
        public mymap: ATP_map,
        public form_view: Form_view
    ) { }

    initEvents() {
        let mymap = this.mymap;
        let form_view = this.form_view;
        if (mymap.clickable) mymap.map.on('click', (e: any) => this.onMapClick(e));

        if ($("#av-area").text()) L.rectangle(this.mymap.areaToCoords(JSON.parse($("#av-area").text())), { interactive: false, fillOpacity: 0 }).addTo(mymap.map);

        $('.archive-form #archive_data_retrieve').on('click', () => {
            let form = form_view.getForm
            let date = form.date;
            let time = form.time;
            marsDataRequest(mymap.map_area, date, time)
        });

        $('.archive-form #latest_available_fc').on('click', () => {
            marsDataRequest(mymap.map_area)
        });

        $(form_view.manual_entry_selector).on('click', e => this.manualEntryRequest(e));
    }

    onMapClick(e: any) {
        this.mymap.map.off('click')
        let latlng = e.latlng;
        let lat = Math.round(latlng.lat * 1000) / 1000;
        let lon = Math.round(latlng.lng * 1000) / 1000;
        $(this.form_view.lat_selector).val(lat);
        $(this.form_view.lon_selector).val(lon);
        this.shapeRequestWithLocation(lon, lat)

        // this.mymap.map.on('click', (e: any) => this.onMapClick(e))

        // if (loaded_file == "" || !loaded_file) {
        //     Genie.WebChannels.sendMessageTo('realtime_atp_prediction', 'shape_request', {"f1" : 1})
        // } else {
        // }
    }

    async shapeRequestWithLocation(lon: number, lat: number) {
        this.disableRequest();
        L.circleMarker([lat, lon], { radius: 0.5, color: 'black' }).addTo(this.mymap.map)
        let form = this.form_view.getForm as PredictionForm
        let date = form.date;
        let step = form.step;
        let time = form.time;
        let loaded_file = $("input#loaded_file").val();

        let len = 0
        if (!loaded_file || loaded_file == "") {
            len = $(".topbar ul li").length + 1;
            let id = `#userfb${len} code`;
            $(".topbar ul").append(`<li class="topbar-elem" data-user-feedback="#userfb${len}"> ATP45 request n°${len} </li>`)
            let userfb_html = `<div class="userfb" id="userfb${len}"> \
                                    <code> \
                                    </code> \
                                </div>`;
            $(".topbar").append(userfb_html);

            window.parse_payload = function (payload: string) {
                let elem = `${payload} <br>`;
                $(`#userfb${len} code`).append(elem);
            }
            $(`.topbar-elem[data-user-feedback="#userfb${len}"]`).toggleClass("pending")
            $(`.topbar-elem[data-user-feedback="#userfb${len}"]`).on('click', function () {
                $(this).siblings().each(function () {
                    $(this).removeClass("active")
                    $($(this).data("user-feedback")).hide();
                });
                let id = $(this).data("user-feedback");
                $(this).toggleClass("active");
                $(id).toggle(500);
            });
        }

        try {
            let shape = await shapeRequest(lon, lat, date, time, step, this.mymap.map_area, loaded_file);
            this.mymap.drawShapes(shape, this.mymap.map)
            $(`.topbar-elem[data-user-feedback="#userfb${len}"]`).toggleClass("pending")
            $(`.topbar-elem[data-user-feedback="#userfb${len}"]`).toggleClass("success")
        } catch (error) {
            console.error(error);
            $(`.topbar-elem[data-user-feedback="#userfb${len}"]`).toggleClass("pending")
            $(`.topbar-elem[data-user-feedback="#userfb${len}"]`).toggleClass("error")
        }
        finally {
            this.enableRequest();
        }
    }

    manualEntryRequest(e: any) {
        let messages = this.form_view.verifyLonLatInput();
        let form = this.form_view.getForm as PredictionForm;
        if (messages.length == 0) {
            this.shapeRequestWithLocation(parseFloat(form.lon), parseFloat(form.lat))
        }
        else {
            e.stopPropagation();
            $(this.form_view.error_selector).text(messages.join(', '));
            $(this.form_view.error_selector).show("slow");
        }
    }

    disableRequest() {
        this.mymap.map.off('click');
        $(this.form_view.manual_entry_selector).off('click');
    }

    enableRequest() {
        this.mymap.map.on('click', (e: any) => this.onMapClick(e));
        $(this.form_view.manual_entry_selector).on('click', e => this.manualEntryRequest(e));
    }
}
