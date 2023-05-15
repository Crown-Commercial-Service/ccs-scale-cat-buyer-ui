var inactiviyTime = 0;
var inactiviyTime1 = 0;
let logoutlocationURL = window.location.origin + '/oauth/logout'
var inactivateAfter = 2;
var inactivateOpenPopUp = 870;
var inactivateClosePopUp = 900;


$(document).ready(function () {
    // Increment the idle time counter every minute.
    var idleInterval = setInterval(timerIncrement, 30000); // 30 seconds

       // Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        inactiviyTime = 0;
    });
    $(this).keypress(function (e) {
        inactiviyTime = 0;
    });
});

function timerIncrement() {
  $.ajax({
    url: `/rfp/check-session`,
    type: "GET",
    contentType: "application/json",
    async: false,
  }).done(function (result) {
    if(result.status == true){
      const openpopGC = document.querySelector('.backdrop-sessionTimeoutPopup')
      openpopGC.classList.add('showpopup')
      $(".dialog-close-sessionTimeoutPopup").on('click', function(){
         openpopGC.classList.remove('showpopup');
      });
      $(".close-dialog-close").on('click', function(){
        openpopGC.classList.remove('showpopup');
      });
      deconf = document.getElementById('redirect-button-sessionTimeoutPopup');
      deconf.addEventListener('click', ev => {
        $.ajax({
          url: `/rfp/retain-session`,
          type: "GET",
          contentType: "application/json",
          async: false,
        }).done(function (result) {
          console.log(result)
         // window.location.href = redirectUrl;
         
        }).fail((res) => {
          
          console.log(res);
        })
                // document.location.href=window.location.href;
      });
      setTimeout(function(){
        openpopGC.classList.remove('showpopup');
        window.location.href= logoutlocationURL
        }, 30000);
    }
   // window.location.href = redirectUrl;
   
  }).fail((res) => {
    
    console.log(res);
  })
   
    
}