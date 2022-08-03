const ccsZCountMsgReplyTextArea = (event) => {
    event.preventDefault();
    const element = document.getElementById("reply_message_input"); 
      let labelElement=document.getElementById("reply_message_input_textarea_count");
      let count=5000-element.value.length;
      labelElement.innerText="You have "+count + " characters remaning of 5000";
   
  };
  const ccsZCountQAQuestionTextArea = (event) => {
    event.preventDefault();
    const element = document.getElementById("QA_Question_input"); 
      let labelElement=document.getElementById("QA_input_Question_count");
      let count=5000-element.value.length;
      labelElement.innerText="You have "+count + " characters remaning of 5000";
   
  };
  const ccsZCountQAClarificationTextArea = (event) => {
    event.preventDefault();
    const element = document.getElementById("message_Add_Clerification_input"); 
      let labelElement=document.getElementById("QA_input_clarification_count");
      let count=5000-element.value.length;
      labelElement.innerText="You have "+count + " characters remaning of 5000";
   
  };
  const ccsZCountQAEditQuestionTextArea = (event) => {
    event.preventDefault();
    const element = document.getElementById("message_QA_Edit_Question_input"); 
      let labelElement=document.getElementById("message_QA_Edit_Question_input_count");
      let count=5000-element.value.length;
      labelElement.innerText="You have "+count + " characters remaning of 5000";
   
  };
  const ccsZCountQAEditClarificationTextArea = (event) => {
    event.preventDefault();
    const element = document.getElementById("message_QA_Edit_Answer_input"); 
      let labelElement=document.getElementById("message_QA_Edit_Answer_input_count");
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