
const totalElement = $('.ons-list__link').length;
if (document.querySelectorAll('.ons-list__item') !== null) ccsTabMenuNaviation();
var arrayOfHeadings = [];
for(var a =0; a < totalElement; a++){

    arrayOfHeadings.push(document.getElementsByClassName('ons-list__link')[a].innerHTML.split('<div ')[0].split(' ').join('_'))

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