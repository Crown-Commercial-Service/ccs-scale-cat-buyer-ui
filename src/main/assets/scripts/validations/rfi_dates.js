document.addEventListener('DOMContentLoaded', () => {

    let agreementId = '';
    let lotId = '';
    let stageValue = '';

    if(document.getElementById("agreementId") != null && document.getElementById("agreementId").value != undefined ){
        agreementId =  document.getElementById("agreementId").value;
    }

    if(document.getElementById("stage2_value") != null && document.getElementById("stage2_value").value != undefined ){
        stageValue = document.getElementById("stage2_value").value;
    }

    if(document.getElementById("lotId") != null && document.getElementById("lotId").value != undefined ){
        lotId = document.getElementById("lotId").value;
    }

    // let selectors = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    
    let arr = $("#clarification_date_arr").attr("attr");
    let selectors=[];
if(arr!=undefined){
     selectors = arr.split(',');
}
    let radioarray = [];
    for (let element of selectors) { 
        let day = $(`#clarification_date-day_${element}`);
        let month = $(`#clarification_date-month_${element}`);
        let year = $(`#clarification_date-year_${element}`);
        let hour = $(`#clarification_date-hour_${element}`);
        let minutes = $(`#clarification_date-minute_${element}`);
        
        let responseDate = $(`#ccs_rfp_response_date_form_${element}`);
        
        // day.on('blur', () => {
        //     let value = day;
        //     if (value != undefined && value.val() != '') {
        //         let parentID = getParentId(element);
        //         let matchValue = !value.val().match(/^\d\d?$/);
        //         let endmonthCheck = Number(value.val()) > 31;
        //         let startmonthCheck = Number(value.val()) < 1;
        //         if (matchValue || endmonthCheck || startmonthCheck) {
        //             value.addClass("govuk-input--error")
        //             ccsZaddErrorMessage(document.getElementById(parentID), "Enter a valid date");
        //         } else {
        //             value.removeClass("govuk-input--error");
        //             ccsZremoveErrorMessage(document.getElementById(parentID));
        //         }
        //     }
        // });

        // month.on('blur', () => {
        //     let value = month;
        //     if (value != undefined && value.val() != '') {
        //         let parentID = getParentId(element);
        //         let matchValue = !value.val().match(/^\d\d?$/);
        //         let endmonthCheck = Number(value.val()) > 12;
        //         let startmonthCheck = Number(value.val()) <= 0;
        //         if (matchValue || endmonthCheck || startmonthCheck) {
        //             value.addClass("govuk-input--error")
        //             ccsZaddErrorMessage(document.getElementById(parentID), "Enter a valid month");
        //         } else {
        //             value.removeClass("govuk-input--error");
        //             ccsZremoveErrorMessage(document.getElementById(parentID));
        //         }
        //     }
        // });

        // year.on('blur', () => {
        //     let value = year;
        //     if (value != undefined && value.val() != '') {
        //         let parentID = getParentId(element);
        //         let matchValue = !value.val().match(/^\d{4}$/);
        //         let endyearCheck = Number(value.val()) > 2121;
        //         let currentYear = new Date().getFullYear();
        //         let preYear = currentYear-1;
        //         let startyearCheck = Number(value.val()) < preYear;
              
        //         if (matchValue || endyearCheck || startyearCheck) {
        //             value.addClass("govuk-input--error")
        //             ccsZaddErrorMessage(document.getElementById(parentID), "Enter a valid year");
        //         } else {
        //             value.removeClass("govuk-input--error");
        //             ccsZremoveErrorMessage(document.getElementById(parentID));
        //         }
        //     }
        // });

        // hour.on('blur', () => {
        //     let value = hour;
        //     if (value != undefined && value.val() != '') {
        //         let parentID = getParentId(element);
        //         let matchValue = !value.val().match(/^\d\d?$/);
        //         let endmonthCheck = Number(value.val()) > 23;
        //         let startmonthCheck = Number(value.val()) <= 0;
        //         if (day.val() !== '' && month.val() !== '' && day.val() !== '' && !isValidDate(year.val(), month.val(), day.val())) {
        //             value.addClass("govuk-input--error")
        //             ccsZaddErrorMessage(document.getElementById(parentID), "Enter a valid day");
        //         } else {
        //             if (matchValue || endmonthCheck || startmonthCheck || value == '') {
        //                 value.addClass("govuk-input--error")
        //                 ccsZaddErrorMessage(document.getElementById(parentID), "Enter a valid hours");
        //             } else {
        //                 value.removeClass("govuk-input--error");
        //                 ccsZremoveErrorMessage(document.getElementById(parentID));
        //             }
        //         }
        //     }
        // });

        // minutes.on('blur', () => {
        //     let value = minutes;
        //     if (value != undefined && value.val() != '') {
        //         let parentID = getParentId(element);
        //         let matchValue = !value.val().match(/^\d\d?$/);
        //         let endmonthCheck = Number(value.val()) > 59;
        //         let startmonthCheck = Number(value.val()) < 0;
        //         if (day.val() !== '' && month.val() !== '' && day.val() !== '' && !isValidDate(year.val(), month.val(), day.val())) {
        //             value.addClass("govuk-input--error")
        //             ccsZaddErrorMessage(document.getElementById(parentID), "Enter a valid day");
        //         } else {
        //             if (matchValue || endmonthCheck || startmonthCheck || value == '') {
        //                 value.addClass("govuk-input--error")
        //                 ccsZaddErrorMessage(document.getElementById(parentID), "Enter valid minutes");
        //             } else {
        //                 value.removeClass("govuk-input--error");
        //                 ccsZremoveErrorMessage(document.getElementById(parentID));
        //             }
        //         }
        //     }
        // });

        responseDate.on('submit', (e) => {
            e.preventDefault();
            day.removeClass("govuk-input--error")
            month.removeClass("govuk-input--error")
            year.removeClass("govuk-input--error")
            let parentID = getParentId(element);
            
            ccsZremoveErrorMessage(document.getElementById(parentID));
            ccsZremoveErrorMessageRFIDate();
            if (((year.val() != undefined && year.val() == "") || (month.val() != undefined && month.val() == "") || (day.val() != undefined && day.val() == "")) && ((hour.val() != undefined && hour.val() == "") || (minutes.val() != undefined && minutes.val() == ""))) {
                day.addClass("govuk-input--error")
                month.addClass("govuk-input--error")
                year.addClass("govuk-input--error") 
                ccsZaddErrorMessage(document.getElementById(parentID), "Enter a date and time");
                const errorStore = [
                    [parentID, "Enter a date and time"]
                ]
    
                ccsZPresentErrorSummary(errorStore);
            } else if ((year.val() != undefined && year.val() == "") || (month.val() != undefined && month.val() == "") || (day.val() != undefined && day.val() == "")) {
                day.addClass("govuk-input--error")
                month.addClass("govuk-input--error")
                year.addClass("govuk-input--error")
                ccsZaddErrorMessage(document.getElementById(parentID), "Enter a complete date");
                const errorStore = [
                    [parentID, "Enter a complete date"]
                ]
    
                ccsZPresentErrorSummary(errorStore);
            } else if (day.val() != undefined && day.val() == "") {
                day.addClass("govuk-input--error")
                ccsZaddErrorMessage(document.getElementById(parentID), "Day should not be empty");
                const errorStore = [
                    [parentID, "Day should not be empty"]
                ]
    
                ccsZPresentErrorSummary(errorStore);
            } else if (month.val() != undefined && month.val() == "") {
                month.addClass("govuk-input--error")
                ccsZaddErrorMessage(document.getElementById(parentID), "Month should not be empty");
                const errorStore = [
                    [parentID, "Month should not be empty"]
                ]
    
                ccsZPresentErrorSummary(errorStore);
            } else if (year.val() != undefined && year.val() == "") {
                year.addClass("govuk-input--error")
                ccsZaddErrorMessage(document.getElementById(parentID), "Year should not be empty");
                const errorStore = [
                    [parentID, "Year should not be empty"]
                ]
    
                ccsZPresentErrorSummary(errorStore);
            } else if (hour.val() != undefined && hour.val() == "") {
                hour.addClass("govuk-input--error")
                ccsZaddErrorMessage(document.getElementById(parentID), "Enter a complete time");
                const errorStore = [
                    [parentID, "Enter a complete time"]
                ]
    
                ccsZPresentErrorSummary(errorStore);
            }else if (minutes.val() != undefined && minutes.val() == "") {
                minutes.addClass("govuk-input--error")
                ccsZaddErrorMessage(document.getElementById(parentID), "Enter a complete time");
                const errorStore = [
                    [parentID, "Enter a complete time"]
                ]
    
                ccsZPresentErrorSummary(errorStore);
            }else {
                if (!isValidDate(year.val(), month.val(), day.val())) {
                    day.addClass("govuk-input--error")
                    ccsZaddErrorMessage(document.getElementById(parentID), "Enter a complete date");
                    const errorStore = [
                        [parentID, "Enter a complete date"]
                    ]
        
                    ccsZPresentErrorSummary(errorStore);
                } else {
                    console.log("selectors",selectors);
                    console.log("element",element);
                    
                    let indexKey = selectors.indexOf(element);
                    console.log("indexKey",indexKey);
                    
                    let previosElement = indexKey-1;
                    let nextElement = indexKey+1;
                    let previosElementValue=selectors[previosElement];

                    let nextElementValue=selectors[nextElement];
                    console.log('previosElement',previosElement)
                    console.log('nextElement',nextElement)
                    console.log('previosElementValue',previosElementValue)
                    console.log('nextElementValue',nextElementValue)
                    
                    let checkRadioSelectedClassName = 'resdateradio'+previosElementValue;
                    let checkRadioClassName = document.getElementsByClassName('resdateradioclass'+previosElementValue);
                   console.log('check radio available',checkRadioClassName)
                    let checkRadioSelected = $('input[name='+checkRadioSelectedClassName+']:checked').val();
                    console.log('checkRadioSelectedClassName',checkRadioSelectedClassName)
                    console.log('checkRadioSelected',checkRadioSelected)
                   
                    if(checkRadioSelected == 'no' || (checkRadioClassName.length > 0 && checkRadioSelected != 'yes')){
                        previosElementValue = previosElementValue - 1;
                      //  nextElementValue = nextElementValue +1;
                        console.log('previoue element inside null 1st no',previosElementValue)
                      //  console.log('next element inside null 1st no',nextElementValue)
                        let currentDateval = new Date(document.getElementsByClassName(`clarification_${previosElementValue}`)[0].innerText);
                        console.log('current date val ',currentDateval)
                        //if(currentDateval == '' || currentDateval == undefined || currentDateval == null){
                         
                       
                      //  }
                        let checkRadioSelectedClassName = 'resdateradio'+previosElementValue;
                        let checkRadioClassName = document.getElementsByClassName('resdateradioclass'+previosElementValue);
                    let checkRadioSelected = $('input[name='+checkRadioSelectedClassName+']:checked').val();

                    if(checkRadioSelected == 'no' || (checkRadioClassName.length > 0 && checkRadioSelected != 'yes')){
                        previosElementValue = previosElementValue - 1;
                        //nextElementValue = nextElementValue +1;
                        //console.log('next element inside null 2nd no',previosElementValue)

                        
                    }
                        
                    }
                    // console.log('radioarray',radioarray)
                    // if(radioarray.length == 0){
                    //     previosElementValue = previosElementValue - 2;
                    //     console.log(' previosElementValue == 0',previosElementValue)
                    // }
                    // else if(radioarray.length == 1){
                    //   let eleId = radioarray[0].id;
                    //   let eleVal = radioarray[0].value;
                    //  console.log('eleId',eleId)
                    //  console.log('eleVal',eleVal)
                    //  let currentDateval = new Date(document.getElementsByClassName(`clarification_${previosElementValue}`)[0].innerText);
                    //  console.log('current date val ',currentDateval)
                    //  if(currentDateval == '' || currentDateval == undefined || currentDateval == null){
                    //     console.log('previoue element inside null ')
                    //  previosElementValue = previosElementValue - 1;
                    //  }
                    //  console.log(' previosElementValue == 1',previosElementValue)
                    // }
                    // console.log('radio available check',document.getElementsByClassName('timeLineEventTrigger'))
                    // if(document.getElementsByClassName('timeLineEventTrigger').length > 0 && (checkRadioSelected == undefined || checkRadioSelected == 'no' )){
                    //     console.log(' inside date change');
                    //     // let day1 = $(`#clarification_date-day_${element}`);
                    //     // let month1 = $(`#clarification_date-month_${element}`);
                    //     // let year1 = $(`#clarification_date-year_${element}`);
                    //     // let hour1 = $(`#clarification_date-hour_${element}`);
                    //     // let minutes1 = $(`#clarification_date-minute_${element}`); 

                    // }
                    console.log('previosElementValue',previosElementValue)
                    let currentDate = new Date(document.getElementsByClassName(`clarification_${previosElementValue}`)[0].innerText);
                    let enteredDate = new Date(year.val(), month.val() - 1, day.val(), hour.val(), minutes.val());
                    console.log('currentDate',currentDate)
                    console.log('enteredDate',enteredDate)
                    let nextDate = new Date();
                    let isNextDate = false;
                    
                  //  if(selectors.length + 1 > element && document.getElementsByClassName(`clarification_${nextElementValue}`).length > 0){
                    if(document.getElementsByClassName(`clarification_${nextElementValue}`).length > 0){
                       
                  // parent = document.getElementById('showDateDiv5');
                        // children = parent.children[1].children[0].children[0].innerHTML
                        // console.log("element",element)
                        // parent = document.getElementById(`showDateDiv${element+ 1}`);
                        // children = parent.children[1].children[0].children[0].innerHTML
                        // console.log("children",children);
                        let checkRadioNextSelectedClassName = 'resdateradio'+nextElementValue;
                        let checkRadioNextClassName = document.getElementsByClassName('resdateradioclass'+nextElementValue);
                        let checkRadioNextSelected = $('input[name='+checkRadioNextSelectedClassName+']:checked').val();
                        console.log('checkRadioNextSelectedClassName',checkRadioNextSelectedClassName)
                        console.log('checkRadioNextSelected',checkRadioNextSelected)
                        if(checkRadioNextSelected == 'no' || (checkRadioNextClassName.length > 0 && checkRadioSelected != 'yes')){
                             nextElementValue = parseInt(nextElementValue) + 1;
                             console.log('next element inside null 1st no',nextElementValue)
                            let currentDateval = new Date(document.getElementsByClassName(`clarification_${nextElementValue}`)[0].innerText);
                            console.log('current date val ',currentDateval)
                            //if(currentDateval == '' || currentDateval == undefined || currentDateval == null){
                             
                           
                          //  }
                          let checkRadioNextSelectedClassName = 'resdateradio'+nextElementValue;
                          let checkRadioNextClassName = document.getElementsByClassName('resdateradioclass'+nextElementValue);
                          let checkRadioNextSelected = $('input[name='+checkRadioNextSelectedClassName+']:checked').val();
                         console.log('checkRadioNextSelected in 2nd no%%%',checkRadioNextSelected)
                         console.log('checkRadioNextClassName',checkRadioNextClassName.length)
                        if(checkRadioNextSelected == 'no' || (checkRadioNextClassName.length>0 && checkRadioSelected !== 'yes')){
                            nextElementValue = nextElementValue +1;
                            console.log('next element inside null 2nd no$$$',nextElementValue)
    
                            let currentDateval = new Date(document.getElementsByClassName(`clarification_${nextElementValue}`)[0].innerText);
                            console.log('current date val 2nd no',currentDateval)
                           
                        }
                            
                        }
                        console.log('next element value after 2nd',nextElementValue)
                        nextDate = new Date(document.getElementsByClassName(`clarification_${nextElementValue}`)[0].innerText);
                        console.log('nextDate',nextDate)
                        isNextDate = true;
                    }
                    
                    if (enteredDate < currentDate) {
                        day.addClass("govuk-input--error")
                        month.addClass("govuk-input--error")
                        year.addClass("govuk-input--error")
                        let errorStore;
                        
                        if(lotId != '' && agreementId != '' && agreementId == 'RM1043.8' && stageValue !=''){
                         
                         ccsZaddErrorMessage(document.getElementById(parentID), "You cannot change this date and time to be earlier than the previous step in the timeline"); 
                         errorStore = [[parentID, "You cannot change this date and time to be earlier than the previous step in the timeline"]]
                        }else{
                            ccsZaddErrorMessage(document.getElementById(parentID), "You cannot set a date and time that is earlier than the next milestone in the timeline14"); 
							 errorStore = [[parentID, "You cannot set a date and time that is earlier than the next milestone in the timeline14"]]
                        }
            
                        ccsZPresentErrorSummary(errorStore);
                    } else if(isNextDate && (enteredDate > nextDate)){
                        day.addClass("govuk-input--error")
                        month.addClass("govuk-input--error")
                        year.addClass("govuk-input--error")
                        let errorStore;
                        if(lotId != '' && agreementId != '' && agreementId == 'RM1043.8' && stageValue !='' && stageValue == "Stage 1"){
                            if(lotId == '1'){
                                ccsZaddErrorMessage(document.getElementById(parentID), "You cannot change this date and time to be later than the next step in the timeline"); 
                                errorStore = [[parentID, "You cannot change this date and time to be later than the next step in the timeline"]]
                            }else{
                                ccsZaddErrorMessage(document.getElementById(parentID), "You cannot set a date and time that is greater than the next milestone in the timeline11"); 
                                errorStore = [[parentID, "You cannot set a date and time that is greater than the next milestone in the timeline11"]]
                            }
                        }else{
                            ccsZaddErrorMessage(document.getElementById(parentID), "You cannot set a date and time that is greater than the next milestone in the timeline"); 
                            errorStore = [[parentID, "You cannot set a date and time that is greater than the next milestone in the timeline"]]
                        }
                        ccsZPresentErrorSummary(errorStore);
                    }else {
                        document.getElementById(`ccs_rfp_response_date_form_${element}`).submit()
                    }
                }
            }
        });

        function getParentId(element) {
            let parentID = '';
            if (document.getElementById(`rfi_clarification_date_expanded_${element}`) !== null) {
                parentID = `rfi_clarification_date_expanded_${element}`;
            } else if (document.getElementById(`rfp_clarification_date_expanded_${element}`) !== null) {
                parentID = `rfp_clarification_date_expanded_${element}`;
            } else if (document.getElementById(`eoi_clarification_date_expanded_${element}`) !== null) {
                parentID = `eoi_clarification_date_expanded_${element}`;
            }
            return parentID;
        }

        function isValidDate(year, month, day) {
            month = month - 1;
            var d = new Date(year, month, day);
            if (d.getFullYear() == year && d.getMonth() == month && d.getDate() == day) {
                return true;
            }
            return false;
        }
       
    }

});


$('.save-button').on('click', (e) => {
    if(document.getElementsByClassName("clarification_1")[0] != null){
        let publication_date = new Date(document.getElementsByClassName("clarification_1")[0].innerText);
        let clarification_date = new Date(document.getElementsByClassName("clarification_2")[0].innerText);
        let deadline_publish_date = new Date(document.getElementsByClassName("clarification_3")[0].innerText);
        let deadline_supplier_date = new Date(document.getElementsByClassName("clarification_4")[0].innerText);
        let confirm_nextsteps_date = new Date(document.getElementsByClassName("clarification_5")[0].innerText);

        let isError = false;

        let selectors = [1, 2, 3, 4, 5];
        for (let element of selectors) {
            let day = $(`#clarification_date-day_${element}`);
            let month = $(`#clarification_date-month_${element}`);
            let year = $(`#clarification_date-year_${element}`);
            let hour = $(`#clarification_date-hour_${element}`);
            let minutes = $(`#clarification_date-minute_${element}`);

            if ((year.val() != undefined && year.val() != "") && (month.val() != undefined && month.val() != "") && (day.val() != undefined && day.val() != "")) {
                let inputDate = new Date(year.val(), month.val() - 1, day.val(), hour.val(), minutes.val());

                switch (element) {
                    case 1:
                        if (inputDate < publication_date) {
                            isError = true;
                        }
                        break;
                    case 2:
                        if (inputDate < clarification_date) {
                            e.preventDefault();
                            isError = true;
                        }
                        break;
                    case 3:
                        if (inputDate < deadline_publish_date) {
                            e.preventDefault();
                            isError = true;
                        }
                        break;
                    case 4:
                        if (inputDate < deadline_supplier_date) {
                            e.preventDefault();
                            isError = true;
                        }
                        break;
                    case 5:
                        if (inputDate < confirm_nextsteps_date) {
                            e.preventDefault();
                            isError = true;
                        }
                        break;
                    default:
                        isError = false;
                }
            }
        }

        if (isError) {
            $('#event-name-error-date').html('You can not set a date and time that is earlier than the previous milestone in the timeline');
            DaySelector.addClass('govuk-form-group--error');
            MonthSelector.addClass('govuk-form-group--error');
            YearSelector.addClass('govuk-form-group--error');
            $('.durations').addClass('govuk-form-group--error');
            const errorStore = [
                ["eoi_clarification_date", "You can not set a date and time that is earlier than the previous milestone in the timeline"]
            ]

            ccsZPresentErrorSummary(errorStore);
        } else {
            document.forms['ccs_eoi_response_date_form'].submit();
        }
    } else {
        // document.forms['rfp_date'].submit();
    }
});