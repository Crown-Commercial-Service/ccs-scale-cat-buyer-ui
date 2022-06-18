document.addEventListener('DOMContentLoaded', () => {
   
    $('#ca_review_ranked_suppliers').on('submit', (e) => {

    var element =  document.getElementById('supplierID');
    var justification=document.getElementById('ca_justification');
    debugger
    var noofsuppliers=$('#ca_p7').html();
    var matches = noofsuppliers.match(/(\d+)/);
    if (typeof(element) != 'undefined' && element != null &&typeof(justification) != 'undefined' && justification != null)
{
    
    if($('input[type=checkbox]:checked').length == 0)
    {
        
        e.preventDefault();
        $('#ca_reviewrankedsuppliers_error_summary').removeClass('hide-block');
        $('.govuk-error-summary__title').text('There is a problem');
        $("#ca_rank_summary_list").html('<li><a href="#">Please select the suppliers</a></li>');
        $('html, body').animate({ scrollTop: 0 }, 'fast');
    }
    else if($('input[type=checkbox]:checked').length > 0 && $('input[type=checkbox]:checked').length < matches[0])
    {
        e.preventDefault();
        $('#ca_reviewrankedsuppliers_error_summary').removeClass('hide-block');
        $('.govuk-error-summary__title').text('There is a problem');
        $("#ca_rank_summary_list").html('<li><a href="#">Please select the '+matches[0]+' suppliers</a></li>');
        $('html, body').animate({ scrollTop: 0 }, 'fast');
    }
    else if($('input[type=checkbox]:checked').length >= matches[0] && $('#ca_justification').val()==='')
    {
        
        e.preventDefault();
        $('#ca_reviewrankedsuppliers_error_summary').removeClass('hide-block');
        $('.govuk-error-summary__title').text('There is a problem');
        $("#ca_rank_summary_list").html('<li><a href="#">A justification must be provided whether or not a supplier from this tie rank is selected to take forward or not</a></li>');
        $('html, body').animate({ scrollTop: 0 }, 'fast');
    }
}
});  
});
const ccsZCountCAReviewRank = (event) => {
    event.preventDefault();
    const element = document.getElementById("ca_justification"); 
      let labelElement=document.getElementById("ca_textarea_reviewrank");
      let count=5000-element.value.length;
      labelElement.innerText=count + " remaining of 5000";
   
  };
  