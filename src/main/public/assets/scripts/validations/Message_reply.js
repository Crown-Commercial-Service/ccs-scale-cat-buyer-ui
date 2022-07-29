const ccsZCountMsgReplyTextArea = (event) => {
    event.preventDefault();
    const element = document.getElementById("reply_message_input"); 
      let labelElement=document.getElementById("reply_message_input_textarea_count");
      let count=5000-element.value.length;
      labelElement.innerText="You have "+count + " characters remaning of 5000";
   
  };
  const ccsZCountMsgReplyTextbox = (event) => {
    event.preventDefault();
    const element = document.getElementById("reply_subject_input"); 
      let labelElement=document.getElementById("reply_message_input_textbox_count");
      let count=500-element.value.length;
      labelElement.innerText="You have "+count + " characters remaning of 500";
   
  };