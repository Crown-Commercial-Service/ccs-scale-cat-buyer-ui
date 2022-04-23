var allWords = '';
var wordCount = 0;
const MaxWordLimits = 500;

$('#completed_work').on('keypress focus mouseleave', ()=> {
  
    allWords = $('#completed_work').val();
    wordCount = allWords.split(' ').length;

    if(wordCount > MaxWordLimits){
        $('.govuk-error-summary__title').text('There is a problem');
        $('#work_location_word_error').text('Total Words: '+ wordCount + ' out of 500')

        $("#summary_list").html('<li><a href="#">Words limit exceeded</a></li> ');
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#summary_list").offset().top
        }, 1000);     
    
        $('#service_capability_error_summary').removeClass('hide-block');
        document.getElementById('completed_work').classList.add('govuk-input--error');

    }
    else{
        $('.govuk-error-summary__title').text('');
        $('#work_location_word_error').text('')

       
    
        $('#service_capability_error_summary').addClass('hide-block')
        document.getElementById('completed_work').classList.remove('govuk-input--error');
    }

})



$('#rfp_work_completed').on('submit', (e)=>{

    if(wordCount > MaxWordLimits){
        e.preventDefault();
    }
    else{
        $('#rfp_work_completed').submit();
    }
} )

