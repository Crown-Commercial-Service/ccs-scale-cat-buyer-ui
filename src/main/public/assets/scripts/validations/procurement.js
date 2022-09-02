document.addEventListener('DOMContentLoaded', () => {
    var hiddenScrollElement=document.getElementById("scrollToButton")
  if(hiddenScrollElement!=null && hiddenScrollElement !=undefined){
    var data=hiddenScrollElement.value
    var readAllSpans=document.getElementsByClassName("proc-task-list__section-number")
    var elementToNavigate=null
    if(data=="Premarket"){
      
      for(var i=0;i<readAllSpans.length;i++)
      {
        if(readAllSpans[i].innerText=="2."){elementToNavigate=readAllSpans[i];break;}
      }
    }
    if(data=="WritePublish"){
      
      for(var i=0;i<readAllSpans.length;i++)
      {
        if(readAllSpans[i].innerText=="3."){elementToNavigate=readAllSpans[i];break;}
      }
    }
    if(elementToNavigate!=null){$(window).scrollTop(elementToNavigate.offsetTop)}
  }
});