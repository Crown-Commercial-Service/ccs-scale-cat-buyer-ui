const ccsZvalidateRfiDocs = (event) => {
    event.preventDefault();
  
    let fieldCheck = "",
      errorStore = [];
  
    if (document.getElementById("rfi_file_upload_1").value.length > 0) {
      fieldCheck = ccsZvalidateWithRegex( "rfi_file_upload_1", "Document must be a Word or Acrobat file",         /^(\w|\W)+\.(docx?|pdf)$/);
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  
    if (document.getElementById("rfi_additional_link").value.length > 0) {
      fieldCheck = ccsZvalidateWithRegex( "rfi_additional_link", "Please enter a valid link",  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/);
      if (fieldCheck !== true) errorStore.push(fieldCheck);
    }
  
    if (errorStore.length === 0) document.forms["ccs_rfi_docs_form"].submit();
    else ccsZPresentErrorSummary(errorStore);
  };

  

  

  let inputLinks = $('#rfi_additional_link');
  inputLinks.on('keypress', ()=>{
    if(inputLinks.val() !== ""){
      $('#upload_doc_form').fadeOut();
    }
  })

  inputLinks.on('blur', ()=>{
    if(inputLinks.val() === ""){
      $('#upload_doc_form').fadeIn();
    }
  })
