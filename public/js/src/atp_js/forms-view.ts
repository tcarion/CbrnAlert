let $ = require('jquery')
let dayjs = require('dayjs')
export default class Form_view implements Form_view {
    form: Form = {};
    
    error_selector: string = "#form_error";
    lon_selector: string = "input#lon";
    lat_selector: string = "input#lat";

    /*
    * ATP-45 SELECTORS
    */
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
    flexextract_request_selector: string = "#flexextract_req_btn"

    /*
    * FLEXPART SELECTORS
    */
    flexpart_startdatetime_selector: string = "#flexpart_startdatetime"
    flexpart_enddatetime_selector: string = "#flexpart_enddatetime"
    flexpart_releasestartdatetime_selector: string = "#flexpart_releasestartdatetime"
    flexpart_releaseenddatetime_selector: string = "#flexpart_releaseenddatetime"
    flexpart_releaseheight_selector: string = "#flexpart_releaseheight"
    flexpart_timestep_selector: string = "#flexpart_step"
    flexpart_gridres_selector: string = "#flexpart_grid"
    flexpart_area_selector: string = "#flexpart_area"
    flexpart_particules_selector: string = "#flexpart_particules"
    flexpart_run_selector: string = "#flexpart_req_btn"

    flexpart_plot_time: string = "#flexpart_plot_time"
    flexpart_plot_height: string = "#flexpart_plot_height"

    initEvents() {
        let form_view = this

        if ($(".checkedform").length) {
            $(".checkedform").prepend('<div class="error-notif" id="form_error"></div>')
            $(document).on('click', function () { 
                $(form_view.error_selector).hide("slow");
            });
        }
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
        } else if ($(".flexextract-form").length) {
            this.form = {
                startdate: $(this.flexextract_startdate_selector).val(),
                starttime: $(this.flexextract_starttime_selector).val(),
                enddate: $(this.flexextract_enddate_selector).val(),
                endtime: $(this.flexextract_endtime_selector).val(),
                timestep: $(this.flexextract_timestep_selector).val(),
                gridres: $(this.flexextract_gridres_selector).val(),
                area: $(this.flexextract_area_selector).val(),
            } as FlexextractForm
        } else if ($(".flexpart-run-wrapper:visible").length) {
            let startdatetime = dayjs($(this.flexpart_startdatetime_selector).val(), "YYYY-MM-DD @ HH");
            let enddatetime = dayjs($(this.flexpart_enddatetime_selector).val(), "YYYY-MM-DD @ HH");
            let releasestartdatetime = dayjs($(this.flexpart_releasestartdatetime_selector).val(), "YYYY-MM-DD @ HH");
            let releaseenddatetime = dayjs($(this.flexpart_releaseenddatetime_selector).val(), "YYYY-MM-DD @ HH");
            this.form = {
                lon: $(this.lon_selector).val(),
                lat: $(this.lat_selector).val(),
                startdatetime: startdatetime.isValid() ? startdatetime.format() : "",
                enddatetime: enddatetime.isValid() ? enddatetime.format() : "",
                releasestartdatetime: releasestartdatetime.isValid() ? releasestartdatetime.format() : "",
                releaseenddatetime: releaseenddatetime.isValid() ? releaseenddatetime.format() : "",
                releaseheight: $(this.flexpart_releaseheight_selector).val(),
                timestep: $(this.flexpart_timestep_selector).val(),
                gridres: $(this.flexpart_gridres_selector).val(),
                area: $(this.flexpart_area_selector).val(),
                particules: $(this.flexpart_particules_selector).val(),
            } as FlexpartForm
        } else if ($(".flexpart-plot-wrapper:visible").length) {
            this.form = {
                time: $(this.flexpart_plot_time).val(),
                height: $(this.flexpart_plot_height).val(),
            } as FlexpartPlotForm
        }
        return this.form;
    }
    
    // updateForm(form:FlexpartForm) {
    //     for (let prop in form) {
    //         $(this[`flexpart_${prop}_selector`]).val(form[prop])
    //     }
    // }
    updateOptions(selector: string, new_val: string[]) {
        $(selector).children("option").remove();
        new_val.forEach(val => {
            $(selector).append(`<option value="${val}">${val}</option>`);
        });
    }

    checkFormValidity() {
        let messages: string[] = [];
        let form = this.getForm;
        
        if (isModelForm(form)) {
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
        }

        if (isFlexpartForm(form)) {
            let start = form.startdatetime;
            let end = form.enddatetime;
            let releasestart = form.releasestartdatetime;
            let releaseend = form.releaseenddatetime;
            if (dayjs(end).isBefore(start) || dayjs(releaseend).isBefore(releasestart)) {
                messages.push("End date must be after start date")
            }

            if (!dayjs(start).isValid() || !dayjs(end).isValid() || !dayjs(releasestart).isValid() || !dayjs(releaseend).isValid()) {
                messages.push("No correct datetimes have been selected")
            }
        }

        if (isFlexextractForm(form)) {
            let start = dayjs(`${form.startdate}T${form.starttime}`, "YYYY-MM-DDTHH");
            let end = dayjs(`${form.enddate}T${form.endtime}`, "YYYY-MM-DDTHH");
            if (dayjs(end).isBefore(start)) {
                messages.push("End date must be after start date")
            }

        }

        if (isFlexpartForm(form) || isFlexextractForm(form)) {
            if (form.area == "") {
                messages.push("No area has been selected")
            }
        }

        return messages;
    }
}

function isModelForm(form: Form): form is ModelForm {
    return (form as ModelForm).lat !== undefined || (form as ModelForm).lon !== undefined;
}

function isFlexextractForm(form: Form): form is FlexextractForm {
    return (form as FlexextractForm).startdate !== undefined || (form as FlexextractForm).starttime !== undefined || (form as FlexextractForm).enddate !== undefined || (form as FlexextractForm).endtime !== undefined;
}

function isFlexpartForm(form: Form): form is FlexpartForm {
    return (form as FlexpartForm).startdatetime !== undefined || (form as FlexpartForm).enddatetime !== undefined;
}