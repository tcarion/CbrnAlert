let $ = require('jquery')
export default class Form_view implements Form_view {
    /*
    * ATP-45 SELECTORS
    */
    form: Form = {};
    lon_selector: string = "input#lon";
    lat_selector: string = "input#lat";
    error_selector: string = "#error_lonlat_input";
    atp45_request_selector: string = "#atp45_request_button";

    /*
    * FLEX_EXTRACT SELECTORS
    */
    flexextract_startdate_selector: string = "#flexextract_startdate"
    flexextract_starttime_selector: string = "#flexextract_starttime"
    flexextract_enddate_selector: string = "#flexextract_enddate"
    flexextract_endtime_selector: string = "#flexextract_endtime"
    flexextract_timestep_selector: string = "#flexextract_step"
    flexextract_gridres_selector: string = "#flexextract_grid"
    flexextract_area_selector: string = "#flexextract_area"

    initEvents() {
        let form_view = this

        $(document).on('click', function () { 
            $(form_view.error_selector).hide("slow");
        });
    }

    get getForm() {
        if ($(".atp-prediction-form").length) {
            let option = $(".atp-prediction-form select option:selected");
            let date = option.val() as string;
            let selected_date = date?.match("(.*)@(.*)")!;
            let step = option.data().step.toString();
            this.form = {
                lon: $(this.lon_selector).val(),
                lat: $(this.lat_selector).val(),
                date: selected_date[1].trim(),
                step: step,
                time: selected_date[2].trim(),
            } as PredictionForm;
        } else if ($(".archive-form").length) {
            this.form = {
                date: $('.archive-form #archive_date').val()?.toString(),
                time: $('.archive-form .time-item input[type=radio]:checked').val()?.toString()
            } as ArchiveForm;
        } else if ($(".flexextract-form")) {
            this.form = {
                startdate: $(this.flexextract_startdate_selector).val(),
                starttime: $(this.flexextract_starttime_selector).val(),
                enddate: $(this.flexextract_enddate_selector).val(),
                endtime: $(this.flexextract_endtime_selector).val(),
                timestep: $(this.flexextract_timestep_selector).val(),
                gridres: $(this.flexextract_gridres_selector).val(),
                area: $(this.flexextract_area_selector).val(),
            } as FlexextractForm
        }

        return this.form;
    }

    verifyLonLatInput() {
        let messages: string[] = [];
        let form = this.getForm as PredictionForm;
        
        let outOfBound = (lon: number, lat: number) => {
            if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
                return true;
            } else {
                return false;
            }
        }
        if (form.lat == "") {
            messages.push("A latitude must be specified");
        } else if (!form.lat.match(/^-?\d{1,3}[,|.]?\d*$/gm)) {
            messages.push("Wrong format for latitude");
        }

        if (form.lon == "") {
            messages.push("A longitude must be specified");
        } else if (!form.lon.match(/^-?\d{1,3}[,|.]?\d*$/gm)) {
            messages.push("Wrong format for longitude");
        }

        if (outOfBound(parseFloat(form.lon), parseFloat(form.lat))) {
            messages.push("Latitude must be [-90, 90], longitude must be [-180, 180]")
        }
        return messages;
    }
}