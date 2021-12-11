document.addEventListener('DOMContentLoaded', () => {


  for(let a =1; a <= 5; a++){
    let date = "#clarification_date-day_"+a;
    let month = "#clarification_date-month__"+a
    let year = '#clarification_date-year__'+a
    let hour = '#clarification_date-hour__'+a
    let minutes = 'clarification_date-minute__'+a

    $(date).on('keypress', ()=>{
          let entered_date = $(date).val();
          console.log(entered_date)
    })

    


  }





});

