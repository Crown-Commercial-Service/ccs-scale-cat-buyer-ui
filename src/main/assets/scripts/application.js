/* global $ */
$(document).ready(function () {
  window.GOVUKFrontend.initAll();

  // Read the CSRF token from the <meta> tag
  var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  $.ajaxSetup({
    beforeSend: function (xhr) {
      xhr.setRequestHeader('CSRF-Token', token);
    },
  });

  if (matchMedia) {
    const mq = window.matchMedia('(min-width: 40.0625em)');
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
    var new_val = 'true';
    if (is_hidden == 'true') new_val = 'false';
    document.querySelector('.global-navigation').setAttribute('aria-hidden', new_val);
  });
});
const ccsZvalidateRfiLocation = event => {
  event.preventDefault();

  let fieldCheck = '',
    errorStore = [];

  fieldCheck = ccsZisOptionChecked(
    'required_locations',
    'Select at least one location',
  );
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms['rfi_location'].submit();
  else ccsZPresentErrorSummary(errorStore);
};

// forms validation

$(".focusdata").click(function () {

  var $container = $("html,body");
  var $scrollTo = $('.focus-data');

  $container.animate({ scrollTop: $scrollTo.offset().top - $container.offset().top + $container.scrollTop(), scrollLeft: 0 }, 300);

});

// $(".loaderClick").click(function(){
//   $('.loader-container').addClass('loader-block');
// });

$("#getId").click(function () {
  var myclass = $(this).hasClass("uncheck");


  if (myclass) {
    $("input[type='checkbox']").prop("checked", true);
    $(this).removeClass("uncheck");
    $(this).addClass("check");
    $('.otherTextArea').removeClass('ccs-dynaform-hidden');
  } else {
    $('.otherTextArea').addClass('ccs-dynaform-hidden');
    $("input[type='checkbox']").prop("checked", false);
    $(this).addClass("uncheck");
    $(this).removeClass("check");
  }


});

// $("#DOSgetId").click(function(){
//   var myclass = $(this).hasClass("uncheck");
//     if(myclass){
//       $("input[type='checkbox']").prop("checked", true);
//       $(this).removeClass("uncheck");
//       $(this).addClass("check");

//     }else{
//       $("input[type='checkbox']").prop("checked", false);
//       $(this).addClass("uncheck");
//       $(this).removeClass("check");
//     } 
// });


if (document.getElementById('ccs_login') !== null)
  document.getElementById('ccs_login').addEventListener('submit', ccsZvalidateLogin);

if (document.getElementById('ccs_create_or_choose') !== null)
  document.getElementById('ccs_create_or_choose').addEventListener('submit', ccsZvalidateCreateOrChoose);

if (document.getElementById('ccs_select_offer') !== null)
  document.getElementById('ccs_select_offer').addEventListener('submit', ccsZvalidateSelectOffer);

if (document.getElementById('ccs_eoi_needs') !== null)
  document.getElementById('ccs_eoi_needs').addEventListener('submit', ccsZvalidateEoiNeeds);

//if (document.getElementById("ccs_eoi_incumbent_form") !== null) document.getElementById("ccs_eoi_incumbent_form").addEventListener('submit', ccsZvalidateEoiIncumbent);

if (document.getElementById('eoi_budget_form') !== null)
  document.getElementById('eoi_budget_form').addEventListener('submit', ccsZvalidateEoiBudget);

if (document.getElementById('ccs_eoi_criteria_form') !== null)
  document.getElementById('ccs_eoi_criteria_form').addEventListener('submit', ccsZvalidateEoiCriteria);

//if (document.getElementById("ccs_eoi_docs_form") !== null) document.getElementById("ccs_eoi_docs_form").addEventListener('submit', ccsZvalidateEoiDocs);

if (document.getElementById('ccs_eoi_deadline_form') !== null)
  document.getElementById('ccs_eoi_deadline_form').addEventListener('submit', ccsZvalidateEoiDeadline);

if (document.getElementById('eoi_location') !== null)
  document.getElementById('eoi_location').addEventListener('submit', ccsZvalidateEoiLocation);

if (document.getElementById('rfi_location') !== null)
  document.getElementById('rfi_location').addEventListener('submit', ccsZvalidateRfiLocation);

if (document.getElementById('ccs_eoi_contact_form') !== null)
  document.getElementById('ccs_eoi_contact_form').addEventListener('submit', ccsZvalidateEoiContact);

//if (document.getElementById("ccs_add_collab") !== null) document.getElementById("ccs_add_collab").addEventListener('submit', ccsZvalidateTeamMems);

//if (document.getElementById("ccs_add_rfi_collab") !== null) document.getElementById("ccs_add_rfi_collab").addEventListener('submit', ccsZvalidateRfiTeamMems);

if (document.getElementById('ccs_rfp_exit_strategy_form') !== null) {
  document.getElementById('ccs_rfp_exit_strategy_form').addEventListener('change', ccsZOnChange);
}

if (document.getElementById('ccs_rfi_project_name_form') !== null)
  document.getElementById('ccs_rfi_project_name_form').addEventListener('submit', ccsZvalidateRfiProjectName);

if (document.getElementById('rfi_projLongName') !== null)
  document.getElementById('rfi_projLongName').addEventListener('input', ccsZCountRfiProjectName);

if (document.getElementById('enter_evaluation_feedback') !== null)
  document.getElementById('enter_evaluation_feedback').addEventListener('input', ccsZCountsupplierFeedback);

if (document.getElementById('enter_evaluation_score') !== null)
  document.getElementById('enter_evaluation_score').addEventListener('keypress', ccsZValidateDecimalScore);

if (document.getElementById('enter_evaluation_feedback') !== null)
  document.getElementById('enter_evaluation_feedback').addEventListener('submit', ccsZvalidateFeedback);


if (document.getElementById('enter_evaluation_score') !== null)
  document.getElementById('enter_evaluation_score').addEventListener('submit', ccsZvalidateScore);

if (document.getElementById('ccs_eoi_project_name_form') !== null)
  document.getElementById('ccs_eoi_project_name_form').addEventListener('submit', ccsZvalidateEoiProjectName);

if (document.getElementById('ccs_choose_pre_engage') !== null)
  document.getElementById('ccs_choose_pre_engage').addEventListener('submit', ccsZvalidatePreMarketRoute);

if (document.getElementById('ccs_eoi_type_form') !== null)
  document.getElementById('ccs_eoi_type_form').addEventListener('submit', ccsZvalidateEoiType);

if (document.getElementById('ccs_rfi_type_form') !== null)
  document.getElementById('ccs_rfi_type_form').addEventListener('submit', ccsZvalidateRfiType);

  if (document.getElementById('choose_build_rfi') !== null)
  document.getElementById('choose_build_rfi').addEventListener('submit', ccsZvalidateRfiMcfType);


if (document.getElementById("ccs_rfi_who_form") !== null) document.getElementById("ccs_rfi_who_form").addEventListener('submit', ccsZvalidateRfiWho);

if (document.getElementById('ccs_rfi_vetting_form') !== null)
  document.getElementById('ccs_rfi_vetting_form').addEventListener('submit', ccsZvalidateRfiSecurity);

if (document.getElementById('ccs_eoi_vetting_form') !== null)
  document.getElementById('ccs_eoi_vetting_form').addEventListener('submit', ccsZvalidateEoiSecurity);

if (document.getElementById('ccs_ca_type_form') !== null)
  document.getElementById('ccs_ca_type_form').addEventListener('submit', ccsZvalidateCaaAssFCSecurity);
if (document.getElementById('ccs_ca_weighting') !== null)
  document.getElementById('ccs_ca_weighting').addEventListener('submit', ccsZvalidateCAWeightings);

if (document.getElementById('ccs_daa_weighting') !== null)
  document.getElementById('ccs_daa_weighting').addEventListener('submit', ccsZvalidateDAAWeightings);

if (document.getElementById('ca_where_work_done') !== null)
  document.getElementById('ca_where_work_done').addEventListener('submit', ccsZvalidateCAWhereWorkDone);

if (document.getElementById('da_where_work_done') !== null)
  document.getElementById('da_where_work_done').addEventListener('submit', ccsZvalidateDAWhereWorkDone);

if (document.getElementById('ccs_rfp_scoring_criteria') !== null)
  document.getElementById('ccs_rfp_scoring_criteria').addEventListener('submit', ccsZvalidateScoringCriteria);

if (document.getElementById('service_user_type_form') !== null)
  document.getElementById('service_user_type_form').addEventListener('submit', ccsZvalidateScoringCriteria2);
// if (document.getElementById("ccs_rfi_dates_form") !== null) document.getElementById("ccs_rfi_dates_form").addEventListener('submit', ccsZvalidateRfiDates);

if (document.getElementById('ccs_rfi_address_form') !== null) {
  ccsZInitAddressFinder('rfi_proj_address-address');
  document.getElementById('rfi_find_address_btn').addEventListener('click', ccsZFindAddress);
  // document.getElementById("rfi_proj_address-address").addEventListener('change', ccsZFoundAddress);
  document.getElementById('change_postcode').addEventListener('click', ccsZResetAddress);
}

if (document.getElementById('ccs_rfi_address_manual_form') !== null)
  document.getElementById('ccs_rfi_address_manual_form').addEventListener('submit', ccsZvalidateRfiAddress);

if (document.getElementById('ccs_rfi_about_proj') !== null)
  document.getElementById('ccs_rfi_about_proj').addEventListener('submit', ccsZvalidateRfiProject);

if (document.getElementById('rfi_prob_statement') !== null)
  document.getElementById('rfi_prob_statement').addEventListener('input', ccsZCountRfiProject);

if (document.getElementById('ccs_rfi_next_steps') !== null)
  document.getElementById('ccs_rfi_next_steps').addEventListener('submit', showPopup);

if (document.getElementById('ccs_rfi_closeyouproject') !== null)
  document.getElementById('ccs_rfi_closeyouproject').addEventListener('submit', loseyouprojectShowPopup);

// if (document.getElementById('evaluate_suppliers') !== null)
  // document.getElementById('evaluate_suppliers').addEventListener('click', showEvaluateSuppliersPopup);

if (document.getElementById('supplierMsgCancel') !== null)
  document.getElementById('supplierMsgCancel').addEventListener('click', supplierMsgCancelPopup);

if (document.getElementById('rfi_contracting_auth') !== null)
  document.getElementById('rfi_contracting_auth').addEventListener('input', ccsZCountRfiWho);

if (document.getElementById('ca_justification') !== null)
  document.getElementById('ca_justification').addEventListener('input', ccsZCountCAReviewRank);

// if (document.getElementById('ccs_eoi_about_proj') !== null)
//   document.getElementById('ccs_eoi_about_proj').addEventListener('submit', ccsZvalidateEoiProject);

//if(document.getElementById("ccs_rfi_proj_status") !== null) document.getElementById("ccs_rfi_proj_status").addEventListener('submit', ccsZvalidateRfiProjectStatus);

if (document.getElementById('ccs_rfi_docs_form') !== null)
  document.getElementById('ccs_rfi_docs_form').addEventListener('submit', ccsZvalidateRfiDocs);

//if (document.getElementById("ccs_rfi_response_date_form") !== null) document.getElementById("ccs_rfi_response_date_form").addEventListener('submit', ccsZvalidateRfiResponseDate);


if (document.getElementById('ccs_rfi_questions_form') !== null)
  document.getElementById('ccs_rfi_questions_form').addEventListener('submit', ccsZvalidateRfIQuestions);

if (document.getElementById('ccs_eoi_questions_form') !== null)
  document.getElementById('ccs_eoi_questions_form').addEventListener('submit', ccsZvalidateEoIQuestions);

if (document.getElementById('ccs_rfp_exit_strategy_form') !== null)
  document.getElementById('ccs_rfp_exit_strategy_form').addEventListener('submit', ccsZvalidateRfPStrategy);

if (document.getElementById('ccs_rfp_exit_strategy_form') !== null)
  // document.getElementById('ccs_rfp_exit_strategy_form').addEventListener('submit', ccsZvalidateTextArea);


  // if (document.getElementById('ccs_rfp_exit_strategy_form') !== null)
  //   document.getElementById('ccs_rfp_exit_strategy_form').addEventListener('change', ccsZvalidateRfPChangeStrategy);

  if (document.getElementById('ccs_rfp_about_proj') !== null)
    document.getElementById('ccs_rfp_about_proj').addEventListener('submit', ccsZvalidateRfPAboutBG);

if (document.getElementById('ccs_rfp_who_form') !== null)
  document.getElementById('ccs_rfp_who_form').addEventListener('submit', ccsZvalidateTextRfpChangeStrategy);

if (document.getElementById('ccs_eoi_purpose_form') !== null)
  document.getElementById('ccs_eoi_purpose_form').addEventListener('submit', ccsZvalidateEoiPurpose);


//if (document.getElementById("ccs_eoi_scope_form") !== null) document.getElementById("ccs_eoi_scope_form").addEventListener('submit', ccsZvalidateEoiScope);

// if (document.getElementById('ccs_eoi_about_proj') !== null)
//   document.getElementById('ccs_eoi_about_proj').addEventListener('submit', ccsZvalidateEoiContext);

if (document.getElementById('ccs_eoi_about_proj') !== null)
  document.getElementById('ccs_eoi_about_proj').addEventListener('submit', ccsZvalidateEoiProject);


if (document.getElementById('ccs_eoi_new_form') !== null)
  document.getElementById('ccs_eoi_new_form').addEventListener('submit', ccsZvalidateEoiServiceType);

if (document.getElementById('ccs_eoi_terms_form') !== null)
  document.getElementById('ccs_eoi_terms_form').addEventListener('submit', ccsZvalidateEoiTermsForm);

if (document.getElementById('ccs_incumbent_form') !== null)
  document.getElementById('ccs_incumbent_form').addEventListener('submit', ccsZvalidateIncumbentForm);

if (document.getElementById('eoi_docs_form') !== null)
  document.getElementById('eoi_docs_form').addEventListener('submit', ccsZvalidateEoiDocs);

if (document.getElementById('ccs_eoi_duration') !== null)
  document.getElementById('ccs_eoi_duration').addEventListener('submit', ccsZvalidateEoiStartDate);

if (document.getElementById('ccs-rfi-suppliers-form') !== null)
  document.getElementById('ccs-rfi-suppliers-form').addEventListener('submit', ccsZValidateSuppliersForm);

if (document.getElementById('ccs_eoi_acronyms_form') !== null)
  document.getElementById('ccs_eoi_acronyms_form').addEventListener('submit', ccsZvalidateEoiAcronyms);

if (document.getElementById('ccs_rfp_acronyms_form') !== null)
  document.getElementById('ccs_rfp_acronyms_form').addEventListener('submit', ccsZvalidateRfpAcronymsRFP);

// if (document.getElementById('ccs_rfp_acronyms_form') !== null)
// document.getElementById('ccs_rfp_acronyms_form').addEventListener('keydown', ccsZvalidateChangeRfpAcronymsRFP);


if (document.getElementById('rfp_location') !== null)
  document.getElementById('rfp_location').addEventListener('submit', ccsZvalidateRfpLocation);
if (document.getElementById('rfp_location') != undefined && document.getElementById('rfp_location') != null)
  document.getElementById('rfp_location').addEventListener('change', ccsZvalidateChangeRfpLocation);


if (document.getElementById('ccs_eoi_splterms_form') !== null)
  document.getElementById('ccs_eoi_splterms_form').addEventListener('submit', ccsZvalidateEoiSpecialTerms);

if (document.getElementById('ccs_rfi_acronyms_form') !== null)
  document.getElementById('ccs_rfi_acronyms_form').addEventListener('submit', ccsZvalidateRfiAcronyms);

if (document.getElementById('ccs_eoi_date_form') !== null)
  document.getElementById('ccs_eoi_date_form').addEventListener('submit', ccsZvalidateEoiDate);

if (document.getElementById('fca_select_services_form') !== null)
  document.getElementById('fca_select_services_form').addEventListener('submit', ccsFcaSelectedServices);

//Balwider
if (document.getElementById('rfp_percentage_form') !== null)
  document.getElementById('rfp_percentage_form').addEventListener('submit', ccsZvalidateRfpPercentages);

//Award
if (document.getElementById('ccs_pre_award_supplier_form') !== null)
  document.getElementById('ccs_pre_award_supplier_form').addEventListener('submit', ccsZvalidateAward);

if (document.getElementById('ccs_standstill_period_form') !== null)
  document.getElementById('ccs_standstill_period_form').addEventListener('submit', ccsZvalidateStandStillPeriod);

if (document.getElementById('ccs_da_project_name_form') !== null)
  document.getElementById('ccs_da_project_name_form').addEventListener('submit', ccsZvalidateDaProjectName);

if (document.getElementById('da_projLongName') !== null)
  document.getElementById('da_projLongName').addEventListener('input', ccsZCountDaProjectName);

//if (document.getElementById('rfp_multianswer_question_form') !== null)
// document.getElementById('rfp_multianswer_question_form').addEventListener('submit', "");
//if (document.getElementById('service_levels_kpi_form') !== null)
//document.getElementById('service_levels_kpi_form').addEventListener('submit', ccsZvalidateRfpKPI);

let noOfCharac = 200;
let contents = document.querySelectorAll(".content_review_length");
// if (document.getElementsByClassName('rfp_percentage_form') !== null){
contents.forEach((content, index) => {
  //If text length is less that noOfCharac... then hide the read more button
  if (content.textContent.length < noOfCharac) {
    //content.nextElementSibling.style.display = "none";
  }
  else {
    //let that = this;
    let displayText = content.textContent.slice(0, noOfCharac);
    let moreText = content.textContent.slice(noOfCharac);
    content.innerHTML = `<div id="content-${index}">${displayText}<span id="dots-${index}" class="dots">...  </span><span id="moreValue${index}" class="hide more">${moreText}</span><a  class="read_more_btn_review" id="${index}" data-name="${index}">Read more</a> </div>`;
    // content.innerHTML = `<div id="content-${index}">${displayText}<span class="dots">...</span><span class="hide more">${moreText}</span><button onclick="readMore(${that})">Read More</button> </div>`;
  }

});
//   }

function readMoreWithLength() {
  document.querySelectorAll(".content_review_length").forEach(function (event) {
    event.addEventListener('click', function (e) {
      let targetId = e.target.id;
      //$('#moreValue'+targetId).show();
      let btn = document.querySelector('#content-' + targetId);
      let HtmlBtn = $('#' + targetId).html();
      if (HtmlBtn == 'Read more') {
        $('#moreValue' + targetId).removeClass("hide");
        $('#' + targetId).html("Read less");
        $('#moreValue' + targetId).show();
        $('#dots-' + targetId).hide();
      } else {
        $('#moreValue' + targetId).addClass("hide");
        $('#' + targetId).html("Read more");
        $('#moreValue' + targetId).hide();
        $('#dots-' + targetId).show();
      }
    });
  });
}
readMoreWithLength();

if (document.querySelectorAll('.ons-list__item') !== null) ccsTabMenuNaviation();

setInputFilter(
  document.getElementById('eoi_resource_start_date-day'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('eoi_resource_start_date-month'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
// setInputFilter(
//   document.getElementById('eoi_resource_start_date-year'),
//   value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 2025),
// );
setInputFilter(
  document.getElementById('eoi_duration-days'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('eoi_duration-months'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('eoi_duration-years'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 100),
);
setInputFilter(
  document.getElementById('clarification_date-minute_2'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 60),
);
setInputFilter(
  document.getElementById('clarification_date-hour_2'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 23),
);
setInputFilter(
  document.getElementById('clarification_date-day_2'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('clarification_date-month_2'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('clarification_date-year_2'),
  value => /^\d*$/.test(value),
);
setInputFilter(
  document.getElementById('clarification_date-minute_3'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 60),
);
setInputFilter(
  document.getElementById('clarification_date-hour_3'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 23),
);
setInputFilter(
  document.getElementById('clarification_date-day_3'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('clarification_date-month_3'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('clarification_date-year_3'),
  value => /^\d*$/.test(value),
);

setInputFilter(
  document.getElementById('clarification_date-minute_4'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 60),
);
setInputFilter(
  document.getElementById('clarification_date-hour_4'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 23),
);
setInputFilter(
  document.getElementById('clarification_date-day_4'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('clarification_date-month_4'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('clarification_date-year_4'),
  value => /^\d*$/.test(value),
);

setInputFilter(
  document.getElementById('clarification_date-minute_5'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 60),
);
setInputFilter(
  document.getElementById('clarification_date-hour_5'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 23),
);
setInputFilter(
  document.getElementById('clarification_date-day_5'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('clarification_date-month_5'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('clarification_date-year_5'),
  value => /^\d*$/.test(value),
);


setInputFilter(
  document.getElementById('clarification_date-minute_6'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 60),
);
setInputFilter(
  document.getElementById('clarification_date-hour_6'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 23),
);
setInputFilter(
  document.getElementById('clarification_date-day_6'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('clarification_date-month_6'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('clarification_date-year_6'),
  value => /^\d*$/.test(value),
);

setInputFilter(
  document.getElementById('clarification_date-minute_7'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 60),
);
setInputFilter(
  document.getElementById('clarification_date-hour_7'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 23),
);
setInputFilter(
  document.getElementById('clarification_date-day_7'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('clarification_date-month_7'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('clarification_date-year_7'),
  value => /^\d*$/.test(value),
);

setInputFilter(
  document.getElementById('clarification_date-minute_8'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 60),
);
setInputFilter(
  document.getElementById('clarification_date-hour_8'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 23),
);
setInputFilter(
  document.getElementById('clarification_date-day_8'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('clarification_date-month_8'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('clarification_date-year_8'),
  value => /^\d*$/.test(value),
);

setInputFilter(
  document.getElementById('clarification_date-minute_9'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 60),
);
setInputFilter(
  document.getElementById('clarification_date-hour_9'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 23),
);
setInputFilter(
  document.getElementById('clarification_date-day_9'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('clarification_date-month_9'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('clarification_date-year_9'),
  value => /^\d*$/.test(value),
);

setInputFilter(
  document.getElementById('clarification_date-minute_10'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 60),
);
setInputFilter(
  document.getElementById('clarification_date-hour_10'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 23),
);
setInputFilter(
  document.getElementById('clarification_date-day_10'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('clarification_date-month_10'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('clarification_date-year_10'),
  value => /^\d*$/.test(value),
);

setInputFilter(
  document.getElementById('clarification_date-minute_11'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 60),
);
setInputFilter(
  document.getElementById('clarification_date-hour_11'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 23),
);
setInputFilter(
  document.getElementById('clarification_date-day_11'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('clarification_date-month_11'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('clarification_date-year_11'),
  value => /^\d*$/.test(value),
);

setInputFilter(
  document.getElementById('clarification_date-minute_12'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 60),
);
setInputFilter(
  document.getElementById('clarification_date-hour_12'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 23),
);
setInputFilter(
  document.getElementById('clarification_date-day_12'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('clarification_date-month_12'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('clarification_date-year_12'),
  value => /^\d*$/.test(value),
);

setInputFilter(
  document.getElementById('clarification_date-minute_13'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 60),
);
setInputFilter(
  document.getElementById('clarification_date-hour_13'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 23),
);
setInputFilter(
  document.getElementById('clarification_date-day_13'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('clarification_date-month_13'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('clarification_date-year_13'),
  value => /^\d*$/.test(value),
);

setInputFilter(
  document.getElementById('rfp_resource_start_date_day_Question11'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('rfp_resource_start_date_month_Question 11'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 12),
);
setInputFilter(
  document.getElementById('rfp_resource_start_date_year_Question 11'),
  value => /^\d*$/.test(value),
);

setInputFilter(
  document.getElementById('rfp_duration_days_Question12'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('rfp_duration_months_Question12'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 11),
);
setInputFilter(
  document.getElementById('rfp_duration-years_Question12'),
  value => /^\d*$/.test(value),
);


setInputFilter(
  document.getElementById('rfp_duration_days_Question13'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 31),
);
setInputFilter(
  document.getElementById('rfp_duration_months_Question13'),
  value => /^\d*$/.test(value) && (value === '' || parseInt(value) <= 11),
);
setInputFilter(
  document.getElementById('rfp_duration-years_Question13'),
  value => /^\d*$/.test(value),
);
//g13Check Script

function parseQueryG13(query) {
  object = {};
  if (query.indexOf('?') != -1) {
    query = query.split('?');
    query = query[1];
  }
  parseQuery = query.split("&");
  for (var i = 0; i < parseQuery.length; i++) {
    pair = parseQuery[i].split('=');
    key = decodeURIComponent(pair[0]);
    if (key.length == 0) continue;
    value = decodeURIComponent(pair[1].replace("+", " "));
    if (key == 'q') {
      let decodeValue = decodeURIComponent(pair[1].replace("+", " "));
      value = encodeURIComponent(decodeValue);
    }
    if (object[key] == undefined) object[key] = value;
    else if (object[key] instanceof Array) object[key].push(value);
    else object[key] = [object[key], value];
  }
  return object;
};

const tune = (obj) => {
  let emptyArr = [];
  for (const key in obj) {
    if (typeof (obj[key]) == 'object') {
      let newArr = obj[key];
      for (let i = 0; i < newArr.length; i++) {
        emptyArr.push({ 'key': key, 'value': newArr[i] });
      }
    } else { emptyArr.push({ 'key': key, 'value': obj[key] }); }
  }
  return emptyArr;
}

function g13ServiceQueryFliterJquery(queryObj, baseUrl, overUrl) {

  let outQueryUrl = "";
  let overName = overUrl.name;

  let overValue = overUrl.value;
  let overType = overUrl.type;

  if (queryObj.length > 0) {
    if (overType == 'unchecked') {
      let compareVal = overValue;
      let compareName = overName;
      let finalObj = [];
      queryObj.find((el) => {

        if (el.value != compareVal || el.key != compareName) {
          finalObj.push(el);
        }
      });
      queryObj = finalObj;
    }

    queryObj.forEach((el, i) => {
      let key = el.key;
      let value = el.value;
      if (i == 0) {
        if (key != '') {
          outQueryUrl += `?${key}=${value}`;
        }
      } else {
        outQueryUrl += `&${key}=${value}`;
      }
      if (i == queryObj.length - 1) {
        if (overType == 'checked' || overType == 'categoryClicked') {
          if (key != '') {
            outQueryUrl += `&${overName}=${overValue}`;
          } else {
            outQueryUrl += `?${overName}=${overValue}`;
          }
        }
      }
    });
  } else {
    if (overValue != '') {
      outQueryUrl += `?${overName}=${overValue}`;
    }
  }


  return outQueryUrl;
}
document.querySelectorAll(".clickCategory").forEach(function (event) {
  event.addEventListener('click', function () {
    let eventFilterType = 'categoryClicked';
    let filterName = this.getAttribute("data-name");
    let filterValue = this.getAttribute("data-value");
    let urlObj = parseQueryG13(document.location.search);
    urlObj = tune(urlObj);
    let baseUrl = window.location.href.split('?')[0];
    let finalTriggerUrl = g13ServiceQueryFliterJquery(urlObj, baseUrl, { name: filterName, value: filterValue, type: eventFilterType });
    window.location.href = `${baseUrl}${finalTriggerUrl}`;
  });
});

if (document.querySelectorAll('.serviceCategory')) {
  document.querySelectorAll(".serviceCategory").forEach(function (event) {
    event.addEventListener('click', function () {
      let eventFilterType = 'serviceCategoryClicked';
      let filterName = this.getAttribute('data-name');
      let filterValue = this.getAttribute('data-value');
      let urlObj = parseQueryG13(document.location.search);
      urlObj = tune(urlObj);

      let finalObj = [];
      urlObj.find((el) => {
        if (el.key !== 'serviceCategories') { finalObj.push(el); }
      });
      urlObj = finalObj;
      urlObj.push({ "key": "serviceCategories", "value": filterValue });

      let baseUrl = window.location.href.split('?')[0];
      let finalTriggerUrl = g13ServiceQueryFliterJquery(urlObj, baseUrl, { name: filterName, value: filterValue, type: eventFilterType });
      window.location.href = `${baseUrl}${finalTriggerUrl}`;
    });
  });
}

if (document.querySelectorAll('.parentCategory')) {
  document.querySelectorAll(".parentCategory").forEach(function (event) {
    event.addEventListener('click', function () {
      let eventFilterType = 'parentCategoryClicked';
      let filterName = this.getAttribute('data-name');
      let filterValue = this.getAttribute('data-value');
      let urlObj = parseQueryG13(document.location.search);
      urlObj = tune(urlObj);

      let condtionParentCat = urlObj.find(el => el.key === 'parentCategory');
      if (condtionParentCat === undefined) {
        let serviceCategory = urlObj.find(el => el.key === 'serviceCategories');
        urlObj.push({ "key": "parentCategory", "value": serviceCategory.value });
        urlObj.splice(urlObj.findIndex(({ key }) => key == "serviceCategories"), 1);
        urlObj.push({ "key": "serviceCategories", "value": filterValue });
      } else {
        let finalObj = [];
        urlObj.find((el) => {
          if (el.key !== 'serviceCategories') { finalObj.push(el); }
        });
        urlObj = finalObj;
        urlObj.push({ "key": "serviceCategories", "value": filterValue });
      }

      let baseUrl = window.location.href.split('?')[0];
      let finalTriggerUrl = g13ServiceQueryFliterJquery(urlObj, baseUrl, { name: filterName, value: filterValue, type: eventFilterType });
      window.location.href = `${baseUrl}${finalTriggerUrl}`;
    });
  });
}

function titleCase(str) {
  return str.toLowerCase().split(' ').map(function (word) {
    return word.replace(word[0], word[0].toUpperCase());
  }).join(' ');
}

function removeURLParameter(url, parameter) {
  //prefer to use l.search if you have a location/link object
  var urlparts = url.split('?');
  if (urlparts.length >= 2) {

    var prefix = encodeURIComponent(parameter) + '=';
    var pars = urlparts[1].split(/[&;]/g);

    //reverse iteration as may be destructive
    for (var i = pars.length; i-- > 0;) {
      //idiom for string.startsWith
      if (pars[i].lastIndexOf(prefix, 0) !== -1) {
        pars.splice(i, 1);
      }
    }

    url = urlparts[0] + '?' + pars.join('&');
    return url;
  } else {
    return url;
  }
}

document.querySelectorAll(".g13Check").forEach(function (event) {
  event.addEventListener('change', function (event) {
    let eventFilterType;
    let filterName = this.getAttribute('name');//$(this).attr("name");
    let filterValue = this.getAttribute('value');//$(this).attr("value");
    if (this.checked) { eventFilterType = 'checked'; } else { eventFilterType = 'unchecked'; }
    let urlParams = removeURLParameter(document.location.search, 'page');
    let urlObj = parseQueryG13(urlParams);
    urlObj = tune(urlObj);
    let baseUrl = window.location.href.split('?')[0];
    let finalTriggerUrl = g13ServiceQueryFliterJquery(urlObj, baseUrl, { name: filterName, value: filterValue, type: eventFilterType });
    //url change
    const baseSearchUrl = '/g-cloud/search';
    window.history.pushState({ "html": "", "pageTitle": "" }, "", `${baseSearchUrl}${finalTriggerUrl}`);


    // document.getElementById('searchResultsContainer').innerHTML = '';
    document.getElementById('mainLotandcategoryContainer').innerHTML = '';
    document.getElementById('paginationContainer').innerHTML = '';
    let slist = document.querySelector('.govuk-grid-sresult-right');
    slist.classList.add('loadingres')
    $('#criteriasavebtn').prop('disabled', true);
    const baseAPIUrl = '/g-cloud/search-api';
    $.ajax({
      url: `${baseAPIUrl}${finalTriggerUrl}`,
      type: "GET",
      contentType: "application/json",
    }).done(function (result) {

      $('#criteriasavebtn').prop('disabled', false);
      $('#criteriasavebtn').removeClass('govuk-button--disabled');
      $("#clearfilter").attr("href", result.clearFilterURL);
      if (result.data.meta.total > 0) {
        slist.classList.remove('loadingres')
        getCriterianDetails(result.data.meta.total);
        document.getElementById('rightSidefooterCotainer').innerHTML = '';


        var mainLothtml = '';
        if (result.njkDatas.haveLot) {
          mainLothtml = '<a class="govuk-link govuk-link-filter-main" href="/g-cloud/search">All Categories</a>';
        } else {
          mainLothtml += '<strong>All Categories</strong>'
          mainLothtml += '<ul class="govuk-list">'
          result.njkDatas.lotInfos.lots.forEach(lotwithcount => {
            mainLothtml += '<li><a data-name="lot" data-value="' + lotwithcount.slug + '" class="govuk-link clickCategory" style="cursor: pointer !important;">' + titleCase(lotwithcount.key) + ' (' + lotwithcount.count + ')</a></li>';
          })
          mainLothtml += '</ul>'
        }

        if (result.njkDatas.haveLot) {
          mainLothtml += '<ul class="govuk-list">'
          if (result.njkDatas.haveserviceCategory) {
            mainLothtml += '<a class="govuk-link govuk-link-filter-main" href="/g-cloud/search?lot=' + result.njkDatas.lotInfos.slug + '">' + result.njkDatas.lotInfos.label + '</a>'
          } else {
            mainLothtml += '<li><strong>' + titleCase(result.njkDatas.lotInfos.label) + ' </strong></li>'
          }
          if (result.njkDatas.lotInfos.currentparentCategory) {
            mainLothtml += '<p><a class="govuk-link govuk-link-filter-main" href="/g-cloud/search?lot=' + result.njkDatas.lotInfos.slug + '&serviceCategories=' + result.njkDatas.lotInfos.currentparentCategory + '">' + titleCase(result.njkDatas.lotInfos.currentparentCategory) + '</a></p>';
          }

          mainLothtml += '<li>';
          mainLothtml += '<ul class="govuk-list govuk-!-margin-top-0">';
          mainLothtml += '<ul class="govuk-list govuk-!-margin-top-0 govuk-!-margin-left-2">';
          result.njkDatas.lotInfos.subservices.forEach(subservice => {
            if (subservice.childrenssts) {
              if (result.njkDatas.lotInfos.currentparentCategory) {
                mainLothtml += '<li>';
                mainLothtml += '<ul class="govuk-list govuk-!-margin-top-0">';
                mainLothtml += '<ul class="govuk-list govuk-!-margin-top-0 govuk-!-margin-left-2">';
                subservice.childrens.forEach(child => {
                  if (child.value == result.njkDatas.lotInfos.currentserviceCategory) {
                    mainLothtml += '<li><strong>' + child.label + ' (' + child.count + ')</strong></li>';
                  } else {
                    var childVal = child.value.split(' ').join('+');
                    mainLothtml += '<li><a class="govuk-link parentCategory" data-name="' + child.name + '" data-value="' + childVal + '">' + child.label + '(' + child.count + ')</a></li>';
                  }
                });
                mainLothtml += '</ul>';
                mainLothtml += '</ul>';
              } else {
                mainLothtml += '<li>';
                mainLothtml += '<strong>' + titleCase(result.njkDatas.lotInfos.currentserviceCategory) + '</strong>';
                mainLothtml += '<ul class="govuk-list govuk-!-margin-top-0">';
                mainLothtml += '<ul class="govuk-list govuk-!-margin-top-0 govuk-!-margin-left-2">';
                subservice.childrens.forEach(child => {
                  var childVal = child.value.split(' ').join('+');
                  mainLothtml += '<li><a class="govuk-link parentCategory" data-name="' + child.name + '" data-value="' + childVal + '">' + child.label + '(' + child.count + ')</a></li>';
                });
                mainLothtml += '</ul>';
                mainLothtml += '</ul>';
              }
              mainLothtml += '</li>';
            } else {

              if (subservice.value == result.njkDatas.lotInfos.currentserviceCategory) {
                mainLothtml += '<li><strong>' + subservice.label + '</strong></li>';
              } else {
                if (subservice.name !== 'supportMultiCloud') {
                  var subserviceValue = subservice.value.split(' ').join('+');
                  mainLothtml += '<li><a class="govuk-link serviceCategory" data-name="' + subservice.name + '" data-value="' + subserviceValue + '">' + subservice.label + '(' + subservice.count + ')</a></li>';
                }
              }
            }
          });
          mainLothtml += '</ul>';
          mainLothtml += '</ul>';
          mainLothtml += '</li>';
          mainLothtml += '</ul>';
        }
        document.getElementById('mainLotandcategoryContainer').innerHTML = mainLothtml;

        var searchresultshtml = '';
        searchresultshtml += '<div class="govuk-grid-row">';
        searchresultshtml += '<div class="govuk-grid-column-full">';
        searchresultshtml += '<ul class="govuk-list govuk-supplier-list">';
        result.data.documents.forEach(element => {
          searchresultshtml += '<li class="app-search-result">'
            + '<h2 class="govuk-heading-s govuk-!-margin-bottom-1">'
            + '<a class="govuk-link" href="/g-cloud/services?id=' + element.id + '">' + element.serviceName + '</a>'
            + '</h2>'
            + '<p class="govuk-body govuk-!-font-size-16 govuk-!-font-weight-bold">' + element.supplierName + '</p>'
            + '<p class="govuk-body govuk-!-font-size-16">' + element.serviceDescription + '</p>'
            + '<ul aria-label="tags" class="govuk-list app-search-result__metadata">'
            + '<li class="govuk-!-display-inline govuk-!-padding-right-4">' + element.lotName + '</li>'
            + '<li class="govuk-!-display-inline">' + element.frameworkName + '</li>'
            + '</ul>'
            + '</li>';

        });
        searchresultshtml += '<div>';
        searchresultshtml += '<div>';
        searchresultshtml += '<ul>';
        document.getElementById('searchResultsContainer').innerHTML = searchresultshtml;

        var paginationHtml = ''
        paginationHtml += '<div class="govuk-grid-row">';
        paginationHtml += '<div class="govuk-grid-column-full">';
        paginationHtml += '<div class="govuk-grid-column-one-half">';
        paginationHtml += '<div>';
        paginationHtml += '&nbsp;';
        if (result.njkDatas.PrvePageUrl != '') {
          if (result.njkDatas.CurrentPageNumber != 1) {
            paginationHtml += '<p class="govuk-body govuk-!-margin-0">';
            paginationHtml += '<a href="/g-cloud/search?' + result.njkDatas.PrvePageUrl + '" class="govuk-link govuk-link--no-visited-state govuk-!-font-weight-bold govuk-!-font-size-24 paginationUrlClass">';
            paginationHtml += '<svg class="govuk-pagination__icon govuk-pagination__icon--prev" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13" fill="#1d70b8">';
            paginationHtml += '<path d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>';
            paginationHtml += '</svg>';
            paginationHtml += 'Previous Page</a>';
            paginationHtml += '</p>';
            paginationHtml += '<p class="govuk-body govuk-!-margin-0"><label class="govuk-!-font-size-16">' + (result.njkDatas.CurrentPageNumber - 1) + ' of ' + result.njkDatas.noOfPages + '</label></p>  ';
          }
        }
        paginationHtml += '</div>';
        paginationHtml += '</div>';

        paginationHtml += '<div class="govuk-grid-column-one-half govuk-!-text-align-right">';
        paginationHtml += '<div>';
        paginationHtml += '&nbsp;';
        if (result.njkDatas.NextPageUrl != '') {
          paginationHtml += '<p class="govuk-body govuk-!-margin-0">';
          paginationHtml += '<a href="/g-cloud/search?' + result.njkDatas.NextPageUrl + '" class="govuk-link govuk-link--no-visited-state govuk-!-font-weight-bold govuk-!-font-size-24 paginationUrlClass">';
          paginationHtml += '<svg class="govuk-pagination__icon govuk-pagination__icon--next" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13" fill="#1d70b8">';
          paginationHtml += '<path d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>';
          paginationHtml += '</svg>';
          paginationHtml += 'Next Page</a>';
          paginationHtml += '</p>';
        }
        //paginationHtml += '<p class="govuk-body govuk-!-margin-0"><label class="govuk-!-font-size-16">'+ (result.njkDatas.CurrentPageNumber + 1) +' of '+ result.njkDatas.noOfPages+'</label></p>';
        if (result.njkDatas.noOfPages == '0' || result.njkDatas.noOfPages == '1') {
          paginationHtml += '<p class="govuk-body govuk-!-margin-0"><label class="govuk-!-font-size-16">' + (result.njkDatas.CurrentPageNumber) + ' of 1</label></p>';
        } else {
          paginationHtml += '<p class="govuk-body govuk-!-margin-0"><label class="govuk-!-font-size-16">' + (result.njkDatas.CurrentPageNumber) + ' of ' + result.njkDatas.noOfPages + '</label></p>';
        }
        paginationHtml += '</div>';
        paginationHtml += '</div>';
        paginationHtml += '</div>';
        paginationHtml += '</div>';
        document.getElementById('paginationContainer').innerHTML = paginationHtml;
      } else {
        $('#criteriasavebtn').prop('disabled', true);
        slist.classList.remove('loadingres')
        getCriterianDetails(0);
        document.getElementById('searchResultsContainer').innerHTML = '';



        document.getElementById('rightSidefooterCotainer').innerHTML = '';
        var Noresulthtml = '';
        Noresulthtml += '<h3 class="govuk-heading-m">Improve your search results by:</h3>';
        Noresulthtml += '<ul class="govuk-list govuk-!-margin-top-0">';
        Noresulthtml += '<ul class="govuk-list govuk-!-margin-top-0 govuk-!-margin-left-2">';
        Noresulthtml += '</li>removing filters</li><br>';
        Noresulthtml += '</li>choosing a different category</li><br>';
        Noresulthtml += '</li>double-checking your spelling</li><br>';
        Noresulthtml += '</li>using fewer keywords</li><br>';
        Noresulthtml += '</li>searching for something less specific, you can refine your results later</li><br>';
        Noresulthtml += '</ul>';
        Noresulthtml += '</ul>';
        document.getElementById('rightSidefooterCotainer').innerHTML = Noresulthtml;
      }

      loadQuerySelector();

    }).fail((res) => {
      // let div_email = document.getElementById('eoi-lead-email');
      // div_email.innerText = '';
    })

    // window.location.href = `${baseUrl}${finalTriggerUrl}`;
  });
});

window.addEventListener('DOMContentLoaded', (event) => {

  if (document.getElementById('searchQuery')) document.getElementById('searchQuery').value = window.location.search;

  let criteriasavebtn = document.getElementById('criteriasavebtn');
  if (criteriasavebtn) {
    criteriasavebtn.addEventListener('click', function (e) {
      if (document.getElementById('searchQuery')) {
        document.getElementById('searchQuery').value = window.location.search;
      }
    })
  }

  document.querySelectorAll(".paginationUrlClass").forEach(el => {
    el.addEventListener('click', function (e) {
      let searchQueryUrl = "";
      let searchValue = document.getElementsByClassName("g13_search"); //$('.g13_search').val();
      let urlObj = parseQueryG13(document.location.search);
      urlObj = tune(urlObj);
      let DuplicateSearchObj = urlObj.find(o => o.key === 'q');
      if (DuplicateSearchObj) urlObj.splice(DuplicateSearchObj, 1);
      if (searchValue.length > 0) urlObj.unshift({ "key": "q", "value": encodeURIComponent(searchValue) })
      let baseUrl = window.location.href.split('?')[0];
      urlObj.forEach((el, i) => {
        let key = el.key;
        let value = el.value;
        if (i == 0) {
          if (key != '') {
            searchQueryUrl += `?${key}=${value}`;
          }
        } else {
          searchQueryUrl += `&${key}=${value}`;
        }
      });
      window.location.href = `${baseUrl}${searchQueryUrl}`;
    });
  });

  const removeErrorFieldsEoiTerms = () => {
    $('.govuk-error-message').remove();
    $('.govuk-form-group--error').removeClass('govuk-form-group--error')
    $('.govuk-error-summary').remove();
    $(".govuk-input").removeClass("govuk-input--error");
    $('.govuk-form-group textarea').removeClass('govuk-textarea--error');

  }

  var Searchinput = document.getElementsByClassName("g13_search")[0];
  if (Searchinput) {
    Searchinput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementsByClassName("g13_search_click")[0].click();
      }
    });
  }


  if (document.querySelector(".g13_search_click")) {

    document.querySelector(".g13_search_click").addEventListener('click', function () {
      removeErrorFieldsEoiTerms();
      let searchQueryUrl = "";
      document.getElementById('searchQuery').value = window.location.search;
      let searchValue = document.getElementsByClassName("g13_search");
      let definition_field = document.getElementById("with-hint");
      if (searchValue[0].value.length > 250) {
        ccsZaddErrorMessage(definition_field, 'Keywords must be 250 characters or fewer.');
        return false;
      }
      let urlParams = removeURLParameter(document.location.search, 'page');
      let urlObj = parseQueryG13(urlParams);
      urlObj = tune(urlObj);
      let DuplicateSearchObj = urlObj.find(o => o.key === 'q');
      if (DuplicateSearchObj) urlObj.splice(DuplicateSearchObj, 1);
      if (searchValue[0].value.length > 0) urlObj.unshift({ "key": "q", "value": encodeURIComponent(searchValue[0].value) })
      let baseUrl = window.location.href.split('?')[0];
      urlObj.forEach((el, i) => {
        let key = el.key;
        let value = el.value;
        if (i == 0) {
          if (key != '') {
            searchQueryUrl += `?${key}=${value}`;
          }
        } else {
          searchQueryUrl += `&${key}=${value}`;
        }
      });

      //url change
      const baseSearchUrl = '/g-cloud/search';
      window.history.pushState({ "html": "", "pageTitle": "" }, "", `${baseSearchUrl}${searchQueryUrl}`);

      document.getElementById('searchResultsContainer').innerHTML = '';
      document.getElementById('mainLotandcategoryContainer').innerHTML = '';
      document.getElementById('paginationContainer').innerHTML = '';
      const baseAPIUrl = '/g-cloud/search-api';
      let slist = document.querySelector('#searchResultsContainer');
      slist.classList.add('loadingres')
      $('#criteriasavebtn').prop('disabled', true);
      $.ajax({
        url: `${baseAPIUrl}${searchQueryUrl}`,
        type: "GET",
        contentType: "application/json",
      }).done(function (result) {
        $('#criteriasavebtn').prop('disabled', false);
        $('#criteriasavebtn').removeClass('govuk-button--disabled');
        $("#clearfilter").attr("href", result.clearFilterURL);
        if (result.data.meta.total > 0) {
          slist.classList.remove('loadingres')
          getCriterianDetails(result.data.meta.total);
          document.getElementById('rightSidefooterCotainer').innerHTML = '';

          var mainLothtml = '';
          if (result.njkDatas.haveLot) {
            mainLothtml = '<a class="govuk-link govuk-link-filter-main" href="/g-cloud/search">All Categories</a>';
          } else {
            mainLothtml += '<strong>All Categories</strong>'
            mainLothtml += '<ul class="govuk-list">'
            result.njkDatas.lotInfos.lots.forEach(lotwithcount => {
              mainLothtml += '<li><a data-name="lot" data-value="' + lotwithcount.slug + '" class="govuk-link clickCategory" style="cursor: pointer !important;">' + titleCase(lotwithcount.key) + ' (' + lotwithcount.count + ')</a></li>';
            })
            mainLothtml += '</ul>'
          }

          if (result.njkDatas.haveLot) {
            mainLothtml += '<ul class="govuk-list">'
            if (result.njkDatas.haveserviceCategory) {
              mainLothtml += '<a class="govuk-link govuk-link-filter-main" href="/g-cloud/search?lot=' + result.njkDatas.lotInfos.slug + '">' + result.njkDatas.lotInfos.label + '</a>'
            } else {
              mainLothtml += '<li><strong>' + titleCase(result.njkDatas.lotInfos.label) + ' </strong></li>'
            }
            if (result.njkDatas.lotInfos.currentparentCategory) {
              mainLothtml += '<p><a class="govuk-link govuk-link-filter-main" href="/g-cloud/search?lot=' + result.njkDatas.lotInfos.slug + '&serviceCategories=' + result.njkDatas.lotInfos.currentparentCategory + '">' + titleCase(result.njkDatas.lotInfos.currentparentCategory) + '</a></p>';
            }

            mainLothtml += '<li>';
            mainLothtml += '<ul class="govuk-list govuk-!-margin-top-0">';
            mainLothtml += '<ul class="govuk-list govuk-!-margin-top-0 govuk-!-margin-left-2">';
            result.njkDatas.lotInfos.subservices.forEach(subservice => {
              if (subservice.childrenssts) {
                if (result.njkDatas.lotInfos.currentparentCategory) {
                  mainLothtml += '<li>';
                  mainLothtml += '<ul class="govuk-list govuk-!-margin-top-0">';
                  mainLothtml += '<ul class="govuk-list govuk-!-margin-top-0 govuk-!-margin-left-2">';
                  subservice.childrens.forEach(child => {
                    if (child.value == result.njkDatas.lotInfos.currentserviceCategory) {
                      mainLothtml += '<li><strong>' + child.label + ' (' + child.count + ')</strong></li>';
                    } else {
                      var childVal = child.value.split(' ').join('+');
                      mainLothtml += '<li><a class="govuk-link parentCategory" data-name="' + child.name + '" data-value="' + childVal + '">' + child.label + '(' + child.count + ')</a></li>';
                    }
                  });
                  mainLothtml += '</ul>';
                  mainLothtml += '</ul>';
                } else {
                  mainLothtml += '<li>';
                  mainLothtml += '<strong>' + titleCase(result.njkDatas.lotInfos.currentserviceCategory) + '</strong>';
                  mainLothtml += '<ul class="govuk-list govuk-!-margin-top-0">';
                  mainLothtml += '<ul class="govuk-list govuk-!-margin-top-0 govuk-!-margin-left-2">';
                  subservice.childrens.forEach(child => {
                    var childVal = child.value.split(' ').join('+');
                    mainLothtml += '<li><a class="govuk-link parentCategory" data-name="' + child.name + '" data-value="' + childVal + '">' + child.label + '(' + child.count + ')</a></li>';
                  });
                  mainLothtml += '</ul>';
                  mainLothtml += '</ul>';
                }
                mainLothtml += '</li>';
              } else {

                if (subservice.value == result.njkDatas.lotInfos.currentserviceCategory) {
                  mainLothtml += '<li><strong>' + subservice.label + '</strong></li>';
                } else {
                  if (subservice.name !== 'supportMultiCloud') {
                    var subserviceValue = subservice.value.split(' ').join('+');
                    mainLothtml += '<li><a class="govuk-link serviceCategory" data-name="' + subservice.name + '" data-value="' + subserviceValue + '">' + subservice.label + '(' + subservice.count + ')</a></li>';
                  }
                }
              }
            });
            mainLothtml += '</ul>';
            mainLothtml += '</ul>';
            mainLothtml += '</li>';
            mainLothtml += '</ul>';
          }
          document.getElementById('mainLotandcategoryContainer').innerHTML = mainLothtml;

          var searchresultshtml = '';
          searchresultshtml += '<div class="govuk-grid-row">';
          searchresultshtml += '<div class="govuk-grid-column-full">';
          searchresultshtml += '<ul class="govuk-list govuk-supplier-list">';
          result.data.documents.forEach(element => {
            searchresultshtml += '<li class="app-search-result">'
              + '<h2 class="govuk-heading-s govuk-!-margin-bottom-1">'
              + '<a class="govuk-link" href="/g-cloud/services?id=' + element.id + '">' + element.serviceName + '</a>'
              + '</h2>'
              + '<p class="govuk-body govuk-!-font-size-16 govuk-!-font-weight-bold">' + element.supplierName + '</p>'
              + '<p class="govuk-body govuk-!-font-size-16">' + element.serviceDescription + '</p>'
              + '<ul aria-label="tags" class="govuk-list app-search-result__metadata">'
              + '<li class="govuk-!-display-inline govuk-!-padding-right-4">' + element.lotName + '</li>'
              + '<li class="govuk-!-display-inline">' + element.frameworkName + '</li>'
              + '</ul>'
              + '</li>';

          });
          searchresultshtml += '<div>';
          searchresultshtml += '<div>';
          searchresultshtml += '<ul>';
          document.getElementById('searchResultsContainer').innerHTML = searchresultshtml;

          var paginationHtml = ''
          paginationHtml += '<div class="govuk-grid-row">';
          paginationHtml += '<div class="govuk-grid-column-full">';
          paginationHtml += '<div class="govuk-grid-column-one-half">';
          paginationHtml += '<div>';
          paginationHtml += '&nbsp;';
          if (result.njkDatas.PrvePageUrl != '') {
            if (result.njkDatas.CurrentPageNumber != 1) {
              paginationHtml += '<p class="govuk-body govuk-!-margin-0">';
              paginationHtml += '<a href="/g-cloud/search?' + result.njkDatas.PrvePageUrl + '" class="govuk-link govuk-link--no-visited-state govuk-!-font-weight-bold govuk-!-font-size-24 paginationUrlClass">';
              paginationHtml += '<svg class="govuk-pagination__icon govuk-pagination__icon--prev" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13" fill="#1d70b8">';
              paginationHtml += '<path d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>';
              paginationHtml += '</svg>';
              paginationHtml += 'Previous Page</a>';
              paginationHtml += '</p>';
              paginationHtml += '<p class="govuk-body govuk-!-margin-0"><label class="govuk-!-font-size-16">' + (result.njkDatas.CurrentPageNumber - 1) + ' of ' + result.njkDatas.noOfPages + '</label></p>  ';
            }
          }
          paginationHtml += '</div>';
          paginationHtml += '</div>';

          paginationHtml += '<div class="govuk-grid-column-one-half govuk-!-text-align-right">';
          paginationHtml += '<div>';
          paginationHtml += '&nbsp;';
          if (result.njkDatas.NextPageUrl != '') {
            paginationHtml += '<p class="govuk-body govuk-!-margin-0">';
            paginationHtml += '<a href="/g-cloud/search?' + result.njkDatas.NextPageUrl + '" class="govuk-link govuk-link--no-visited-state govuk-!-font-weight-bold govuk-!-font-size-24 paginationUrlClass">';
            paginationHtml += '<svg class="govuk-pagination__icon govuk-pagination__icon--next" xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true" focusable="false" viewBox="0 0 15 13" fill="#1d70b8">';
            paginationHtml += '<path d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>';
            paginationHtml += '</svg>';
            paginationHtml += 'Next Page</a>';
            paginationHtml += '</p>';
          }
          if (result.njkDatas.noOfPages == '0' || result.njkDatas.noOfPages == '1') {
            paginationHtml += '<p class="govuk-body govuk-!-margin-0"><label class="govuk-!-font-size-16">' + (result.njkDatas.CurrentPageNumber) + ' of 1</label></p>';
          } else {
            paginationHtml += '<p class="govuk-body govuk-!-margin-0"><label class="govuk-!-font-size-16">' + (result.njkDatas.CurrentPageNumber) + ' of ' + result.njkDatas.noOfPages + '</label></p>';
          }
          paginationHtml += '</div>';
          paginationHtml += '</div>';
          paginationHtml += '</div>';
          paginationHtml += '</div>';
          document.getElementById('paginationContainer').innerHTML = paginationHtml;
        } else {
          $('#criteriasavebtn').prop('disabled', true);
          document.getElementById('searchResultsContainer').innerHTML = '';
          getCriterianDetails(0);
          slist.classList.remove('loadingres')

          document.getElementById('rightSidefooterCotainer').innerHTML = '';
          var Noresulthtml = '';
          Noresulthtml += '<h3 class="govuk-heading-m">Improve your search results by:</h3>';
          Noresulthtml += '<ul class="govuk-list govuk-!-margin-top-0">';
          Noresulthtml += '<ul class="govuk-list govuk-!-margin-top-0 govuk-!-margin-left-2">';
          Noresulthtml += '</li>removing filters</li><br>';
          Noresulthtml += '</li>choosing a different category</li><br>';
          Noresulthtml += '</li>double-checking your spelling</li><br>';
          Noresulthtml += '</li>using fewer keywords</li><br>';
          Noresulthtml += '</li>searching for something less specific, you can refine your results later</li><br>';
          Noresulthtml += '</ul>';
          Noresulthtml += '</ul>';
          document.getElementById('rightSidefooterCotainer').innerHTML = Noresulthtml;
        }
        loadQuerySelector();
      }).fail((res) => {
      })
    });
  }
});


function loadQuerySelector() {
  document.querySelectorAll(".clickCategory").forEach(function (event) {
    event.addEventListener('click', function () {
      let eventFilterType = 'categoryClicked';
      let filterName = this.getAttribute("data-name");
      let filterValue = this.getAttribute("data-value");
      let urlObj = parseQueryG13(document.location.search);
      urlObj = tune(urlObj);
      let baseUrl = window.location.href.split('?')[0];
      let finalTriggerUrl = g13ServiceQueryFliterJquery(urlObj, baseUrl, { name: filterName, value: filterValue, type: eventFilterType });
      window.location.href = `${baseUrl}${finalTriggerUrl}`;
    });
  });

  if (document.querySelectorAll('.serviceCategory')) {
    document.querySelectorAll(".serviceCategory").forEach(function (event) {
      event.addEventListener('click', function () {
        let eventFilterType = 'serviceCategoryClicked';
        let filterName = this.getAttribute('data-name');
        let filterValue = this.getAttribute('data-value');
        let urlObj = parseQueryG13(document.location.search);
        urlObj = tune(urlObj);

        let finalObj = [];
        urlObj.find((el) => {
          if (el.key !== 'serviceCategories') { finalObj.push(el); }
        });
        urlObj = finalObj;
        urlObj.push({ "key": "serviceCategories", "value": filterValue });

        let baseUrl = window.location.href.split('?')[0];
        let finalTriggerUrl = g13ServiceQueryFliterJquery(urlObj, baseUrl, { name: filterName, value: filterValue, type: eventFilterType });
        window.location.href = `${baseUrl}${finalTriggerUrl}`;
      });
    });
  }

  if (document.querySelectorAll('.parentCategory')) {
    document.querySelectorAll(".parentCategory").forEach(function (event) {
      event.addEventListener('click', function () {
        let eventFilterType = 'parentCategoryClicked';
        let filterName = this.getAttribute('data-name');
        let filterValue = this.getAttribute('data-value');
        let urlObj = parseQueryG13(document.location.search);
        urlObj = tune(urlObj);

        let condtionParentCat = urlObj.find(el => el.key === 'parentCategory');
        if (condtionParentCat === undefined) {
          let serviceCategory = urlObj.find(el => el.key === 'serviceCategories');
          urlObj.push({ "key": "parentCategory", "value": serviceCategory.value });
          urlObj.splice(urlObj.findIndex(({ key }) => key == "serviceCategories"), 1);
          urlObj.push({ "key": "serviceCategories", "value": filterValue });
        } else {
          let finalObj = [];
          urlObj.find((el) => {
            if (el.key !== 'serviceCategories') { finalObj.push(el); }
          });
          urlObj = finalObj;
          urlObj.push({ "key": "serviceCategories", "value": filterValue });
        }

        let baseUrl = window.location.href.split('?')[0];
        let finalTriggerUrl = g13ServiceQueryFliterJquery(urlObj, baseUrl, { name: filterName, value: filterValue, type: eventFilterType });
        window.location.href = `${baseUrl}${finalTriggerUrl}`;
      });
    });
  }
}

document.addEventListener('readystatechange', event => {
  if (event.target.readyState === "complete") {
    let queryParamObj = parseQueryG13(document.location.search);
    queryParamObj = tune(queryParamObj);

    queryParamObj.forEach((el, i) => {
      console.log(el);
      //Search
      if (el.key === 'q') { $('.g13_search').val(decodeURIComponent(el.value)); }
      $('.g13Check').each(function () {
        if ($(this).attr('name') == el.key && $(this).val() == el.value) {
          $(this).attr("checked", "checked");
        }
      });
    });
    // total results
    var totalResult = $('#totalResult').attr('data-value');

    getCriterianDetails(totalResult);

  }
});

function getCriterianDetails(totalresult = 0) {


  let rows_selected = [];
  $(".g13Check:checked").each(function () {
    var $this = $(this);
    rows_selected.push({
      title: $this.attr('data-title'),
      name: $this.attr('data-name'),
    });
  });

  const groupBy = (array, key) => {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      return result;
    }, {});
  };
  const criteria = groupBy(rows_selected, 'title');
  let criteriaDetails = '<b class="govuk-!-font-size-48">' + totalresult + '</b> results found';

  let queryParamObj = parseQueryG13(document.location.search);
  queryParamObj = tune(queryParamObj);


  let search = queryParamObj.filter(el => el.key === 'q');
  if (search.length > 0) {
    criteriaDetails += ' containing <b>' + decodeURIComponent(search[0].value) + '</b>';
  }

  let lot = queryParamObj.filter(el => el.key === 'lot');
  if (lot.length > 0) {
    criteriaDetails += ' in <b>' + capitalize(lot[0].value.replace("-", " ")) + '</b>';
  } else {
    criteriaDetails += ' in <b>All Categories</b>';
  }

  let serviceCategories = queryParamObj.filter(el => el.key === 'serviceCategories');
  if (serviceCategories.length > 0) {
    criteriaDetails += ' in the category <b>' + capitalize(serviceCategories[0].value.replace("+", " ")) + '</b>';
  }


  Object.keys(criteria).forEach(key => {
    if (key !== undefined) {
      criteriaDetails += ', where <b>' + capitalize(key) + '</b> is ';
      let values = [];
      for (let index = 0; index < criteria[key].length; index++) {
        values.push('<b>' + capitalize(criteria[key][index].name) + '</b>');
      }
      criteriaDetails += values.join(" and ");

    }
  });
  $('#criteriandetails').html(criteriaDetails);
  $('#criteriadetailsform').val(criteriaDetails.replace('govuk-!-font-size-48', 'govuk-!-font-size-24'));


}

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}


document.querySelectorAll(".dos_evaluate_supplier").forEach(function (event) {
  event.addEventListener('change', function (event) {
    var evaluateSupplier = $('.dos_evaluate_supplier:checked').map(function () {
      return this.value;
    }).get().join(', ');
    $('#invite_suppliers').val(evaluateSupplier);
  })

  var evaluateSupplier = $('.dos_evaluate_supplier:checked').map(function () {
    return this.value;
  }).get().join(', ');
  $('#invite_suppliers').val(evaluateSupplier);
})

document.querySelectorAll(".dos_evaluate_supplier").forEach(function (event) {
  event.addEventListener('change', function (event) {
    var evaluateSupplier = $('.dos_evaluate_supplier:checked').map(function () {
      return this.value;
    }).get().join(', ');
    $('#invite_suppliers').val(evaluateSupplier);
  })

  var evaluateSupplier = $('.dos_evaluate_supplier:checked').map(function () {
    return this.value;
  }).get().join(', ');
  $('#invite_suppliers').val(evaluateSupplier);
})

    // document.querySelectorAll(".individualScoreBtn").forEach(function(event) {
    //   event.addEventListener('click', function(event) {
    //     var bodytg = document.body;
    //     bodytg.classList.add("pageblur");
    //   });
    // });

    

document.querySelectorAll("#invite_short_list_suppliers_btn").forEach(function (event) {
  event.addEventListener('click', function (event) {
    document.getElementById("invite_short_list_suppliers").submit();
  })
})


// document.querySelectorAll(".individualScoreBtn").forEach(function(event) {
    //   event.addEventListener('click', function(event) {
    //     var bodytg = document.body;
    //     bodytg.classList.add("pageblur");
    //   });
    // });

    //loaderClick
    document.querySelectorAll(".loaderClick").forEach(function(event) {
      event.addEventListener('click', function(event) {
        var bodytg = document.body;
        bodytg.classList.add("pageblur");
      });
    });

    //startEvalDos6Btn
    // document.querySelectorAll(".startEvalDos6Btn").forEach(function(event) {
    //   event.addEventListener('click', function(event) {
    //     document.querySelector(".loderMakeRes").innerHTML = "Please Wait..";
    //     var bodytg = document.body;
    //     bodytg.classList.add("pageblur");
    //   });
    // });

    //startEvalDos6Btn
    document.querySelectorAll(".startEvalDos6Btn").forEach(function(event) {
      event.addEventListener('click', function(event) {
        document.querySelector(".loderMakeRes").innerHTML = '<p class="govuk-body loader-desc-hdr">Retrieving supplier responses</p><p class="govuk-body loader-desc">Please allow some time for this operation to complete. Once finished, you will be able to download supplier responses. We suggest taking a break in the meantime and checking back in a few minutes. Please keep the tab open while this process is taking place.</p>';
        var bodytg = document.body;
        bodytg.classList.add("pageblur");
      });
    });

document.querySelectorAll(".download").forEach(function (event) {
  event.addEventListener('click', function (event) {
    var $this = $(this);
    var url = $this.attr('data-url');
    $.ajax({
      url: url,
      type: "GET",
      contentType: "application/json",
      xhrFields: {
        responseType: 'blob' // to avoid binary data being mangled on charset conversion
      },
      beforeSend: function () {
        document.querySelector(".loderMakeRes").innerHTML = "<p class='govuk-body loader-desc-hdr'>Downloading supplier responses</p><p class='govuk-body loader-desc'>Please allow some time for this operation to complete. Once finished, your downloaded responses can be found in the 'Downloads' section of your browser.  We suggest taking a break in the meantime and checking back in a few minutes. Please keep the tab open while this process is taking place.</p>";
        var bodytg = document.body;
        bodytg.classList.add("pageblur");
      },
      success: function (blob, status, xhr) {
        // check for a filename
        var bodytg = document.body;
        bodytg.classList.remove("pageblur");
        var filename = "";
        var disposition = xhr.getResponseHeader('Content-Disposition');
        if (disposition && disposition.indexOf('attachment') !== -1) {
          var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          var matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
          window.navigator.msSaveBlob(blob, filename);
        } else {
          var URL = window.URL || window.webkitURL;
          var downloadUrl = URL.createObjectURL(blob);
          if (filename) {
            // use HTML5 a[download] attribute to specify filename
            var a = document.createElement("a");
            // safari doesn't support this yet
            if (typeof a.download === 'undefined') {
              window.location.href = downloadUrl;
            } else {
              a.href = downloadUrl;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
            }
          } else {
            window.location.href = downloadUrl;
          }
          
          setTimeout(function () { URL.revokeObjectURL(downloadUrl); window.location.reload(); }, 1000); // cleanup
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        var bodytg = document.body;
        bodytg.classList.remove("pageblur");
        // console.log(jqXHR.status)
      }


    });
  })
});

/**
 * Find the supplier with the highest score, and if a low score supplier is chosen, show the popup and obtain buyer confirmation.
 */
if (document.querySelectorAll('.suppliersAwardConfirm')) {
  let scores = [];
  document.querySelectorAll(".suppliersAwardConfirm").forEach(function (event) {
    scores.push(event.getAttribute('data-value'))
    let maxScore = Math.max.apply(Math, scores);
    event.addEventListener('click', function () {
      let redirectUrl = this.getAttribute('data-url');
      let supplierId = this.getAttribute('data-name');
      let supplier = document.querySelector(`[data-type="supplierName_${supplierId}"]`);
      let score = this.getAttribute('data-value');
      if (score < maxScore) {
        showSuppliersAwardPopup(supplier.textContent, redirectUrl)
      } else {
        window.location.href = redirectUrl;
      }
    })
  })
}
DelGCButtons = document.querySelectorAll('.confir-all-supplier-popup');
  DelGCButtons.forEach(st => {
    st.addEventListener('click', e => {
      e.preventDefault();
      urldel = e.target.getAttribute('data-link');
      const openpopGC = document.querySelector('.backdrop-supplierConfirmAllPopup')
      openpopGC.classList.add('showpopup');
      $(".dialog-close-supplierConfirmAllPopup").on('click', function(){
        openpopGC.classList.remove('showpopup');
      });
      $(".close-dialog-close").on('click', function(){
        openpopGC.classList.remove('showpopup');
      });
      deconf = document.getElementById('redirect-button-supplierConfirmAllPopup');
      deconf.addEventListener('click', ev => {
        openpopGC.classList.remove('showpopup');
        var bodytg = document.body;
        bodytg.classList.add("pageblur");
        document.location.href="/evaluate-confirm"
      });
    });
  });

  let countOfpublishBtn = 0;
  // $('.oneTimeClick').click(function(e) {
  //   $(this).attr("disabled", true);
  //   if(countOfpublishBtn == 0) {
  //     $(this).parents('form').submit();
  //   }
  //   countOfpublishBtn++;
  // });
  if(document.forms.length > 0) {
    const publishDateMismatchFormEvent = document.forms[0].id;
    if(publishDateMismatchFormEvent == 'ccs_eoi_publish_form' || publishDateMismatchFormEvent == 'ccs_rfp_publish_form' || publishDateMismatchFormEvent == 'ccs_rfi_publish_form') {

      let checkBoxConfirmation;
      if(publishDateMismatchFormEvent == 'ccs_rfp_publish_form') {
        checkBoxConfirmation = 'rfp_publish_confirmation';
      }else if(publishDateMismatchFormEvent == 'ccs_rfi_publish_form'){
        checkBoxConfirmation = 'rfi_publish_confirmation';
      }else if(publishDateMismatchFormEvent == 'ccs_eoi_publish_form'){
        checkBoxConfirmation = 'eoi_publish_confirmation';
      }



      document.querySelectorAll("#"+publishDateMismatchFormEvent).forEach(function (event) {
        event.addEventListener('submit', function (event) {
          event.preventDefault();
          if (!document.getElementById(checkBoxConfirmation).checked) {
            $('#checkbox_error_summary').removeClass('hide-block');
            $('.govuk-error-summary__title').text('There is a problem');
            $("#checkbox_error_summary_list").html('<li><a href="#'+checkBoxConfirmation+'">You must check this box to confirm that you have read and confirm the statements above</a></li>');
            $('html, body').animate({ scrollTop: 0 }, 'fast');
            return false;
          } 

          document.querySelector(".loderMakeRes").innerHTML = '<p class="govuk-body loader-desc-hdr"></p><p class="govuk-body loader-desc">Please wait...</p>';
          var bodytg = document.body;
          bodytg.classList.add("pageblur");

         $.ajax({
            url: `/rfp/publish_date_mismatch`,
            type: "GET",
            contentType: "application/json",
          }).done(function (result) {
            var bodytg = document.body;
            bodytg.classList.remove("pageblur");
            if(result.warning) {
              document.getElementById('redirect-button-publishTimelineMismatch').innerHTML = 'Reset timeline';
              const openpopGC = document.querySelector('.backdrop-publishTimelineMismatch')
              openpopGC.classList.add('showpopup');
              $(".dialog-close-publishTimelineMismatch").on('click', function(){
                timelineRevertCancel();
                openpopGC.classList.remove('showpopup');
              });
              $(".close-dialog-close").on('click', function(){
                openpopGC.classList.remove('showpopup');
              });
              deconf = document.getElementById('redirect-button-publishTimelineMismatch');
              deconf.addEventListener('click', ev => {
                document.querySelector(".loderMakeRes").innerHTML = '<p class="govuk-body loader-desc-hdr"></p><p class="govuk-body loader-desc">Please wait...</p>';
                var bodytg = document.body;
                bodytg.classList.add("pageblur");
                openpopGC.classList.remove('showpopup');
                if(result.eventType == 'FC') {
                  window.location.href = window.location.origin+'/rfp/response-date';
                }
                if(result.eventType == 'RFI') {
                  window.location.href = window.location.origin+'/rfi/response-date';
                }
                if(result.eventType == 'EOI') {
                  window.location.href = window.location.origin+'/eoi/response-date';
                }
                if(result.eventType == 'DA') {
                  window.location.href = window.location.origin+'/da/response-date';
                }

                //  window.location.href = window.location.origin+'/rfi/rfi-tasklist';
              });
              return false;
            } else {
              $('.oneTimeClick').attr("disabled", true);
              if(countOfpublishBtn == 0) {
                document.getElementById(publishDateMismatchFormEvent).submit();
                return true;
              } else {
                return false;
              }
            }
          }).fail((res) => {
            console.log(res);
          })
        })
      });

    }
  }

  function timelineRevertCancel() {
    $.ajax({
      url: `/rfp/publish_date_mismatch/cancel`,
      type: "GET",
      contentType: "application/json",
    }).done(function (res) {
    });
  }

  if (document.getElementsByClassName('backdrop-Qanda').length > 0) {
    $(".dialog-close-Qanda").remove();
    $(".dialog-close-Qanda").remove();
    var elGo = document.querySelector(".backdrop-Qanda").querySelector(".nodeDialogTitle");
    let divFirst = document.createElement('div');
    divFirst.className = "govuk-form-group";
    elGo.after(divFirst)

    let QAInput = document.createElement('input');
    QAInput.type  = 'email';
    QAInput.name  = 'qa_email';
    QAInput.id  = 'qa_email';
    QAInput.placeholder  = 'Email';
    QAInput.className = "govuk-input govuk-input--width-20";
    document.querySelector(".govuk-form-group").append(QAInput);

    const openpopGC = document.querySelector('.backdrop-Qanda')
    openpopGC.classList.add('showpopup');

    $(".dialog-close-Qanda").on('click', function(){
      return false;
      // openpopGC.classList.remove('showpopup');
    });
    $(".close-dialog-close").on('click', function(){
      // openpopGC.classList.remove('showpopup');
      return false;
    });
    deconf = document.getElementById('redirect-button-Qanda');
    deconf.addEventListener('click', ev => {
      var validRegex = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;
      let inputVal = $("#qa_email").val();
      console.log(inputVal.match(validRegex));
      if(inputVal == '') {
        QAInputErrorRemove();
        QAInputError('Enter the email');
      } else if (!validateEmail(inputVal)) {
        QAInputErrorRemove();
        QAInputError('Enter the valid email');
      } else {
        QAInputErrorRemove();
        //Form submission
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        // console.log(`/qa/event-suppliers?id=${urlParams.get('id')}&prId=${urlParams.get('prId')}&email=${inputVal}`);
        window.location.href = `/qa/event-suppliers?id=${urlParams.get('id')}&prId=${urlParams.get('prId')}&email=${inputVal}`;
      }

    });
    function QAInputErrorRemove() {
        $('.govuk-form-group').removeClass("govuk-form-group--error");
        $("#qa_email").prev('span').remove();
        $("#qa_email").removeClass("govuk-input--error");
    }
    function QAInputError(msg) {
        $('.govuk-form-group').addClass("govuk-form-group--error");
        $("#qa_email").val('');
        $("#qa_email").focus();
        $("#qa_email").before(`<span class="govuk-error-message">${msg}</span>`);
        $("#qa_email").addClass("govuk-input--error");
    }
    const validateEmail = (email) => {
      return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    };
  }

  CloseEOI = document.querySelectorAll('.closeEOI-popup');
  CloseEOI.forEach(st => {
    st.addEventListener('click', e => {
      e.preventDefault();
      // deletePost(e.target.getAttribute('data-link'));
      urldel = e.target.getAttribute('data-link');
      const openpopEOI = document.querySelector('.backdrop-close_EOI')
      openpopEOI.classList.add('showpopup');
      $(".dialog-close-close_EOI").on('click', function(){
        openpopEOI.classList.remove('showpopup');
      });
      $(".close-dialog-close").on('click', function(){
        openpopEOI.classList.remove('showpopup');
      });
      deconf = document.getElementById('redirect-button-close_EOI');
      deconf.addEventListener('click', ev => {
        openpopEOI.classList.remove('showpopup');
       
        window.location.href = window.location.origin+urldel;
      });
    });
  });

  CloseRFI = document.querySelectorAll('.closeRFI-popup');
  CloseRFI.forEach(st => {
    st.addEventListener('click', e => {
      e.preventDefault();
      // deletePost(e.target.getAttribute('data-link'));
      urldel = e.target.getAttribute('data-link');
      const openpopRFI = document.querySelector('.backdrop-close_RFI')
      openpopRFI.classList.add('showpopup');
      $(".dialog-close-close_RFI").on('click', function(){
        openpopRFI.classList.remove('showpopup');
      });
      $(".close-dialog-close").on('click', function(){
        openpopRFI.classList.remove('showpopup');
      });
      deconf = document.getElementById('redirect-button-close_RFI');
      deconf.addEventListener('click', ev => {
        openpopRFI.classList.remove('showpopup');
       
        window.location.href = window.location.origin+urldel;
      });
    });
  });
