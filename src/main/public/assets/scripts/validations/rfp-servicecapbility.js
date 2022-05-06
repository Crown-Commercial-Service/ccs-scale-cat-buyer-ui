document.addEventListener('DOMContentLoaded', () => {

const totalElement = $('.ons-list__link').length;
if (document.querySelectorAll('.ons-list__item') !== null) ccsTabMenuNaviation();
var arrayOfHeadings = [];
for(var a =0; a < totalElement; a++){

    arrayOfHeadings.push(document.getElementsByClassName('ons-list__link')[a].innerHTML.split('<div ')[0].split(' ').join('_'))

}

var tabLinks = document.querySelectorAll('.ons-list__item');

var itemSubText ='';
var itemText = '';

Array.from(tabLinks).forEach(link => {
    link.addEventListener('click', function (e) {
     let currentTarget = e.currentTarget; 

     itemSubText =currentTarget.getElementsByClassName('table-item-subtext')[0];
     itemText  =currentTarget.getElementsByClassName('ons-list__link')[0].childNodes[0].data;
    
     let checkedCount = itemSubText.textContent;
     checkedCount = checkedCount.replace ( /[^\d.]/g, '' );
     itemText = itemText.replaceAll(" ", "_");

     checkBoxSelection(itemText, parseInt(checkedCount))
      return false;
    });
  });


  function checkBoxSelection(itemText,checkedCount){

  var  selectedGroupCheckBox=  document.getElementsByClassName(itemText);    

    for(var a =1; a < selectedGroupCheckBox.length+1; a++){
  
       let checkBoxIdConcat = itemText+'_'+a;
        
       let checkBox = $(`#${checkBoxIdConcat}`);
       checkBox.on('change', ()=>{
   
           if($(`#${checkBoxIdConcat}`).is(':checked')) { 
                checkedCount = checkedCount+1;
               itemSubText.innerHTML ='['+checkedCount +' Selected]';            
           } else {
                checkedCount = checkedCount-1;
               itemSubText.innerHTML ='['+checkedCount +' Selected]';             
           }         
       }
       );    
     }
  }


for(var a =0; a < arrayOfHeadings.length; a++){

    const classTarget = arrayOfHeadings[a]+'_t';
    const classFiller = arrayOfHeadings[a];

    $(`.${classTarget}`).on('click', ()=> {
        $(`.${classFiller}`).attr('checked', true);
        $('html,body').animate({
            scrollTop: $("#scrollTo").offset().top - $(window).height()/2
         }, 1000);
    })

}
// $('#ccs_rfp_menu_tabs_form').on('submit', (e)=>{
   
    
//  const checked=$('#requirementId').is(':checked');
//     if(!checked){
        
//         e.preventDefault();
//         $('.govuk-error-summary__title').text('There is a problem');

//         $("#summary_list").html('<li><a href="#">Atleast one of the service capability must be selected</a></li> ');
//         $([document.documentElement, document.body]).animate({
//             scrollTop: $("#summary_list").offset().top
//         }, 1000);     
    
//         $('#service_capability_error_summary').removeClass('hide-block');
//     }
//     else{
         
//         $('.govuk-error-summary__title').text('');

//         $("#summary_list").html('');
       

//          $('#service_capability_error_summary').addClass('hide-block');
//         $('#ccs_rfp_menu_tabs_form').submit();
//     }
// } )

});