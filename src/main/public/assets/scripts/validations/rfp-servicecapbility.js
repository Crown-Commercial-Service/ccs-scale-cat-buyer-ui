document.addEventListener('DOMContentLoaded', () => {

var tabLinks = document.querySelectorAll('.rfp-service-capabilities');
var allCheckBox = document.getElementsByClassName('rfp_cap');
var checkBoxByGroup = [];

var itemSubText ='';
var itemText = '';


if(tabLinks !==null)
{
ccsTabMenuNaviation();

if(tabLinks.length >0)
{
   itemSubText =document.getElementsByClassName('table-item-subtext')[0];;
   //itemText = document.getElementsByClassName('rfp-service-capabilities')[0].childNodes[0].data;
   itemText = tabLinks[0].getElementsByTagName('a')[0].childNodes[0].data;
   if(itemText != null && itemText !='')
{
  itemText = itemText.replaceAll(" ", "_");
  checkBoxByGroup = document.getElementsByClassName(itemText);
  checkBoxSelection(itemText)
}
Array.from(tabLinks).forEach(link => {
  link.addEventListener('click', function (e) {
   let currentTarget = e.currentTarget; 
   let clicked_index = $(this).index();
   
   itemSubText =currentTarget.getElementsByClassName('table-item-subtext')[0];
   itemText = tabLinks[clicked_index].getElementsByTagName('a')[0].childNodes[0].data;
   //itemText  =currentTarget.getElementsByClassName('rfp-service-capabilities')[0].childNodes[0].data; 
   itemText = itemText.replaceAll(" ", "_");
   checkBoxByGroup = document.getElementsByClassName(itemText);
     checkBoxSelection(itemText)
    return false;
  });
});
}
}


  function checkBoxSelection(itemText){
      
      updateGroupCheckBox();
      updateTotalAddedValue();

    for(var a =1; a < checkBoxByGroup.length+1; a++){
  
       let checkBoxIdConcat = itemText+'_'+a;
        
       let checkBox = $(`#${checkBoxIdConcat}`);
       checkBox.on('click', ()=>{

        updateGroupCheckBox();
        updateTotalAddedValue();

       }
       );    
     }
  }


  $('.select_all').on('click',()=>{
      
    for(var a =0; a < checkBoxByGroup.length; a++){
      if(!checkBoxByGroup[a].checked)
      checkBoxByGroup[a].checked = true
    }

      updateGroupCheckBox();
      updateTotalAddedValue();
    
  }); 
  
function updateTotalAddedValue()
{
  let count = 0;
  for(var a =0; a < allCheckBox.length; a++){
    if(allCheckBox[a].checked)
    count = count+1;
  }
  $('#total_added').text(count); 
}

function updateGroupCheckBox()
{
  let checkedCount = 0;
  for(var a =0; a < checkBoxByGroup.length; a++){
    if(checkBoxByGroup[a].checked)
    checkedCount = checkedCount+1;
  }
  itemSubText.innerHTML ='['+checkedCount +' Selected ]'; 
}

function clearAllCheckBox()
{
  for(var a =0; a < allCheckBox.length; a++){
    allCheckBox[a].checked = false  
  }
  clearSubHeadingText();
}

function clearSubHeadingText()
{
  for(var a =0; a < tabLinks.length; a++){
    document.getElementsByClassName('table-item-subtext')[a].innerHTML = '[ 0 Selected ]'
  }
  updateTotalAddedValue();
}

$('.ca_da_service_cap').on('click', function () {
  if ($(this).hasClass('selected')) {
    deselect($(this));
    $(".backdrop-vetting").fadeOut(200);
    $('.pop').slideFadeToggle();
  }
  return false;
});

$('#redirect-button-vetting').on('click', function () {
  deselect($('.dialog-close-vetting'));
  $(".backdrop-vetting").fadeOut(200);
  var route = this.name;
  if (route == 'Clear form') {
    clearAllCheckBox();
  } else {
    return false;
  }
});

$('.dialog-close-vetting').on('click', function () {
  $(".backdrop-vetting").fadeOut(200);
  deselect($('.dialog-close-vetting'));
  return false;
});


function deselect(e) {
  $('.pop').slideFadeToggle(function () {
    e.removeClass('selected');
  });
}

});