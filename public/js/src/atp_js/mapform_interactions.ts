// import ATP_map from "./atp_map";
import { shapeRequest, marsDataRequest, flexextractRequest } from './atp_server_requests'
let L = require('leaflet')
let $ = require('jquery')
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

        $('.archive-form #archive_data_retrieve').on('click', () => this.sendMarsRequest());

        $(`${form_view.lon_selector}, ${form_view.lat_selector}`).on('keypress', (e:KeyboardEvent) => {
            if (e.key == 'Enter') {
                let form = form_view.form as PredictionForm;
                let messages = form_view.verifyLonLatInput();
                if (messages.length == 0) {
                    mymap.newMarker(form.lon, form.lat);
                }
                else {
                    e.stopPropagation();
                    $(this.form_view.error_selector).text(messages.join(', '));
                    $(this.form_view.error_selector).show("slow");
                }
            }
        });

        $(form_view.atp45_request_selector).on('click', (e:Event) => this.sendAtp45Request(e));

        mymap.map.on('draw:created', (e:any) => {
            let rect = e.layer;
            mymap.newRectangle(rect)
            let area = mymap.rect_area.join('/');
            $(form_view.flexextract_area_selector).val(area);
        });

        $("#flexextract_req_btn").on('click', (e:Event) => this.sendFlexextractRequest(e))
    }

    onMapClick(e: any) {
        let latlng = e.latlng;
        let lat = Math.round(latlng.lat * 1000) / 1000;
        let lon = Math.round(latlng.lng * 1000) / 1000;
        $(this.form_view.lat_selector).val(lat);
        $(this.form_view.lon_selector).val(lon);
        // this.shapeRequestWithLocation(lon, lat)   //UNCOMMENT THIS TO HAVE THE REQUEST DIRECTLY ON MAP CLICK
        this.mymap.newMarker(lon, lat)
        // this.mymap.map.on('click', (e: any) => this.onMapClick(e))

    }

    addNotification(len: number, notifText: string) {
        $(".topbar ul").append(`<li class="topbar-elem" data-user-feedback="#userfb${len}"> ${notifText} n°${len} </li>`)
        let userfb_html = `<div class="userfb" id="userfb${len}"> \
                                    <code> \
                                    </code> \
                                </div>`;
        $(".topbar").append(userfb_html);

        window.parse_payload = function (payload: any) {
            let elem = `${payload.payload.displayed} <br>`;
            $(`#userfb${payload.payload.userfb_id} code`).append(elem);
        }
        let current_notif = $(`.topbar-elem[data-user-feedback="#userfb${len}"]`)
        current_notif.toggleClass("pending")
        current_notif.on('click', function (this: typeof current_notif) {
            let current_notif_siblings = $(this).siblings()
            current_notif_siblings.each(function (this: typeof current_notif_siblings) {
                $(this).removeClass("active")
                $($(this).data("user-feedback")).hide();
            });
            let id = $(this).data("user-feedback");
            $(this).toggleClass("active");
            $(id).toggle(500);
        });
        return { channel: Genie.Settings.webchannels_default_route, userfb_id: len }
    }

    async shapeRequestWithLocation(lon: number, lat: number) {
        // this.disableRequest();
        let form = this.form_view.getForm as PredictionForm
        let date = form.date;
        let step = form.step;
        let time = form.time;
        let loaded_file = $("input#loaded_file").val();

        let len = $(".topbar ul li").length
        let channel_info = {}
        if (!loaded_file || loaded_file == "") {
            len += 1;
            channel_info = this.addNotification(len, "ATP45 request")
        }

        try {
            let to_send = { lon: lon, lat: lat, date: date, step: step, time: time, loaded_file: loaded_file, area: this.mymap.map_area.join('/'), channel_info: channel_info };
            let shape = await shapeRequest(to_send);
            this.mymap.drawShapes(shape, this.mymap.map);
            L.circleMarker([lat, lon], { radius: 0.5, color: 'black' }).addTo(this.mymap.map);
            this.notificationSucces(len);
        } catch (error) {
            // console.error(error);
            this.notificationError(len);
        }
    }

    async sendMarsRequest() {
        let form = this.form_view.getForm as ATP45Form;

        let len = $(".topbar ul li").length + 1;
        let channel_info = this.addNotification(len, "Arch. Request");
        let to_send = { date: form.date, time: form.time, area: this.mymap.map_area.join('/'), channel_info: channel_info }
        try {
            await marsDataRequest(to_send);
            this.notificationSucces(len);
        } catch (error) {
            this.notificationError(len);
        }
    }

    async sendFlexextractRequest(e:Event) {
        let form = this.form_view.getForm as FlexextractForm;

        try {
            await flexextractRequest(form)
        } catch (error) {
            console.error(error)
        }
    }

    sendAtp45Request(e: any) {
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
        $(this.form_view.atp45_request_selector).off('click');
    }

    enableRequest() {
        this.mymap.map.on('click', (e: any) => this.onMapClick(e));
        $(this.form_view.atp45_request_selector).on('click', (e:Event) => this.sendAtp45Request(e));
    }

    notificationSucces(len: number) {
        $(`.topbar-elem[data-user-feedback="#userfb${len}"]`).toggleClass("pending")
        $(`.topbar-elem[data-user-feedback="#userfb${len}"]`).toggleClass("success")
    }

    notificationError(len: number) {
        $(`.topbar-elem[data-user-feedback="#userfb${len}"]`).toggleClass("pending")
        $(`.topbar-elem[data-user-feedback="#userfb${len}"]`).toggleClass("error")
    }
}
