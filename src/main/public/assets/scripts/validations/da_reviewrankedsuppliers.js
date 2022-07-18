document.addEventListener('DOMContentLoaded', () => {
    $('#da_review_ranked_suppliers').on('submit', (e) => {

    var element =  document.getElementById('supplierID');
    //var justification=document.getElementById('da_justification');
    var justificationtext = $(".da_justification_text");
    var justifications=[];
    for(var a =0; a < justificationtext.length; a++){
        
        if(justificationtext[a].value != ''&&justificationtext[a].value !=undefined)
        {
            justifications.push(true)
        }
    }
    if (typeof(element) != 'undefined' && element != null) 
{   
    if($('input[type=radio]:checked').length == 0)
    {       
        e.preventDefault();
        $('#da_reviewrankedsuppliers_error_summary').removeClass('hide-block');
        $('.govuk-error-summary__title').text('There is a problem');
        $("#da_rank_summary_list").html('<li><a href="#">Please select the supplier</a></li>');
        $('html, body').animate({ scrollTop: 0 }, 'fast');
    }
    else if($('input[type=radio]:checked').length > 0 && justifications.length==0)
    {
        
        e.preventDefault();
        $('#da_reviewrankedsuppliers_error_summary').removeClass('hide-block');
        $('.govuk-error-summary__title').text('There is a problem');
        $("#da_rank_summary_list").html('<li><a href="#">A justification must be provided for the selected supplier</a></li>');
        $('html, body').animate({ scrollTop: 0 }, 'fast');
    }
}
});  
$('input[type=radio]').on('change', function () {

    var justification = $(".da_justification_text");
    for(var a =0; a < justification.length; a++){
        justification[a].value = ''  
    }   
    var inputValue = $(this).attr("value");
    var targetBox = $("." + inputValue);
    $(".da_justification").not(targetBox).hide();
    $(targetBox).show();
    let supplierID= $('input[type=radio]:checked').val()
     justification_text = document.getElementById("da_textarea_reviewrank_" + supplierID);
    justification_text.addEventListener('input', ccsZCountDAReviewRank);
})
const ccsZCountDAReviewRank = (event) => {
    event.preventDefault();
    const inputId=event.srcElement.id;
     const element = document.getElementById(inputId);
     const arr=inputId.split("da_textarea_reviewrank_");
            let labelElement=document.getElementById("da_textarea_"+arr[1]);
            let count=5000-element.value.length;
            labelElement.innerText=count + " remaining of 5000";
  };
  let supplierID= $('input[type=radio]:checked').val()
  justification_text = document.getElementById("da_textarea_reviewrank_" + supplierID);
  if(justification_text!=undefined && justification_text!=null)
 justification_text.addEventListener('input', ccsZCountDAReviewRank);
});
