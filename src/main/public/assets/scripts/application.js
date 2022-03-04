/* global $ */

// Dashboard pagination starts
$(document).ready(function () {
  $('#active-data').after('<div class="ccs-pagination" id="nav"><p class="govuk-visually-hidden" aria-labelledby="pagination-label">Pagination navigation</p></div>');
  var rowsShown = 5;
  var rowsTotal = $('#active-data tbody tr').length;
  var numPages = rowsTotal / rowsShown;
  var pageNum = 0;
  $('#nav').append('<a id="active-data-previous" rel="0" class="ccs-pagination__link" href="#">Previous<span class="govuk-visually-hidden"> set of pages</span></a>');
  for (i = 0; i < numPages; i++) {
    pageNum = i + 1;
    $('#nav').append('<a class="ccs-pagination__link" id="pageId_'+i+'" href="#" rel="' + i + '">' + pageNum + '</a> ');
  }
  $('#nav').append('<a id="active-data-next" rel="1" class="ccs-pagination__link" href="#">Next<span class="govuk-visually-hidden"> set of pages</span></a>');
  $('#active-data-previous').addClass("govuk-visually-hidden");
  $('#nav').append('<span class="govuk-visually-hidden" id="total_page_active_event">' + pageNum + '</span> ');

  $('#nav').append('<p class="ccs-pagination__results">Showing <b><label id="start_count">1</label></b> to <b><label id="end_count">' + rowsShown + '</label></b> of <b><label id="total_count">' + rowsTotal + '</label></b> results</p>');
  $('#active-data tbody tr').hide();
  $('#active-data tbody tr').slice(0, rowsShown).show();
  $('#nav a:nth-child(3)').addClass('ccs-pagination__item--active');
  $('#nav a').bind('click', function () {
    var currPage = $(this).attr('rel');
    var activePage = "#pageId_"+currPage;
    $('#nav a').removeClass('ccs-pagination__item--active');
    $(activePage).addClass('ccs-pagination__item--active');
    
    if (currPage != 0) {
      $("#active-data-previous").attr('rel', parseInt(currPage) - 1);
      $('#active-data-previous').removeClass("govuk-visually-hidden");
    } else {
      $('#active-data-previous').addClass("govuk-visually-hidden");
    }

    if (parseInt($('#total_page_active_event')[0].innerHTML) - parseInt(currPage) != 1) {
      $("#active-data-next").attr('rel', parseInt(currPage)+1);
      $('#active-data-next').removeClass("govuk-visually-hidden");
    } else {
      $('#active-data-next').addClass("govuk-visually-hidden");
      $("#active-data-next").attr('rel', parseInt(currPage)+1);
    }

    var startItem = currPage * rowsShown;
    var endItem = startItem + rowsShown;

    document.getElementById('start_count').innerHTML = startItem + 1;
    if (document.getElementById('total_count').innerHTML < endItem) {
      document.getElementById('end_count').innerHTML = document.getElementById('total_count').innerHTML;
    } else {
      document.getElementById('end_count').innerHTML = endItem;
    }

    $('#active-data tbody tr').css('opacity', '0.0').hide().slice(startItem, endItem).
      css('display', 'table-row').animate({ opacity: 1 }, 300);
    return false;
  });
});
// Dashboard pagination ends

$(document).ready(function () {
  window.GOVUKFrontend.initAll();

  // Read the CSRF token from the <meta> tag
  var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
  $.ajaxSetup({
    beforeSend: function (xhr) {
      xhr.setRequestHeader('CSRF-Token', token);
    }
  });

  if (matchMedia) {
    const mq = window.matchMedia("(min-width: 40.0625em)");
    mq.addListener(WidthChange);
    WidthChange(mq);
  }

  // media query change
  function WidthChange(mq) {
    if (mq.matches) {
      document.querySelector('.global-navigation').setAttribute('aria-hidden', 'false');
    } else {
      document.querySelector('.global-navigation').setAttribute('aria-hidden', 'true');
    }
  }

  document.querySelector('.global-navigation__toggler').addEventListener('click', () => {
    var is_hidden = document.querySelector('.global-navigation').getAttribute('aria-hidden');
    var new_val = "true";
    if (is_hidden == "true") new_val = "false";
    document.querySelector('.global-navigation').setAttribute('aria-hidden', new_val);
  });
});
const ccsZvalidateRfiLocation = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZisOptionChecked("required_locations", "You must select at least one region where your staff will be working, or  the “No specific location....");
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["rfi_location"].submit();
  else ccsZPresentErrorSummary(errorStore);
};

// forms validation

if (document.getElementById("ccs_login") !== null) document.getElementById("ccs_login").addEventListener('submit', ccsZvalidateLogin);

if (document.getElementById("ccs_create_or_choose") !== null) document.getElementById("ccs_create_or_choose").addEventListener('submit', ccsZvalidateCreateOrChoose);

if (document.getElementById("ccs_select_offer") !== null) document.getElementById("ccs_select_offer").addEventListener('submit', ccsZvalidateSelectOffer);

if (document.getElementById("ccs_eoi_needs") !== null) document.getElementById("ccs_eoi_needs").addEventListener('submit', ccsZvalidateEoiNeeds);

//if (document.getElementById("ccs_eoi_incumbent_form") !== null) document.getElementById("ccs_eoi_incumbent_form").addEventListener('submit', ccsZvalidateEoiIncumbent);

if (document.getElementById("eoi_budget_form") !== null) document.getElementById("eoi_budget_form").addEventListener('submit', ccsZvalidateEoiBudget);

if (document.getElementById("ccs_eoi_criteria_form") !== null) document.getElementById("ccs_eoi_criteria_form").addEventListener('submit', ccsZvalidateEoiCriteria);

//if (document.getElementById("ccs_eoi_docs_form") !== null) document.getElementById("ccs_eoi_docs_form").addEventListener('submit', ccsZvalidateEoiDocs);

if (document.getElementById("ccs_eoi_deadline_form") !== null) document.getElementById("ccs_eoi_deadline_form").addEventListener('submit', ccsZvalidateEoiDeadline);

if (document.getElementById("eoi_location") !== null) document.getElementById("eoi_location").addEventListener('submit', ccsZvalidateEoiLocation);

if (document.getElementById("rfi_location") !== null) document.getElementById("rfi_location").addEventListener('submit', ccsZvalidateRfiLocation);

if (document.getElementById("ccs_eoi_contact_form") !== null) document.getElementById("ccs_eoi_contact_form").addEventListener('submit', ccsZvalidateEoiContact);

//if (document.getElementById("ccs_add_collab") !== null) document.getElementById("ccs_add_collab").addEventListener('submit', ccsZvalidateTeamMems);

//if (document.getElementById("ccs_add_rfi_collab") !== null) document.getElementById("ccs_add_rfi_collab").addEventListener('submit', ccsZvalidateRfiTeamMems);


if (document.getElementById("ccs_rfi_project_name_form") !== null) document.getElementById("ccs_rfi_project_name_form").addEventListener('submit', ccsZvalidateRfiProjectName);

if (document.getElementById("ccs_eoi_project_name_form") !== null) document.getElementById("ccs_eoi_project_name_form").addEventListener('submit', ccsZvalidateEoiProjectName);

if (document.getElementById("ccs_choose_pre_engage") !== null) document.getElementById("ccs_choose_pre_engage").addEventListener('submit', ccsZvalidatePreMarketRoute);

if (document.getElementById("ccs_eoi_type_form") !== null) document.getElementById("ccs_eoi_type_form").addEventListener('submit', ccsZvalidateEoiType);

if (document.getElementById("ccs_rfi_type_form") !== null) document.getElementById("ccs_rfi_type_form").addEventListener('submit', ccsZvalidateRfiType);

//if (document.getElementById("ccs_rfi_who_form") !== null) document.getElementById("ccs_rfi_who_form").addEventListener('submit', ccsZvalidateRfiWho);

if (document.getElementById("ccs_rfi_vetting_form") !== null) document.getElementById("ccs_rfi_vetting_form").addEventListener('submit', ccsZvalidateRfiSecurity);

if (document.getElementById("ccs_eoi_vetting_form") !== null) document.getElementById("ccs_eoi_vetting_form").addEventListener('submit', ccsZvalidateEoiSecurity);

if (document.getElementById("ccs_ca_type_form") !== null) document.getElementById("ccs_ca_type_form").addEventListener('submit', ccsZvalidateCaaAssFCSecurity);
if (document.getElementById("ccs_ca_weighting") !== null) document.getElementById("ccs_ca_weighting").addEventListener('submit', ccsZvalidateCAWeightings);

if (document.getElementById("ccs_daa_weighting") !== null) document.getElementById("ccs_daa_weighting").addEventListener('submit', ccsZvalidateDAAWeightings);
if (document.getElementById("ccs_ca_suppliers_form") !== null) document.getElementById("ccs_ca_suppliers_form").addEventListener('submit', ccsZvalidateCASupplier);

if (document.getElementById("ca_where_work_done") !== null) document.getElementById("ca_where_work_done").addEventListener('submit', ccsZvalidateCAWhereWorkDone);

if (document.getElementById("da_where_work_done") !== null) document.getElementById("da_where_work_done").addEventListener('submit', ccsZvalidateDAWhereWorkDone);

if (document.getElementById('ccs_rfp_scoring_criteria') !== null) document.getElementById('ccs_rfp_scoring_criteria').addEventListener('submit', ccsZvalidateScoringCriteria);
// if (document.getElementById("ccs_rfi_dates_form") !== null) document.getElementById("ccs_rfi_dates_form").addEventListener('submit', ccsZvalidateRfiDates);

if (document.getElementById("ccs_rfi_address_form") !== null) {
  ccsZInitAddressFinder("rfi_proj_address-address");
  document.getElementById("rfi_find_address_btn").addEventListener('click', ccsZFindAddress);
  // document.getElementById("rfi_proj_address-address").addEventListener('change', ccsZFoundAddress);
  document.getElementById("change_postcode").addEventListener('click', ccsZResetAddress);
}

if (document.getElementById("ccs_rfi_address_manual_form") !== null) document.getElementById("ccs_rfi_address_manual_form").addEventListener('submit', ccsZvalidateRfiAddress);

if (document.getElementById("ccs_rfi_about_proj") !== null) document.getElementById("ccs_rfi_about_proj").addEventListener('submit', ccsZvalidateRfiProject);

if (document.getElementById("ccs_eoi_about_proj") !== null) document.getElementById("ccs_eoi_about_proj").addEventListener('submit', ccsZvalidateEoiProject);

//if(document.getElementById("ccs_rfi_proj_status") !== null) document.getElementById("ccs_rfi_proj_status").addEventListener('submit', ccsZvalidateRfiProjectStatus);

if (document.getElementById("ccs_rfi_docs_form") !== null) document.getElementById("ccs_rfi_docs_form").addEventListener('submit', ccsZvalidateRfiDocs);

//if (document.getElementById("ccs_rfi_response_date_form") !== null) document.getElementById("ccs_rfi_response_date_form").addEventListener('submit', ccsZvalidateRfiResponseDate);

if (document.getElementById("ccs_rfi_questions_form") !== null) document.getElementById("ccs_rfi_questions_form").addEventListener('submit', ccsZvalidateRfIQuestions);

if (document.getElementById("ccs_eoi_questions_form") !== null) document.getElementById("ccs_eoi_questions_form").addEventListener('submit', ccsZvalidateEoIQuestions);

if (document.getElementById("ccs_rfp_exit_strategy_form") !== null) document.getElementById("ccs_rfp_exit_strategy_form").addEventListener('submit', ccsZvalidateRfPStrategy);

if (document.getElementById("ccs_rfp_about_proj") !== null) document.getElementById("ccs_rfp_about_proj").addEventListener('submit', ccsZvalidateRfPAboutBG);

if (document.getElementById("ccs_eoi_purpose_form") !== null) document.getElementById("ccs_eoi_purpose_form").addEventListener('submit', ccsZvalidateEoiPurpose);

//if (document.getElementById("ccs_eoi_scope_form") !== null) document.getElementById("ccs_eoi_scope_form").addEventListener('submit', ccsZvalidateEoiScope);

if (document.getElementById("ccs_eoi_about_proj") !== null) document.getElementById("ccs_eoi_about_proj").addEventListener('submit', ccsZvalidateEoiContext);


if (document.getElementById("ccs_eoi_new_form") !== null) document.getElementById("ccs_eoi_new_form").addEventListener('submit', ccsZvalidateEoiServiceType);

if (document.getElementById("ccs_eoi_terms_form") !== null) document.getElementById("ccs_eoi_terms_form").addEventListener('submit', ccsZvalidateEoiTermsForm);

if (document.getElementById("ccs_incumbent_form") !== null) document.getElementById("ccs_incumbent_form").addEventListener('submit', ccsZvalidateIncumbentForm);

if (document.getElementById("eoi_docs_form") !== null) document.getElementById("eoi_docs_form").addEventListener('submit', ccsZvalidateEoiDocs);

if (document.getElementById("ccs_eoi_duration") !== null) document.getElementById("ccs_eoi_duration").addEventListener('submit', ccsZvalidateEoiStartDate);

if (document.getElementById("ccs-rfi-suppliers-form") !== null) document.getElementById("ccs-rfi-suppliers-form").addEventListener('submit', ccsZValidateSuppliersForm);

if (document.getElementById("ccs_eoi_acronyms_form") !== null) document.getElementById("ccs_eoi_acronyms_form").addEventListener('submit', ccsZvalidateEoiAcronyms);

if (document.getElementById("ccs_rfp_acronyms_form") !== null) document.getElementById("ccs_rfp_acronyms_form").addEventListener('submit', ccsZvalidateRfpAcronyms);

if (document.getElementById("rfp_location") !== null) document.getElementById("rfp_location").addEventListener('submit', ccsZvalidateRfpLocation);

if (document.getElementById("ccs_eoi_splterms_form") !== null) document.getElementById("ccs_eoi_splterms_form").addEventListener('submit', ccsZvalidateEoiSpecialTerms);

if (document.getElementById("ccs_rfi_acronyms_form") !== null) document.getElementById("ccs_rfi_acronyms_form").addEventListener('submit', ccsZvalidateRfiAcronyms);

if (document.getElementById("ccs_eoi_date_form") !== null) document.getElementById("ccs_eoi_date_form").addEventListener('submit', ccsZvalidateEoiDate);

if (document.querySelectorAll('.ons-list__item') !== null) ccsTabMenuNaviation();


setInputFilter(document.getElementById("eoi_resource_start_date-day"), (value) => /^\d*$/.test(value) && (value === "" || parseInt(value) <= 31));
setInputFilter(document.getElementById("eoi_resource_start_date-month"), (value) => /^\d*$/.test(value) && (value === "" || parseInt(value) <= 12));
setInputFilter(document.getElementById("eoi_resource_start_date-year"), (value) => /^\d*$/.test(value) && (value === "" || parseInt(value) <= 2023));
setInputFilter(document.getElementById("eoi_duration-days"), (value) => /^\d*$/.test(value) && (value === "" || parseInt(value) <= 31));
setInputFilter(document.getElementById("eoi_duration-months"), (value) => /^\d*$/.test(value) && (value === "" || parseInt(value) <= 12));
setInputFilter(document.getElementById("eoi_duration-years"), (value) => /^\d*$/.test(value) && (value === "" || parseInt(value) <= 4));

setInputFilter(document.getElementById("clarification_date-minute_2"), (value) => /^\d*$/.test(value) && (value === "" || parseInt(value) <= 60));
setInputFilter(document.getElementById("clarification_date-hour_2"), (value) => /^\d*$/.test(value) && (value === "" || parseInt(value) <= 12));
setInputFilter(document.getElementById("clarification_date-day_2"), (value) => /^\d*$/.test(value) && (value === "" || parseInt(value) <= 31));
setInputFilter(document.getElementById("clarification_date-month_2"), (value) => /^\d*$/.test(value) && (value === "" || parseInt(value) <= 12));
setInputFilter(document.getElementById("clarification_date-year_2"), (value) => /^\d*$/.test(value) && (value === "" || parseInt(value) <= 2024));

setInputFilter(document.getElementById("clarification_date-minute_3"), (value) => /^\d*$/.test(value) && (value === "" || parseInt(value) <= 60));
setInputFilter(document.getElementById("clarification_date-hour_3"), (value) => /^\d*$/.test(value) && (value === "" || parseInt(value) <= 12));
setInputFilter(document.getElementById("clarification_date-day_3"), (value) => /^\d*$/.test(value) && (value === "" || parseInt(value) <= 31));
setInputFilter(document.getElementById("clarification_date-month_3"), (value) => /^\d*$/.test(value) && (value === "" || parseInt(value) <= 12));
setInputFilter(document.getElementById("clarification_date-year_3"), (value) => /^\d*$/.test(value) && (value === "" || parseInt(value) <= 2024));

setInputFilter(document.getElementById("clarification_date-minute_4"), (value) => /^\d*$/.test(value) && (value === "" || parseInt(value) <= 60));
setInputFilter(document.getElementById("clarification_date-hour_4"), (value) => /^\d*$/.test(value) && (value === "" || parseInt(value) <= 12));
setInputFilter(document.getElementById("clarification_date-day_4"), (value) => /^\d*$/.test(value) && (value === "" || parseInt(value) <= 31));
setInputFilter(document.getElementById("clarification_date-month_4"), (value) => /^\d*$/.test(value) && (value === "" || parseInt(value) <= 12));
setInputFilter(document.getElementById("clarification_date-year_4"), (value) => /^\d*$/.test(value) && (value === "" || parseInt(value) <= 2024));

setInputFilter(document.getElementById("clarification_date-minute_5"), (value) => /^\d*$/.test(value) && (value === "" || parseInt(value) <= 60));
setInputFilter(document.getElementById("clarification_date-hour_5"), (value) => /^\d*$/.test(value) && (value === "" || parseInt(value) <= 12));
setInputFilter(document.getElementById("clarification_date-day_5"), (value) => /^\d*$/.test(value) && (value === "" || parseInt(value) <= 31));
setInputFilter(document.getElementById("clarification_date-month_5"), (value) => /^\d*$/.test(value) && (value === "" || parseInt(value) <= 12));
setInputFilter(document.getElementById("clarification_date-year_5"), (value) => /^\d*$/.test(value) && (value === "" || parseInt(value) <= 2024));


