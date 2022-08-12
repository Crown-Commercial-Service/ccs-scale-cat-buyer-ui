const ccsZRFIPublishEventSubmit = (event) => {
    event.preventDefault();

    let btn=document.getElementById('rfi_btn_publish_now')
    if(btn!=null && btn!=undefined){
        btn.disabled=true;
    document.forms["ccs_rfi_publish_form"].submit();
    }
    
  };