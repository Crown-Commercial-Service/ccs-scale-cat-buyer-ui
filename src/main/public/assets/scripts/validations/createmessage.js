const ccsZCreateMessageSubmit = (event) => {
    event.preventDefault();

    let btn=document.getElementById('btnCreateMessage')
    if(btn!=null && btn!=undefined){
        btn.disabled=true;
    document.forms["ccs_message_create_form"].submit();
    }
    
  };