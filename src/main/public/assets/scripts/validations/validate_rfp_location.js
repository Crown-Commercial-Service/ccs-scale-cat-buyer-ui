let notApplicableTag = "No specific location, for example they can work remotely";

const ccsZvalidateRfpLocation = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];
  let errMsg = "You must select at least one region where your staff will be working, or  the “No specific location....";

  let hiddenQuestionElement = document.getElementById("question_id");
  if (hiddenQuestionElement !== null) {
    if (hiddenQuestionElement.value == "Question 10") {
      errMsg = "You must select which project phases you need resource for, or confirm if this does not apply to your project.";
    }
  }

  fieldCheck = ccsZisOptionChecked("required_locations", errMsg);
  if (fieldCheck !== true) errorStore.push(fieldCheck);

  if (errorStore.length === 0) document.forms["rfp_location"].submit(); //The Location page is mandatory 
  else ccsZPresentErrorSummary(errorStore);
};

const ccsZvalidateChangeRfpLocation = (event) => {
  // validation for these inputs only
  event.preventDefault();
  let inputs;
  let container = document.getElementById('rfp_location');
  // let noApplicable = document.getElementById('required_locations-6');
  inputs = container.getElementsByTagName('input');
  for (let index = 0; index < inputs.length; ++index) {
    if (event.target.id !== inputs[index].id)
      inputs[index].checked = false;
    // if (event.target.id !== 'required_locations-6')
    //   noApplicable.checked = false;
    // if (event.target.id === 'required_locations-6') {
    //   if (inputs[index].id !== 'required_locations-6')
    //     inputs[index].checked = false;
    // }
  }

}



document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("rfp_location") !== null) {

    let allCheckbox = document.getElementById("required_locations-14"),
      locationCheckboxes = document.querySelectorAll("input[name='required_locations']");

    if (allCheckbox != undefined && allCheckbox.checked) {
      locationCheckboxes.forEach((cb) => {

        if (cb.value != notApplicableTag) cb.disabled = true;

      });
    }

    document.getElementById("required_locations-14").addEventListener('change', () => {
      let allCb = document.getElementById("required_locations-14"),
        locationCheckboxes = document.querySelectorAll("input[name='required_locations']");

      locationCheckboxes.forEach((cb) => {

        if (allCb.checked && cb.value != notApplicableTag) {
          cb.checked = false;
          cb.disabled = true;
        }

        if (!allCb.checked && cb.value != notApplicableTag) {
          cb.disabled = false;
        }

      });

    });
  }
});
