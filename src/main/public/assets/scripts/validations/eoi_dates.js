document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("ccs_eoi_dates_form") !== null) {

    const start_day = document.getElementById("eoi_proj_start_date-day"),
      start_month = document.getElementById("eoi_proj_start_date-month"),
      start_year = document.getElementById("eoi_proj_start_date-year"),
      duration_num = document.getElementById("eoi_proj_duration_number"),
      duration_units = document.getElementById("eoi_proj_duration_units"),
      end_day = document.getElementById("eoi_proj_end_date-day"),
      end_month = document.getElementById("eoi_proj_end_date-month"),
      end_year = document.getElementById("eoi_proj_end_date-year");

    start_day.addEventListener('keyup', (event) => {
      setRfIEndDate(start_day, start_month, start_year, duration_num, duration_units, end_day, end_month, end_year);
    });

    start_day.addEventListener('blur', (event) => {
      validateRfIDateDay(start_day, "eoi_proj_start_date");
    });

    start_month.addEventListener('keyup', (event) => {
      setRfIEndDate(start_day, start_month, start_year, duration_num, duration_units, end_day, end_month, end_year);
    });

    start_month.addEventListener('blur', (event) => {
      validateRfIDateMonth(start_month, "eoi_proj_start_date");
    });

    start_year.addEventListener('keyup', (event) => {
      setRfIEndDate(start_day, start_month, start_year, duration_num, duration_units, end_day, end_month, end_year);
    });

    start_year.addEventListener('blur', (event) => {
      validateRfIDateYear(start_year, "eoi_proj_start_date");
    });

    duration_num.addEventListener('keyup', (event) => {
      setRfIEndDate(start_day, start_month, start_year, duration_num, duration_units, end_day, end_month, end_year);
    });

    duration_units.addEventListener('change', (event) => {
      setRfIEndDate(start_day, start_month, start_year, duration_num, duration_units, end_day, end_month, end_year);
    });




    end_day.addEventListener('keyup', (event) => {
      setRfIDuration(start_day, start_month, start_year, duration_num, duration_units, end_day, end_month, end_year);
    });

    end_day.addEventListener('blur', (event) => {
      validateRfIDateDay(end_day, "eoi_proj_end_date");
    });

    end_month.addEventListener('keyup', (event) => {
      setRfIDuration(start_day, start_month, start_year, duration_num, duration_units, end_day, end_month, end_year);
    });

    end_month.addEventListener('blur', (event) => {
      validateRfIDateMonth(end_month, "eoi_proj_end_date");
    });

    end_year.addEventListener('keyup', (event) => {
      setRfIDuration(start_day, start_month, start_year, duration_num, duration_units, end_day, end_month, end_year);
    });

    end_year.addEventListener('blur', (event) => {
      validateRfIDateYear(end_year, "eoi_proj_end_date");
    });

  }

  const setRfIDuration = (start_day, start_month, start_year, duration_num, duration_units, end_day, end_month, end_year) => {
    // console.log("setting a duration");
    // we're only going to do something if we have two complete dates
    if (end_day.value.match(/^\d\d?$/) &&
      end_month.value.match(/^\d\d?$/) &&
      end_year.value.match(/^\d{4}$/) &&
      start_day.value.match(/^\d\d?$/) &&
      start_month.value.match(/^\d\d?$/) &&
      start_year.value.match(/^\d{4}$/)) {

      //console.log("get months");
      let end_day_str = end_day.value,
        end_month_str = end_month.value,
        start_day_str = start_day.value,
        start_month_str = start_month.value,
        duration_millis = 0,
        days_rem = 0,
        weeks_rem = 0,
        months_rem = 0;

      if (end_day_str < 10 && !end_day_str.match(/^0\d$/)) end_day_str = "0" + end_day_str;
      if (end_month_str < 10 && !end_month_str.match(/^0\d$/)) end_month_str = "0" + end_month_str;
      if (start_day_str < 10 && !start_day_str.match(/^0\d$/)) start_day_str = "0" + start_day_str;
      if (start_month_str < 10 && !start_month_str.match(/^0\d$/)) start_month_str = "0" + start_month_str;

      const end_date = new Date(end_year.value + "-" + end_month_str + "-" + end_day_str + "T11:00:00").getTime(),
        start_date = new Date(start_year.value + "-" + start_month_str + "-" + start_day_str + "T11:00:00").getTime();

      if (Number.isNaN(end_date) && Number.isNaN(start_date)) {
        ccsZaddErrorMessage(document.getElementById("eoi_proj_end_date"), "Enter a valid date");
        ccsZaddErrorMessage(document.getElementById("eoi_proj_start_date"), "Enter a valid date");
      } else if (Number.isNaN(start_date)) {
        ccsZaddErrorMessage(document.getElementById("eoi_proj_start_date"), "Enter a valid date");
      } else if (Number.isNaN(end_date)) {
        ccsZaddErrorMessage(document.getElementById("eoi_proj_end_date"), "Enter a valid date");
      } else {
        ccsZremoveErrorMessage(document.getElementById("eoi_proj_start_date"));
        ccsZremoveErrorMessage(document.getElementById("eoi_proj_end_date"));

        duration_millis = end_date - start_date;
        days_rem = duration_millis % 86400000;
        weeks_rem = duration_millis % 604800000;
        months_rem = duration_millis % 2629800000;


        if (months_rem === 0) {
          duration_num.value = Math.floor(duration_millis / 2629800000);
          duration_units.value = "months";
        } else if (weeks_rem === 0) {
          let week_count = Math.floor(duration_millis / 604800000);

          if (week_count === 52) {
            duration_num.value = 12;
            duration_units.value = "months";
          } else {
            duration_num.value = week_count;
            duration_units.value = "weeks";
          }

        } else {

          let day_count = Math.floor(duration_millis / 86400000);

          if (day_count === 365) {
            duration_num.value = 12;
            duration_units.value = "months";
          } else if (day_count % 7 === 0) {
            duration_num.value = day_count / 7;
            duration_units.value = "weeks";
          } else {
            duration_num.value = Math.floor(duration_millis / 86400000);
            duration_units.value = "days";
          }
        }
      }
    }
  };

  const setRfIEndDate = (start_day, start_month, start_year, duration_num, duration_units, end_day, end_month, end_year) => {

    // we're only going to do something if we have a real mumber and a complete date
    if (duration_num.value.match(/^\d{1,}/) &&
      start_day.value.match(/^\d\d?$/) &&
      start_month.value.match(/^\d\d?$/) &&
      start_year.value.match(/^\d{4}$/)) {

      let start_day_str = start_day.value,
        start_month_str = start_month.value;

      if (start_day_str < 10 && !start_day_str.match(/^0\d$/)) start_day_str = "0" + start_day_str;
      if (start_month_str < 10 && !start_month_str.match(/^0\d$/)) start_month_str = "0" + start_month_str;

      const start_date = new Date(start_year.value + "-" + start_month_str + "-" + start_day_str + "T11:00:00").getTime();

      if (Number.isNaN(start_date)) {
        ccsZaddErrorMessage(document.getElementById("eoi_proj_start_date"), "Enter a valid date");
      } else {
        ccsZremoveErrorMessage(document.getElementById("eoi_proj_start_date"));
        let multiplier = 0,
          new_end_date_secs = 0;

        if (duration_units.value === "days") multiplier = 86400000;
        else if (duration_units.value === "weeks") multiplier = 604800000;
        else multiplier = 2629800000;

        new_end_date_secs = (duration_num.value * multiplier) + start_date;

        var new_end_date = new Date(new_end_date_secs);

        end_day.value = new_end_date.getDate();
        end_month.value = new_end_date.getMonth() + 1;
        end_year.value = new_end_date.getFullYear();
      }

    }

    // else if (duration_num.value.match(/^\d{1,}/)) {
    //   ccsZremoveErrorMessage(document.getElementById("eoi_proj_duration"));
    // } else if (!duration_num.value.match(/^\d{1,}/) || duration_num.value !== "") {
    //   ccsZaddErrorMessage(document.getElementById("eoi_proj_duration"), "Enter a whole number");
    // }
  };

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
