document.addEventListener('DOMContentLoaded', () => {

    if (document.getElementById("ccs_add_rfi_collab") !== null) {
  
      let with_value_count = 5,
        prev_input = 0,
        deleteButtons = document.querySelectorAll("a.del");
  
      for (var collab_fieldset = 5; collab_fieldset > 1; collab_fieldset--) {
  
  
        let this_fieldset = document.querySelector(".collab_" + collab_fieldset),
          name_box = document.getElementById("rfi_collab_name_" + collab_fieldset);
  
        if (name_box.value !== "") {
          this_fieldset.classList.remove('ccs-dynaform-hidden');
  
          if (collab_fieldset === 5) {
            document.getElementById("ccs_collab_add").classList.add('ccs-dynaform-hidden');
          }
  
        } else {
  
          this_fieldset.classList.add('ccs-dynaform-hidden');
          with_value_count = collab_fieldset;
        }
  
      }
  
      document.getElementById("ccs_collab_add").addEventListener('click', (e) => {
        e.preventDefault();
  
        document.querySelector(".collab_" + with_value_count).classList.remove("ccs-dynaform-hidden");
  
        if (with_value_count > 2 ) {
          prev_input = with_value_count - 1;
          document.querySelector(".collab_"  + prev_input + " a.del").classList.add("ccs-dynaform-hidden");
        }
  
        with_value_count++;
  
        if (with_value_count === 6) {
          document.getElementById("ccs_collab_add").classList.add('ccs-dynaform-hidden');
        }
  
      });
  
      // delete buttons
      deleteButtons.forEach((db) => {
        db.addEventListener('click', (e) => {
  
          e.preventDefault();
  
          let target = db.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
            prev_coll = Number(target) - 1,
            target_fieldset = db.closest("fieldset");
  
          target_fieldset.classList.add("ccs-dynaform-hidden");
  
          document.getElementById('rfi_collab_name_' + target).value = "";
          document.getElementById('rfi_collab_email_' + target).value = "";
          document.getElementById('rfi_collab_tel_' + target).value = "";
  
          if (prev_coll > 1) {
            document.querySelector('.collab_' + prev_coll + ' a.del').classList.remove("ccs-dynaform-hidden");
          }
  
          document.getElementById("ccs_collab_add").classList.remove('ccs-dynaform-hidden');
          with_value_count--;
        });
      });
  
    }
  
  });
  
  const ccsZvalidateRfiTeamMems = (event) => {
    event.preventDefault();
  
    let fieldCheck = "",
      errorStore = [],
      longNum = ["zero", "one", "two", "three", "four", "five"];
  
    for (var x = 1; x < 6; x++) {
      let name_field = document.getElementById('rfi_collab_name_' + x);
  
      // console.log(name_field.classList.value);
  
      if (name_field.closest("fieldset").classList.value.indexOf("ccs-dynaform-hidden") === -1) {
        fieldCheck = ccsZvalidateWithRegex( "rfi_collab_name_" + x, "Provide the name of team member " + longNum[x], /^[a-z| ]{3,}$/i );
        if (fieldCheck !== true) errorStore.push(fieldCheck);
  
        fieldCheck = ccsZvalidateWithRegex( "rfi_collab_email_" + x, "Provide the email of team member " + longNum[x], /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ );
        if (fieldCheck !== true) errorStore.push(fieldCheck);
      }
    }
  
    if (errorStore.length === 0) document.forms["ccs_add_rfi_collab"].submit();
    else ccsZPresentErrorSummary(errorStore);
  
  };
  