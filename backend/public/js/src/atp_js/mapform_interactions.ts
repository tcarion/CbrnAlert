// import ATP_map from "./atp_map";
import { shapeRequest, marsDataRequest, flexextractRequest, flexpartRunRequest, flexpartGetDataToPlot } from './atp_server_requests'
let L = require('leaflet')
let $ = require('jquery')
let dayjs = require('dayjs')
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

        $(".flexpart-run-wrapper .flexpart-selection-input").on("change", function (this:HTMLInputElement) {
            if (this.checked) {
                let metadata = $(this).data("metadata");
                let av_area = metadata.area;
                let parsed_area = av_area.split("/").map((x:string) => parseFloat(x));
                mymap.newRectangle(L.rectangle(mymap.areaToCoords(parsed_area), { interactive: false, fillOpacity: 0 }));
                let start_dt = dayjs(`${metadata.startdate}T${metadata.starttime}`, "YYYY-MM-DDTHH");
                let hour_span = parseInt(metadata.endtime);
                let available_dates: string[] = [start_dt.format('YYYY-MM-DD [@] HH')];
                for (let i = 0; i < hour_span; i++) {
                    available_dates.push(start_dt.add(i+1, 'hour').format('YYYY-MM-DD [@] HH'))
                }
                form_view.updateOptions(form_view.flexpart_startdatetime_selector, available_dates);
                form_view.updateOptions(form_view.flexpart_enddatetime_selector, available_dates);
                form_view.updateOptions(form_view.flexpart_releasestartdatetime_selector, available_dates);
                form_view.updateOptions(form_view.flexpart_releaseenddatetime_selector, available_dates);
            }
        })

        $(".flexpart-plot-wrapper .flexpart-selection-input").on("change", function (this:HTMLInputElement) {
            if (this.checked) {
                let metadata = $(this).data("metadata");
                let av_area = metadata.area;
                let parsed_area = av_area.split("/").map((x:string) => parseFloat(x));
                mymap.newRectangle(L.rectangle(mymap.areaToCoords(parsed_area), { interactive: false, fillOpacity: 0 }));
                let times = metadata.times;
                let heights = metadata.heights;
                form_view.updateOptions(form_view.flexpart_plot_time, times);
                form_view.updateOptions(form_view.flexpart_plot_height, heights);
            }
        })

        $(`${form_view.lon_selector}, ${form_view.lat_selector}`).on('keypress', (e:KeyboardEvent) => {
            if (e.key == 'Enter') {
                let messages = form_view.checkFormValidity();
                if (messages.length == 0) {
                    let form = form_view.form as ModelForm;
                    mymap.newMarker(form.lon, form.lat);
                }
                else {
                    e.stopPropagation();
                    $(this.form_view.error_selector).text(messages.join(', '));
                    $(this.form_view.error_selector).show("slow");
                }
            }
        });

        mymap.map.on('draw:created', (e:any) => {
            let rect = e.layer;
            mymap.newRectangle(rect)
            let area = mymap.rect_area.join('/');
            $(".text-area").val(area);
        });

        
        $('.archive-form #archive_data_retrieve').on('click', () => this.sendMarsRequest());
        $(form_view.atp45_request_selector).on('click', (e:Event) => this.sendAtp45Request(e));
        $(form_view.flexextract_request_selector).on('click', (e:Event) => this.sendFlexextractRequest(e))
        $(form_view.flexpart_run_selector).on('click', (e:Event) => this.sendFlexpartRequest(e));
        $('#flexpart_plot_btn').on('click', () => this.flexpartPlot());
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

    async sendFlexextractRequest(e: any) {
        let messages = this.form_view.checkFormValidity();
        let form = this.form_view.getForm as FlexextractForm;
        if (messages.length == 0) {
            try {
                await flexextractRequest(form)
            } catch (error) {
                console.error(error)
            }
        }
        else {
            e.stopPropagation();
            $(this.form_view.error_selector).text(messages.join(', '));
            $(this.form_view.error_selector).show("slow");
        }
    }

    sendAtp45Request(e: any) {
        let messages = this.form_view.checkFormValidity();
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

    async sendFlexpartRequest(e: any) {
        let messages = this.form_view.checkFormValidity();
        let form = this.form_view.getForm as FlexpartForm;
        let to_send = {...form, extracted_dirname: $(".flexpart-selection-input:checked").attr("id")}
        if (messages.length == 0) {
            await flexpartRunRequest(to_send);
        }
        else {
            e.stopPropagation();
            $(this.form_view.error_selector).text(messages.join(', '));
            $(this.form_view.error_selector).show("slow");
        }
    }

    async flexpartPlot() {
        let form = this.form_view.getForm as FlexpartPlotForm;
        let to_send = {...form, selected_run:  $(".flexpart-plot-wrapper .flexpart-selection-input:checked").attr("id")}
        let data_to_plot = await flexpartGetDataToPlot(to_send);
        this.mymap.drawHeatmap(data_to_plot.lons, data_to_plot.lats, data_to_plot.values)
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
