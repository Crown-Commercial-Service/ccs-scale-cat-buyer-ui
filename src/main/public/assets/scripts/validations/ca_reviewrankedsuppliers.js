document.addEventListener('DOMContentLoaded', () => {
   
    $('#ca_review_ranked_suppliers').on('submit', (e) => {
  

    //e.preventDefault();
    var element =  document.getElementById('supplierID');
    var justification=document.getElementById('justification');
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
    else if($('input[type=checkbox]:checked').length > 0 && $('#justification').val()==='')
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
