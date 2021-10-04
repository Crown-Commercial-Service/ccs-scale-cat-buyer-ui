/**
 * Find an address by searching on postcode
 *
 * Uses the getAddress() API (https://getaddress.io/)
 * This is currently on a 30 day trial (which may be extended),
 * but should be swapped out when it expires for one that is
 * registered with someone who still works on the project.
 *
 * See https://documentation.getaddress.io/ for more, including
 * error codes and test postcodes that don't count towards the
 * daily request limit.
 */

const ccsZFindAddress = (event) => {
  event.preventDefault();

  let fieldCheck = "",
    errorStore = [];

  fieldCheck = ccsZvalidateWithRegex( "rfi_proj_address-postcode", "Enter a valid postcode", /A([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})$/ );
  if (fieldCheck !== true) {
    // if we have an invalid postcode, show an error
    ccsZPresentErrorSummary([["rfi_proj_address-postcode", "Enter a valid postcode"]]);
  } else {
    // if we have a valid postcode, remove any error mssages
    ccsZremoveErrorMessage(document.getElementById("rfi_proj_address-postcode"));
    const existingSummary = document.querySelector(".govuk-error-summary");
    if (existingSummary !== null) existingSummary.parentNode.removeChild(existingSummary);

    // ... and get on with looking up an address...
    let myPostCode = document.getElementById("rfi_proj_address-postcode").value.trim();

    fetch(`https://api.getAddress.io/find/${myPostCode}?api-key=KYy-NhuV8UeHZ0AIAiwf4w32615`)
      .then(response => {

        if (!response.ok) {
          let errMsg = "Unknown error";
          if (response.status === 500) errMsg = "Internal server error";
          else if (response.status === 429) errMsg = "API request limit exeeded";
          else if (response.status === 404) errMsg = "No address found";
          else if (response.status === 400) errMsg = "Invalid postcode";
          else if (response.status === 401) errMsg = "API key is not valid";
          else if (response.status === 403) errMsg = "You do not have permission to access to the resource";

          throw new Error(`HTTP request error: ${response.status} - ${errMsg}`);
        }

        return response.json();
      })
      .then(data => {
        // empty the drop-down and then re-populate it

        let mySelector = document.getElementById("rfi_proj_address-address"),
          selectedPostcode = document.getElementById("display_postcode");

        selectedPostcode.innerText = myPostCode;
        document.getElementById("ccs_postcode_holder").classList.remove("ccs-dynaform-hidden");
        document.getElementById("rfi_proj_address-postcode").classList.add("ccs-dynaform-hidden");
        document.getElementById("rfi_find_address_btn").classList.add("ccs-dynaform-hidden");

        mySelector.options.length = 0;

        var firstOp = document.createElement('option');
        firstOp.value = "";
        firstOp.innerHTML = `${data.addresses.length} addresses found`;
        mySelector.appendChild(firstOp);

        data.addresses.forEach((addy) => {

          var opt = document.createElement('option');
          opt.value = addy;
          opt.innerHTML = addy;
          mySelector.appendChild(opt);

        });

        mySelector.parentNode.classList.remove("ccs-dynaform-hidden");

      })
      .catch(error => {
        console.error('There was a problem with address lookup:', error);
      });
  }
};

/* when an address is selected, enable the submit button */
const ccsZFoundAddress = (event) => {
  let saveButton = document.getElementById("rfi_save_address_btn");
  saveButton.disabled = false;
  saveButton.setAttribute('aria-disabled', false);
  saveButton.classList.remove("govuk-button--disabled");
};

/* hide the address drop-down select when the page first loads */
const ccsZInitAddressFinder = (element) => {
  document.getElementById(element).parentNode.classList.add("ccs-dynaform-hidden");
};

/* show, hide, disable or empty various elements when the user chooses to
 * change the postcode */
const ccsZResetAddress = (event) => {
  event.preventDefault();

  document.getElementById("ccs_postcode_holder").classList.add("ccs-dynaform-hidden");
  document.getElementById("rfi_proj_address-postcode").classList.remove("ccs-dynaform-hidden");
  document.getElementById("rfi_find_address_btn").classList.remove("ccs-dynaform-hidden");
  document.getElementById("rfi_proj_address-address").parentNode.classList.add("ccs-dynaform-hidden");
  document.getElementById("rfi_proj_address-postcode").value = "";
  document.getElementById("rfi_proj_address-postcode").focus();

  let saveButton = document.getElementById("rfi_save_address_btn");
  saveButton.disabled = true;
  saveButton.setAttribute('aria-disabled', true);
  saveButton.classList.add("govuk-button--disabled");
};
