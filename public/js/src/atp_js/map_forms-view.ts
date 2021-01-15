import ATP_map from './atp_map'
import { shapeRequest, marsDataRequest } from './atp_server_requests'

export default class MapForms {
    mymap: ATP_map;
    
    constructor(mymap: ATP_map) {
        this.mymap = mymap;
    }

    initEvents() {
        let map = this.mymap;
        $('.archive-form #archive_data_retrieve').on('click', () => {
            let date = $('.archive-form #date_request').val()?.toString();
            let time = $('.archive-form .time-item input[type=radio]:checked').val()?.toString();
            marsDataRequest(map.map_area, date, time)
        });

        $('.archive-form #latest_available_fc').on('click', () => {
            marsDataRequest(map.map_area)
        });

        $('#manual_entry_button').on('click', e => this.manualEntryRequest(e));

        $('.atp-prediction-form .lonlat').on('keypress', (e) => {
            if(e.key=='Enter') $('#manual_entry_button').trigger('click');
        });

        $(document).on('click', function() {
            $("#error_loaded_data").hide("slow");
        });
    }

    manualEntryRequest(e: any) {
        let messages = [];
        let lat = $("input#lat").val()?.toString().trim();
        let lon = $("input#lon").val()?.toString().trim();

        if (lat=="") {
            messages.push("A latitude must be specified");
        } else if (!lat.match(/^\d{1,3}[,|.]?\d*$/gm)){
            messages.push("Wrong format for latitude");
        }
    
        if (lon=="") {
            messages.push("A longitude must be specified");
        } else if (!lon.match(/^\d{1,3}[,|.]?\d*$/gm)){
            messages.push("Wrong format for longitude");
        }
    
        if (messages.length == 0) {
            let selected_option = $("select option:selected").val()?.match("(.*)T(.*)\\+(.*)");
            let date = selected_option[1];
            let step = selected_option[3];
            let time = selected_option[2];
            let loaded_file = $("input#loaded_file").val();
            shapeRequest(lon, lat, date, time, step, this.mymap.map_area, loaded_file)
                .then(data => this.mymap.drawShapes(data, this.mymap.map));
        }
        else {
            e.stopPropagation();
            $("#error_loaded_data").text(messages.join(', '));
            $("#error_loaded_data").show("slow");
        }
    }
}