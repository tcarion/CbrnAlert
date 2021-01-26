import ATP_map from './atp_map'
import { shapeRequest, marsDataRequest } from './atp_server_requests'

export default class Form_view implements Form_view {
    form: Form | undefined;
    lon_selector: string = "input#lon";
    lat_selector: string = "input#lat";
    error_selector: string = "#error_lonlat_input";
    manual_entry_selector: string = "manual_entry_button";
    // date_selector: string;
    // time_selector: string;
    // step_selector: string | undefined;

    initEvents() {
        let form_view = this
        $('.lonlat').on('keypress', (e) => {
            if (e.key == 'Enter') $(form_view.manual_entry_selector).trigger('click');
        });

        $(document).on('click', function () {
            $(form_view.error_selector).hide("slow");
        });
    }

    get getForm() {
        if ($(".atp-prediction-form").length) {
            let selected_option = $(".atp-prediction-form select option:selected").val()?.match("(.*)T(.*)\\+(.*)");
            this.form = {
                lon: $(this.lon_selector).val(),
                lat: $(this.lat_selector).val(),
                date: selected_option[1],
                step: selected_option[3],
                time: selected_option[2],
            } as PredictionForm;
        } else {
            this.form = {
                date: $('.archive-form #archive_date').val()?.toString(),
                time: $('.archive-form .time-item input[type=radio]:checked').val()?.toString()
            } as ArchiveForm;
        }

        return this.form
    }

    verifyLonLatInput() {
        let messages: string[] = [];
        let form = this.getForm as PredictionForm;

        if (form.lat == "") {
            messages.push("A latitude must be specified");
        } else if (!form.lat.match(/^\d{1,3}[,|.]?\d*$/gm)) {
            messages.push("Wrong format for latitude");
        }

        if (form.lon == "") {
            messages.push("A longitude must be specified");
        } else if (!form.lon.match(/^\d{1,3}[,|.]?\d*$/gm)) {
            messages.push("Wrong format for longitude");
        }

        return messages;
    }

}
// export default class Form_view {
//     mymap: ATP_map

//     constructor(mymap: ATP_map) {
//         this.mymap = mymap;
//     }

//     initEvents() {
//         let map = this.mymap;
//         $('.archive-form #archive_data_retrieve').on('click', () => {
//             let date = $('.archive-form #date_request').val()?.toString();
//             let time = $('.archive-form .time-item input[type=radio]:checked').val()?.toString();
//             marsDataRequest(map.map_area, date, time)
//         });

//         $('.archive-form #latest_available_fc').on('click', () => {
//             marsDataRequest(map.map_area)
//         });

//         $('#manual_entry_button').on('click', e => this.manualEntryRequest(e));

//         
//     }

//     manualEntryRequest(e: any) {
//         let messages = [];
//         let lat = $("input#lat").val()?.toString().trim();
//         let lon = $("input#lon").val()?.toString().trim();

//         if (lat=="") {
//             messages.push("A latitude must be specified");
//         } else if (!lat.match(/^\d{1,3}[,|.]?\d*$/gm)){
//             messages.push("Wrong format for latitude");
//         }

//         if (lon=="") {
//             messages.push("A longitude must be specified");
//         } else if (!lon.match(/^\d{1,3}[,|.]?\d*$/gm)){
//             messages.push("Wrong format for longitude");
//         }

//         if (messages.length == 0) {
//             this.mymap.
//         }
//         else {
//             e.stopPropagation();
//             $("#error_lonlat_input").text(messages.join(', '));
//             $("#error_lonlat_input").show("slow");
//         }
//     }
// }