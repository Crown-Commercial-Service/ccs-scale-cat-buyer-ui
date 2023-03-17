let notApplicableTag = "No specific location, for example they can work remotely";

document.addEventListener('DOMContentLoaded', () => {
  let noLocationtagid;
  // console.log('va from rfi onload>>>>');
  nospeclocationCheckboxes = document.querySelectorAll("input[name='required_locations']");
  nospeclocationCheckboxes.forEach((cl) => {
    console.log("cl.value",cl.value);
    if(cl.value === "No specific location (for example they can work remotely)") {
      noLocationtagid = cl.id;
      // console.log('va from rfi onload>>>>',noLocationtagid);
    }
    
  })
  if (noLocationtagid !== undefined) {
    let allCheckbox = document.getElementById(noLocationtagid),
      locationCheckboxes = document.querySelectorAll("input[name='required_locations']");

    // if (allCheckbox.checked) {
    //   locationCheckboxes.forEach((cb) => {

    //     if (cb.value != allCheckbox.value) cb.disabled = true;

    //   });
    // }
  }


  if (document.getElementById("rfp_location") !== null) {
    
    var chkds = $("input[name='required_locations']:checkbox");

    if (document.querySelector(".dos6_vetting_change") !== null) {
    if(document.querySelector(".dos6_vetting_change").checked){
      console.log("CHECKEDDD BY LAST")
      const elementsTemp = document.querySelectorAll(".dos6_vetting");
      elementsTemp.forEach(function (elementsTemp) {
        elementsTemp.checked = false;
        elementsTemp.disabled = true;
        //$('#rfp_prob_statement_s').val('');
     $('.main_rfp_prob_statement_s').hide();
       });
    }else{

      if (chkds.is(":checked"))  {
        $('.main_rfp_prob_statement_s').fadeIn();
      } else {
        
          $('.main_rfp_prob_statement_s').hide();
        }
    }
  }


   
      
    
   
    // if(document.querySelector("#required_locations").checked){
      
    //   $('.main_rfp_prob_statement_s').fadeIn();
    // }else{
      
    //   $('.main_rfp_prob_statement_s').hide();
    // }
  
    // if(document.querySelector("#required_locations").checked){
    //   $('.main_rfp_prob_statement_s').fadeIn();
     
    // }else{
      
    //   $('.main_rfp_prob_statement_s').hide();
    // }


  }
})

$('input[type="checkbox"]').on('change', function(e) {
  var val = [];
        $(':checkbox:checked').each(function(i){
          val[i] = $(this).val();
        });

  if (val.includes("No security clearance needed")) {
    $('.main_rfp_prob_statement_s').hide();
  }
  else if (val == "") {
    $('.main_rfp_prob_statement_s').hide();
  }
  else{
    //$('#rfp_prob_statement_s').val('');
    $('.main_rfp_prob_statement_s').fadeIn();
  }
});

if(document.querySelector(".dos6_vetting_change")){
  
  document.querySelector(".dos6_vetting_change").onchange = function (e) {
    // some things
    
    const elements = document.querySelectorAll(".dos6_vetting");
    if(this.checked){
      elements.forEach(function (element) {
       element.checked = false;
       element.disabled = true;
       //$('#rfp_prob_statement_s').val('');
    $('.main_rfp_prob_statement_s').hide();
      });
    }else{
      $('#rfp_prob_statement_s').val('');
      elements.forEach(function (element) {
       element.disabled = false;
      });
    }
    
  }
}


const ccsZvalidateRfpLocation = (event) => {
  event.preventDefault();
  var urlParams = new URLSearchParams(window.location.search);
  var agreement_id = urlParams.get("agreement_id");
  var group_id = urlParams.get("group_id");
  let fieldCheck = "", errMsg ="", errorStore = [];
  
  let hiddenagreement_id=document.getElementById("agreement_id");
  if(hiddenagreement_id!==null)
  {
    if(hiddenagreement_id.value !='RM1043.8'){
      errMsg = "You must select at least one region where your staff will be working, or  the “No specific location”";
    }
}


    
  let hiddenQuestionElement=document.getElementById("question_id");
  if(hiddenQuestionElement!==null)
  {
    if(hiddenQuestionElement.value=="Question 10")
    {
      errMsg="You must select which project phases you need resource for, or confirm if this does not apply to your project.";
    }
  }
 
  console.log("hiddenagreement_id.value",hiddenagreement_id.value);
  if(hiddenagreement_id.value =='RM1043.8'){
    
    if(document.querySelector("#required_locations").checked){
      var getStatement = $('#rfp_prob_statement_s').val()
      console.log("getStatement",getStatement);
      if(getStatement==''){
       
       // fieldCheck = ccsZisOptionChecked("rfp_prob_statement_s", 'PLease enter the information');
      //   fieldCheck = ["rfp_prob_statement_s","Please enter the information"]
      // console.log("fieldCheck",fieldCheck)
      //    errorStore.push(fieldCheck);
      //   console.log("fieldCheck length",errorStore)
      //   ccsZPresentErrorSummary(errorStore);

          
       //The Location page is mandatory 
     
       document.forms["rfp_location"].submit();

      }else{
       
        document.forms["rfp_location"].submit(); //The Location page is mandatory 
      }
      
    }else{
      const pageHeading = document.getElementById('page-heading').innerHTML;
      

      if (!(pageHeading.includes("(Optional)") || pageHeading.includes("(optional)"))) {
       
        
         //const lotid = document.getElementById('LotID').value;
         const lotid = document.getElementById('lID').value;
        console.log("lotid",lotid);

//LOT 1 Group 5 Group 11
//LOT 2 Group 4 Group 9

console.log("group_id",group_id);

        if (agreement_id=='RM1043.8' && group_id=='Group 5' && lotid=='1') {
          errMsg = "Select at least one location";
        }else if (agreement_id == 'RM1043.8' && group_id == 'Group 9' && lotid=='3') {
          errMsg = "Select at least one additional assessment method, or “None”";
        }else if (agreement_id == 'RM1043.8' && group_id == 'Group 16') {
          errMsg = "Select the needed security levels or “No security clearance needed”";
        }else if (agreement_id == 'RM1043.8' && group_id == 'Group 11' && lotid=='1') {
          errMsg = "Select at least one additional assessment method, or “None”";
        }else if (agreement_id == 'RM1043.8' && group_id == 'Group 4' && lotid=='3') {
          errMsg = "Select at least one location";
        }
        else {
          errMsg=" Please select the checkbox.";
        }
        
        fieldCheck = ccsZisOptionChecked("required_locations",errMsg );
      if (fieldCheck !== true) errorStore.push(fieldCheck);
      if (errorStore.length === 0) 
      document.forms["rfp_location"].submit(); //The Location page is mandatory 
      else ccsZPresentErrorSummary(errorStore);

      }else{
       document.forms["rfp_location"].submit();
      }
       //The Location page is mandatory 
    }

   
  }else{
      fieldCheck = ccsZisOptionChecked("required_locations",errMsg );
      if (fieldCheck !== true) errorStore.push(fieldCheck);
      if (errorStore.length === 0) 
      document.forms["rfp_location"].submit(); //The Location page is mandatory 
      else ccsZPresentErrorSummary(errorStore);
  }

};

const ccsZvalidateChangeRfpLocation = (event) => {
  // validation for these inputs only
  event.preventDefault();
  let inputs;
  let container = document.getElementById('rfp_location');
  // let noApplicable = document.getElementById('required_locations-6');
  // inputs = container.getElementsByTagName('input');
  // for (let index = 0; index < inputs.length; ++index) {
  //   if (event.target.id !== 'required_locations-6')
  //     if(noApplicable && noApplicable.checked) noApplicable.checked = false;
  //   if (event.target.id === 'required_locations-6') {
  //     if (inputs[index].id !== 'required_locations-6')
  //       inputs[index].checked = false;
  //   }
  // }

}



document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("rfp_location") !== null) {

    let allCheckbox = document.getElementById("required_locations-14"),
      locationCheckboxes = document.querySelectorAll("input[name='required_locations']");

    if (allCheckbox && allCheckbox.checked) {
      locationCheckboxes.forEach((cb) => {

        if (cb.value != notApplicableTag) cb.disabled = true;

      });
    }

    if(document.getElementById("required_locations-14")){
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
  }
});
