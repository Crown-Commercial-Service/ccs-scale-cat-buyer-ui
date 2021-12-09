document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById('ccs_rfi_response_date_form') !== null) {

    // events and validations related to clarification date
    let clarification_expanded_div = document.getElementById('rfi_clarification_date_expanded');
    let clarification_div = document.getElementById('rfi_clarification_date');
    clarification_expanded_div.classList.add('ccs-dynaform-hidden');

    const clarification_day = document.getElementById("clarification_date-day"),
      clarification_month = document.getElementById("clarification_date-month"),
      clarification_year = document.getElementById("clarification_date-year"),
      clarification_hour = document.getElementById('clarification_date-hour'),
      clarification_minute = document.getElementById('clarification_date-minute'),
      clarification_timeformat = document.getElementById('clarification_date-hourFormat'),
      clarification_parent = document.getElementById('clarification_date');

    document.getElementById('change_clarification_date').addEventListener('click', (event) => {
      event.preventDefault();
      clarification_expanded_div.classList.remove('ccs-dynaform-hidden');
      clarification_div.classList.add('ccs-dynaform-hidden');
    });

    clarification_day.addEventListener('blur', (event) => {
      validateRfIDateDay(clarification_day, "clarification_date");
    });
    clarification_month.addEventListener('blur', (event) => {
      validateRfIDateMonth(clarification_month, "clarification_date");
    });
    clarification_year.addEventListener('blur', (event) => {
      validateRfIDateYear(clarification_year, "clarification_date")
    });
    clarification_day.addEventListener('keyup', (event) => {
      validateFullDate(clarification_day, clarification_month, clarification_year, "clarification_date");
    });
    clarification_month.addEventListener('keyup', (event) => {
      validateFullDate(clarification_day, clarification_month, clarification_year, "clarification_date");
    });
    clarification_year.addEventListener('keyup', (event) => {
      validateFullDate(clarification_day, clarification_month, clarification_year, "clarification_date");
    });

    document.getElementById('cancel_change_clarification_date').addEventListener('click', (event) => {
      event.preventDefault();
      clarification_expanded_div.classList.add('ccs-dynaform-hidden');
      clarification_div.classList.remove('ccs-dynaform-hidden');
      resetValuesOnCancel(clarification_day, clarification_month, clarification_year, clarification_hour, clarification_minute, clarification_timeformat, clarification_parent);
    });

    document.getElementById('save_clarification_date').addEventListener('click', (event) => {
      event.preventDefault();
      // validate the date as per ba rule, which is should be a future date
      let fieldCheck = ccsZvalidateThisDate("clarification_date", "Clarification period date must be a valid future date", 1, 0);
      if (fieldCheck !== true) {
        ccsZaddErrorMessage(document.getElementById(clarification_date), "Clarification period date must be a valid future date");
        // errorStore.push(fieldCheck);
        //  ccsZPresentErrorSummary(fieldCheck);
      }
      else {
        let clarification_day_str = clarification_day.value,
          clarification_month_str = clarification_month.value;
        //+ "T"+clarification_hour.value +":" + clarification_minute.value + ":" + "00"
        if (clarification_day_str < 10 && !clarification_day_str.match(/^0\d$/)) clarification_day_str = "0" + clarification_day_str;
        if (clarification_month_str < 10 && !clarification_month_str.match(/^0\d$/)) clarification_month_str = "0" + clarification_month_str;
        const new_date = clarification_year.value + "-" + clarification_month_str + "-" + clarification_day_str;
        // clarification_expanded_div.classList.add('ccs-dynaform-hidden');
        $.ajax({
          url: "/rfi/changeClarificationDate?date=" + new_date,
          type: "POST",
          contentType: "application/json"
        }).done(function (result) {
          clarification_div.classList.remove('ccs-dynaform-hidden');
          clarification_expanded_div.classList.add('ccs-dynaform-hidden');
          document.getElementById('lbl-clarification').innerText = result.newdate;
          document.getElementById('lbl-clarification_copy').innerText = result.newdate;
          if (result.change_all_dates === true) {
            document.getElementById('lbl-clarification-response').innerText = result.clarification_res;
            document.getElementById('lbl-res-date').innerText = result.rfi_res;
            document.getElementById('lbl-ns-date').innerText = result.nxt_steps;
            document.getElementById('lbl-clarification-response_copy').innerText = result.clarification_res;
            document.getElementById('lbl-res-date_copy').innerText = result.rfi_res;
            document.getElementById('lbl-ns-date_copy').innerText = result.nxt_steps;
          }
          resetValuesOnCancel(clarification_day, clarification_month, clarification_year, clarification_hour, clarification_minute, clarification_timeformat, clarification_parent);
        });
      }
    });

    // events and validations related to clarification response date

    let clarification_response_expanded_div = document.getElementById('rfi_clarification_response_date_expanded');
    let clarification_response_div = document.getElementById('rfi_clarification_response_date');
    clarification_response_expanded_div.classList.add('ccs-dynaform-hidden');

    const clarification_response_day = document.getElementById("clarification_response_date-day"),
      clarification_response_month = document.getElementById("clarification_response_date-month"),
      clarification_response_year = document.getElementById("clarification_response_date-year"),
      clarification_res_hour = document.getElementById("clarification_response_date-hour"),
      clarification_res_min = document.getElementById("clarification_response_date-minute"),
      clarification_res_timeformat = document.getElementById("clarification_response_date-hourFormat"),
      calarification_res_parent = document.getElementById("clarification_response_date");

    document.getElementById('change_clarification_response_date').addEventListener('click', (event) => {
      event.preventDefault();
      clarification_response_expanded_div.classList.remove('ccs-dynaform-hidden');
      clarification_response_div.classList.add('ccs-dynaform-hidden');
    });

    document.getElementById('cancel_clarification_response_date').addEventListener('click', (event) => {
      event.preventDefault();
      clarification_response_expanded_div.classList.add('ccs-dynaform-hidden');
      clarification_response_div.classList.remove('ccs-dynaform-hidden');
      resetValuesOnCancel(clarification_response_day, clarification_response_month, clarification_response_year, clarification_res_hour, clarification_res_min, clarification_res_timeformat, calarification_res_parent);
    });



    clarification_response_day.addEventListener('blur', (event) => {
      validateRfIDateDay(clarification_response_day, "clarification_response_date");
    });
    clarification_response_month.addEventListener('blur', (event) => {
      validateRfIDateMonth(clarification_response_month, "clarification_response_date");
    });
    clarification_response_year.addEventListener('blur', (event) => {
      validateRfIDateYear(clarification_response_year, "clarification_response_date")
    });
    clarification_response_day.addEventListener('keyup', (event) => {
      validateFullDate(clarification_response_day, clarification_response_month, clarification_response_year, "clarification_response_date");
    });
    clarification_response_month.addEventListener('keyup', (event) => {
      validateFullDate(clarification_response_day, clarification_response_month, clarification_response_year, "clarification_response_date");
    });
    clarification_response_year.addEventListener('keyup', (event) => {
      validateFullDate(clarification_response_day, clarification_response_month, clarification_response_year, "clarification_response_date");
    });

    document.getElementById('save_clarification_response_date').addEventListener('click', (event) => {
      event.preventDefault();

      const clarification_res_date = getDateStringFromElementNames(clarification_response_day, clarification_response_month, clarification_response_year);
      // clarification_expanded_div.classList.add('ccs-dynaform-hidden');
      $.ajax({
        url: "/rfi/clarification-response?date=" + clarification_res_date,
        type: "POST",
        contentType: "application/json"
      }).done(function (result) {
        if (result.error === true) {
          ccsZaddErrorMessage(calarification_res_parent, result.err_msg);
          return;
        }
        else {
          clarification_response_div.classList.remove('ccs-dynaform-hidden');
          clarification_response_expanded_div.classList.add('ccs-dynaform-hidden');
          document.getElementById('lbl-clarification-response').innerText = result.newdate;
          document.getElementById('lbl-clarification-response_copy').innerText = result.newdate;
          if (result.change_all_dates === true) {
            document.getElementById('lbl-res-date').innerText = result.rfi_res;
            document.getElementById('lbl-ns-date').innerText = result.nxt_steps;
            document.getElementById('lbl-res-date_copy').innerText = result.rfi_res;
            document.getElementById('lbl-ns-date_copy').innerText = result.nxt_steps;
          }
          resetValuesOnCancel(clarification_response_day, clarification_response_month, clarification_response_year, clarification_res_hour, clarification_res_min, clarification_res_timeformat, calarification_res_parent);
        }
      });
    });

    // 4  events and validations related to rfi response date

    let rfi_response_expanded_div = document.getElementById('rfi_response_date_expanded');
    let rfi_response_div = document.getElementById('rfi_response_date');
    rfi_response_expanded_div.classList.add('ccs-dynaform-hidden');

    const response_day = document.getElementById("response_date-day"),
      response_month = document.getElementById("response_date-month"),
      response_year = document.getElementById("response_date-year"),
      response_hour = document.getElementById("response_date-hour"),
      response_minutes = document.getElementById("response_date-minute"),
      response_timeformat = document.getElementById("response_date-hourFormat"),
      response_parent = document.getElementById("response_date");

    document.getElementById('change_rfi_response_date').addEventListener('click', (event) => {
      event.preventDefault();
      rfi_response_expanded_div.classList.remove('ccs-dynaform-hidden');
      rfi_response_div.classList.add('ccs-dynaform-hidden');
    });

    document.getElementById('cancel_rfi_response_date').addEventListener('click', (event) => {
      event.preventDefault();
      rfi_response_expanded_div.classList.add('ccs-dynaform-hidden');
      rfi_response_div.classList.remove('ccs-dynaform-hidden');
      resetValuesOnCancel(response_day, response_month, response_year, response_hour, response_minutes, response_timeformat, response_parent);

    });

    response_day.addEventListener('blur', (event) => {
      validateRfIDateDay(response_day, "response_date");
    });
    response_month.addEventListener('blur', (event) => {
      validateRfIDateMonth(response_month, "response_date");
    });
    response_year.addEventListener('blur', (event) => {
      validateRfIDateYear(response_year, "response_date")
    });
    response_day.addEventListener('keyup', (event) => {
      validateFullDate(response_day, response_month, response_year, "response_date");
    });
    response_month.addEventListener('keyup', (event) => {
      validateFullDate(response_day, response_month, response_year, "response_date");
    });
    response_year.addEventListener('keyup', (event) => {
      validateFullDate(response_day, response_month, response_year, "response_date");
    });

    document.getElementById('save_response_date').addEventListener('click', (event) => {
      event.preventDefault();
      const res_date = getDateStringFromElementNames(response_day, response_month, response_year);
      $.ajax({
        url: "/rfi/change-response-date?date=" + res_date,
        type: "POST",
        contentType: "application/json"
      }).done(function (result) {
        if (result.error === true) {
          ccsZaddErrorMessage(document.getElementById('response_date'), result.error_msg);
          return;
        }
        else {
          rfi_response_div.classList.remove('ccs-dynaform-hidden');
          rfi_response_expanded_div.classList.add('ccs-dynaform-hidden');
          document.getElementById('lbl-res-date').innerText = result.newdate;
          document.getElementById('lbl-res-date_copy').innerText = result.newdate;
          if (result.change_all_dates === true) {
            document.getElementById('lbl-ns-date').innerText = result.nxt_steps;
            document.getElementById('lbl-ns-date_copy').innerText = result.nxt_steps;
          }
          resetValuesOnCancel(response_day, response_month, response_year, response_hour, response_minutes, response_timeformat, response_parent);
        }
      });
    });

    // 5 events related to next-steps date

    let ns_expanded_div = document.getElementById('rfi_next_steps_expanded');
    let ns_div = document.getElementById('rfi_next_steps_date');
    ns_expanded_div.classList.add('ccs-dynaform-hidden');

    const ns_day = document.getElementById("next_steps_date-day"),
      ns_month = document.getElementById("next_steps_date-month"),
      ns_year = document.getElementById("next_steps_date-year"),
      ns_hour = document.getElementById("next_steps-hour"),
      ns_minute = document.getElementById("next_steps-minute"),
      ns_timeformat = document.getElementById("next_steps-hourFormat"),
      ns_parent = document.getElementById("next_steps_date");

    document.getElementById('change_next_steps_date').addEventListener('click', (event) => {
      event.preventDefault();
      ns_expanded_div.classList.remove('ccs-dynaform-hidden');
      ns_div.classList.add('ccs-dynaform-hidden');
    });

    document.getElementById('cancel_next_steps_date').addEventListener('click', (event) => {
      event.preventDefault();
      ns_expanded_div.classList.add('ccs-dynaform-hidden');
      ns_div.classList.remove('ccs-dynaform-hidden');
      resetValuesOnCancel(ns_day, ns_month, ns_year, ns_hour, ns_minute, ns_timeformat, ns_parent);
    });

    ns_day.addEventListener('blur', (event) => {
      validateRfIDateDay(ns_day, "next_steps_date");
    });
    ns_month.addEventListener('blur', (event) => {
      validateRfIDateMonth(ns_month, "next_steps_date");
    });
    ns_year.addEventListener('blur', (event) => {
      validateRfIDateYear(ns_year, "next_steps_date")
    });
    ns_day.addEventListener('keyup', (event) => {
      validateFullDate(ns_day, ns_month, ns_year, "next_steps_date");
    });
    ns_month.addEventListener('keyup', (event) => {
      validateFullDate(ns_day, ns_month, ns_year, "next_steps_date");
    });
    ns_year.addEventListener('keyup', (event) => {
      validateFullDate(ns_day, ns_month, ns_year, "next_steps_date");
    });

    document.getElementById('save_next_step_date').addEventListener('click', (event) => {
      event.preventDefault();
      const ns_date = getDateStringFromElementNames(ns_day, ns_month, ns_year);
      $.ajax({
        url: "/rfi/change-nextsteps-date?date=" + ns_date,
        type: "POST",
        contentType: "application/json"
      }).done(function (result) {
        if (result.error === true) {
          ccsZaddErrorMessage(document.getElementById('next_steps_date'), result.err_msg);
          return;
        }
        else {
          ns_div.classList.remove('ccs-dynaform-hidden');
          ns_expanded_div.classList.add('ccs-dynaform-hidden');
          document.getElementById('lbl-ns-date').innerText = result.newdate;
          document.getElementById('lbl-ns-date_copy').innerText  = result.newdate;
          resetValuesOnCancel(ns_day, ns_month, ns_year, ns_hour, ns_minute, ns_timeformat, ns_parent);
        }
      });
    });

  }

  // if (document.getElementById("ccs_rfi_dates_form") !== null) {

  //   const start_day = document.getElementById("rfi_proj_start_date-day"),
  //     start_month = document.getElementById("rfi_proj_start_date-month"),
  //     start_year = document.getElementById("rfi_proj_start_date-year"),
  //     duration_num = document.getElementById("rfi_proj_duration_number"),
  //     duration_units = document.getElementById("rfi_proj_duration_units"),
  //     end_day = document.getElementById("rfi_proj_end_date-day"),
  //     end_month = document.getElementById("rfi_proj_end_date-month"),
  //     end_year = document.getElementById("rfi_proj_end_date-year");

  //   start_day.addEventListener('keyup', (event) => {
  //     setRfIEndDate(start_day, start_month, start_year, duration_num, duration_units, end_day, end_month, end_year);
  //   });

  //   start_day.addEventListener('blur', (event) => {
  //     validateRfIDateDay(start_day, "rfi_proj_start_date");
  //   });

  //   start_month.addEventListener('keyup', (event) => {
  //     setRfIEndDate(start_day, start_month, start_year, duration_num, duration_units, end_day, end_month, end_year);
  //   });

  //   start_month.addEventListener('blur', (event) => {
  //     validateRfIDateMonth(start_month, "rfi_proj_start_date");
  //   });

  //   start_year.addEventListener('keyup', (event) => {
  //     setRfIEndDate(start_day, start_month, start_year, duration_num, duration_units, end_day, end_month, end_year);
  //   });

  //   start_year.addEventListener('blur', (event) => {
  //     validateRfIDateYear(start_year, "rfi_proj_start_date");
  //   });

  //   duration_num.addEventListener('keyup', (event) => {
  //     setRfIEndDate(start_day, start_month, start_year, duration_num, duration_units, end_day, end_month, end_year);
  //   });

  //   duration_units.addEventListener('change', (event) => {
  //     setRfIEndDate(start_day, start_month, start_year, duration_num, duration_units, end_day, end_month, end_year);
  //   });




  //   end_day.addEventListener('keyup', (event) => {
  //     setRfIDuration(start_day, start_month, start_year, duration_num, duration_units, end_day, end_month, end_year);
  //   });

  //   end_day.addEventListener('blur', (event) => {
  //     validateRfIDateDay(end_day, "rfi_proj_end_date");
  //   });

  //   end_month.addEventListener('keyup', (event) => {
  //     setRfIDuration(start_day, start_month, start_year, duration_num, duration_units, end_day, end_month, end_year);
  //   });

  //   end_month.addEventListener('blur', (event) => {
  //     validateRfIDateMonth(end_month, "rfi_proj_end_date");
  //   });

  //   end_year.addEventListener('keyup', (event) => {
  //     setRfIDuration(start_day, start_month, start_year, duration_num, duration_units, end_day, end_month, end_year);
  //   });

  //   end_year.addEventListener('blur', (event) => {
  //     validateRfIDateYear(end_year, "rfi_proj_end_date");
  //   });

  // }

  // const setRfIDuration = (start_day, start_month, start_year, duration_num, duration_units, end_day, end_month, end_year) => {
  //  // console.log("setting a duration");
  //   // we're only going to do something if we have two complete dates
  //   if (end_day.value.match(/^\d\d?$/) &&
  //       end_month.value.match(/^\d\d?$/) &&
  //       end_year.value.match(/^\d{4}$/) &&
  //       start_day.value.match(/^\d\d?$/) &&
  //       start_month.value.match(/^\d\d?$/) &&
  //       start_year.value.match(/^\d{4}$/)) {

  //     //console.log("get months");
  //     let end_day_str = end_day.value,
  //       end_month_str = end_month.value,
  //       start_day_str = start_day.value,
  //       start_month_str = start_month.value,
  //       duration_millis = 0,
  //       days_rem = 0,
  //       weeks_rem = 0,
  //       months_rem = 0;

  //     if (end_day_str < 10 && !end_day_str.match(/^0\d$/)) end_day_str = "0" + end_day_str;
  //     if (end_month_str < 10 && !end_month_str.match(/^0\d$/)) end_month_str = "0" + end_month_str;
  //     if (start_day_str < 10 && !start_day_str.match(/^0\d$/)) start_day_str = "0" + start_day_str;
  //     if (start_month_str < 10 && !start_month_str.match(/^0\d$/)) start_month_str = "0" + start_month_str;

  //     const end_date = new Date(end_year.value + "-" + end_month_str + "-" + end_day_str + "T11:00:00").getTime(),
  //       start_date = new Date(start_year.value + "-" + start_month_str + "-" + start_day_str + "T11:00:00").getTime();

  //     if (Number.isNaN(end_date) && Number.isNaN(start_date)) {
  //       ccsZaddErrorMessage(document.getElementById("rfi_proj_end_date"), "Enter a valid date");
  //       ccsZaddErrorMessage(document.getElementById("rfi_proj_start_date"), "Enter a valid date");
  //     } else if (Number.isNaN(start_date)) {
  //       ccsZaddErrorMessage(document.getElementById("rfi_proj_start_date"), "Enter a valid date");
  //     } else if (Number.isNaN(end_date)) {
  //       ccsZaddErrorMessage(document.getElementById("rfi_proj_end_date"), "Enter a valid date");
  //     } else {
  //       ccsZremoveErrorMessage(document.getElementById("rfi_proj_start_date"));
  //       ccsZremoveErrorMessage(document.getElementById("rfi_proj_end_date"));

  //       duration_millis = end_date - start_date;
  //       days_rem =   duration_millis % 86400000;
  //       weeks_rem =  duration_millis % 604800000;
  //       months_rem = duration_millis % 2629800000;


  //       if (months_rem === 0) {
  //         duration_num.value = Math.floor(duration_millis / 2629800000);
  //         duration_units.value = "months";
  //       } else if (weeks_rem === 0) {
  //         let week_count = Math.floor(duration_millis / 604800000);

  //         if (week_count === 52) {
  //           duration_num.value = 12;
  //           duration_units.value = "months";
  //         } else {
  //           duration_num.value = week_count;
  //           duration_units.value = "weeks";
  //         }

  //       } else {

  //         let day_count = Math.floor(duration_millis / 86400000);

  //         if (day_count === 365) {
  //           duration_num.value = 12;
  //           duration_units.value = "months";
  //         } else if (day_count % 7 === 0) {
  //           duration_num.value = day_count / 7;
  //           duration_units.value = "weeks";
  //         } else {
  //           duration_num.value = Math.floor(duration_millis / 86400000);
  //           duration_units.value = "days";
  //         }
  //       }
  //     }
  //   }
  // };

  // const setRfIEndDate = (start_day, start_month, start_year, duration_num, duration_units, end_day, end_month, end_year) => {

  //   // we're only going to do something if we have a real mumber and a complete date
  //   if (duration_num.value.match(/^\d{1,}/) &&
  //       start_day.value.match(/^\d\d?$/) &&
  //       start_month.value.match(/^\d\d?$/) &&
  //       start_year.value.match(/^\d{4}$/)) {

  //     let start_day_str = start_day.value,
  //       start_month_str = start_month.value;

  //     if (start_day_str < 10 && !start_day_str.match(/^0\d$/)) start_day_str = "0" + start_day_str;
  //     if (start_month_str < 10 && !start_month_str.match(/^0\d$/)) start_month_str = "0" + start_month_str;

  //     const start_date = new Date(start_year.value + "-" + start_month_str + "-" + start_day_str + "T11:00:00").getTime();

  //     if (Number.isNaN(start_date)) {
  //       ccsZaddErrorMessage(document.getElementById("rfi_proj_start_date"), "Enter a valid date");
  //     } else {
  //       ccsZremoveErrorMessage(document.getElementById("rfi_proj_start_date"));
  //       let multiplier = 0,
  //         new_end_date_secs = 0;

  //       if (duration_units.value === "days") multiplier = 86400000;
  //       else if (duration_units.value === "weeks") multiplier = 604800000;
  //       else multiplier = 2629800000;

  //       new_end_date_secs = (duration_num.value * multiplier) + start_date;

  //       var new_end_date = new Date(new_end_date_secs);

  //       end_day.value = new_end_date.getDate();
  //       end_month.value = new_end_date.getMonth() + 1;
  //       end_year.value = new_end_date.getFullYear();
  //     }

  //   }
  // };

  const validateFullDate = (start_day, start_month, start_year, parent_id) => {
    if (start_day.value.match(/^\d\d?$/) &&
      start_month.value.match(/^\d\d?$/) &&
      start_year.value.match(/^\d{4}$/)) {
      let start_day_str = start_day.value,
        start_month_str = start_month.value;

      if (start_day_str < 10 && !start_day_str.match(/^0\d$/)) start_day_str = "0" + start_day_str;
      if (start_month_str < 10 && !start_month_str.match(/^0\d$/)) start_month_str = "0" + start_month_str;
      const start_date = new Date(start_year.value + "-" + start_month_str + "-" + start_day_str + "T11:00:00").getTime();

      if (Number.isNaN(start_date)) {
        ccsZaddErrorMessage(document.getElementById(parent_id), "Enter a valid date");
      } else {
        ccsZremoveErrorMessage(document.getElementById(parent_id));
      }
    }
  }

  const resetValuesOnCancel = (day, month, year, hour, time, hourFormat, parent) => {
    day.value = "";
    month.value = "";
    year.value = "";
    hour.value = "";
    time.value = "";
    hourFormat.value = "";
    ccsZremoveErrorMessage(parent);
  }

  const validateRfIDateDay = (start_day, parent_id) => {

    if (!start_day.value.match(/^\d\d?$/) || start_day.value > 31 || start_day.value < 1) {
      start_day.classList.add("govuk-input--error");
      ccsZaddErrorMessage(document.getElementById(parent_id), "Enter a valid day");
    } else {
      start_day.classList.remove("govuk-input--error");
      ccsZremoveErrorMessage(document.getElementById(parent_id));
    }
  };

  const validateRfIDateMonth = (start_month, parent_id) => {

    if (!start_month.value.match(/^\d\d?$/) || start_month.value > 12 || start_month.value < 1) {
      start_month.classList.add("govuk-input--error");
      ccsZaddErrorMessage(document.getElementById(parent_id), "Enter a valid month");
    } else {
      start_month.classList.remove("govuk-input--error");
      ccsZremoveErrorMessage(document.getElementById(parent_id));
    }
  };

  const validateRfIDateYear = (start_year, parent_id) => {

    if (!start_year.value.match(/^\d{4}$/) || start_year.value > 2121 || start_year.value < 2021) {
      start_year.classList.add("govuk-input--error");
      ccsZaddErrorMessage(document.getElementById(parent_id), "Enter a valid year");
    } else {
      start_year.classList.remove("govuk-input--error");
      ccsZremoveErrorMessage(document.getElementById(parent_id));
    }
  };

});
function getDateStringFromElementNames(clarification_day, clarification_month, clarification_year) {
  let clarification_day_str = clarification_day.value, clarification_month_str = clarification_month.value;
  //+ "T"+clarification_hour.value +":" + clarification_minute.value + ":" + "00"
  if (clarification_day_str < 10 && !clarification_day_str.match(/^0\d$/))
    clarification_day_str = "0" + clarification_day_str;
  if (clarification_month_str < 10 && !clarification_month_str.match(/^0\d$/))
    clarification_month_str = "0" + clarification_month_str;
  const new_date = clarification_year.value + "-" + clarification_month_str + "-" + clarification_day_str;
  return new_date;
}

