document.addEventListener('DOMContentLoaded', () => {

  if ($('#ca_where_work_done').length > 0 || $('#da_where_work_done').length > 0) {
    var total = 0;
    var dimensions = $(".dimensions");
    updateLocationTotal(dimensions);
    dimensions.on("blur", () => {
      updateLocationTotal(dimensions);
    });
  }
});

const updateLocationTotal = dimensions => {
  let total = 0;
  dimensions.each(function () {
    if (!isNaN($(this).val())) total = total + Number($(this).val());
  });
  $('#totalPercentage').text(total);
};


const ccsZvalidateDAWhereWorkDone = event => {
  event.preventDefault();
  var dimensions = $('.dimensions');
  let fieldCheck = '',
    errorStore = [],
    total = 0;
  dimensions.each(function () {
    var element = document.getElementById($(this).attr('id'));
    ccsZremoveErrorMessage(element);
    let errMsg = '';
    if (element.value === '') errMsg = 'All entry boxes must contain a value';
    else if (isNaN($(this).val()) || element.value.includes('.')) errMsg = 'Dimension value entered must be an integer';
    else if (
      (Number(element.value) < Number($(this).attr('min')) && Number($(this).attr('min')) !== 0) ||
      (Number(element.value) > Number($(this).attr('max')) && Number($(this).attr('max')) !== 0)
    )
      errMsg = 'Dimension value entered is outside the permitted range';
    else total += Number(element.value);
    if (errMsg !== '') {
      ccsZaddErrorMessage(element, errMsg);
      fieldCheck = [$(this).attr('id'), errMsg];
      errorStore.push(fieldCheck);
    }
  });
  if (total !== 100) {
    fieldCheck = ['totalPercentage', 'Dimension value entered does not total to 100%'];
    errorStore.push(fieldCheck);
  }
  if (errorStore.length === 0) document.forms['da_where_work_done'].submit();
  else ccsZPresentErrorSummary(errorStore);
};


const ccsZvalidateCAWhereWorkDone = (event) => {
  event.preventDefault();
  var dimensions = $(".dimensions")
  let fieldCheck = "",
    errorStore = [], total = 0;
  dimensions.each(function () {
    var element = document.getElementById($(this).attr('id'));
    ccsZremoveErrorMessage(element)
    let errMsg = "";
    if (element.value === '')
      errMsg = "Entry box must contain a value"
    else if (isNaN($(this).val()))
      errMsg = "Dimension value entered must be an integer"
    else if ((Number(element.value) < Number($(this).attr('min')) && Number($(this).attr('min')) !== 0) || (Number(element.value) > Number($(this).attr('max')) && Number($(this).attr('max')) !== 0))
      errMsg = "Dimension value entered is outside the permitted range"
    else
      total += Number(element.value);
    if (errMsg !== "") {
      ccsZaddErrorMessage(element, errMsg);
      fieldCheck = [$(this).attr('id'), errMsg]
      errorStore.push(fieldCheck);
    }
  });
  if (total !== 100) {
    fieldCheck = ["totalPercentage", "Dimension value entered does not total to 100%"]
    errorStore.push(fieldCheck);
  }
  if (errorStore.length === 0) document.forms["ca_where_work_done"].submit();
  else ccsZPresentErrorSummary(errorStore);
};
