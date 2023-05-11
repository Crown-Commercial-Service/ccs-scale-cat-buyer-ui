const ccsScrollToJourney = (event) => {
    let element = document.querySelector('.govuk-breadcrumbs');
     let scrollerID = setInterval(function() {
        window.scrollBy(0, 2);
        if ( window.scrollY >= element.offsetTop) {
            clearInterval(scrollerID);
        }
    }, 10);
  };
