document.addEventListener('DOMContentLoaded', () => {

  if ($('#ccs_ca_weighting').length > 0 || $('#ccs_daa_weighting').length > 0 || $('#ca_where_work_done').length > 0) {
    var total = 0;
    var dimensions = $(".dimensions");
    updateTotal(dimensions);
    dimensions.on("blur", () => {
      updateTotal(dimensions);
    });
  }
});

const updateTotal = dimensions => {
  let total = 0;
  dimensions.each(function () {
    if (!isNaN($(this).val())) total = total + Number($(this).val());
  });
  $('#totalPercentage').text(total);
};

const ccsZvalidateCAWeightings = event => {
  event.preventDefault();
  document.forms['ccs_ca_weighting'].submit();
};

const ccsZvalidateDAAWeightings = event => {
  event.preventDefault();

  document.forms['ccs_daa_weighting'].submit();

};

