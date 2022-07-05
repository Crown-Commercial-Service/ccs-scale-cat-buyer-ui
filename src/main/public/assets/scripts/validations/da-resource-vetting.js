const updateToViewDA = (DAtotalStaffWeight, DAtotalVetting) => {
    $('#da-total-staff').html(DAtotalStaffWeight);
    $('#da-total-vetting').html(DAtotalVetting);
    $('#da-total-resources').html(DAtotalSFIA);
}

const DAstaffweightPercentage = $('.da_weight_staff_class');
const DAvettingPercentage = $('.da_weight_vetting_class_p');
const DASFIA = $('.da_weight_vetting_class');

var DAtotalStaffWeight = Number($('#da-total-staff')[0].innerHTML);
var DAtotalVetting = Number($('#da-total-vetting')[0].innerHTML);
var DAtotalSFIA= Number($('#da-total-resources')[0].innerHTML);

for(var a =0; a < DAstaffweightPercentage.length; a++){
    DAstaffweightPercentage[a].addEventListener('blur', (event)=>{
        DAtotalStaffWeight=0;
        for(var j =0; j < DAstaffweightPercentage.length; j++){
            
            DAtotalStaffWeight = DAtotalStaffWeight + Number(DAstaffweightPercentage[j].value);
        }
        //DAtotalStaffWeight = DAtotalStaffWeight + Number(event.target.value);
        updateToViewDA(DAtotalStaffWeight, DAtotalVetting,DAtotalSFIA);
    })
}

for(var b =0; b < DAvettingPercentage.length; b++){
    DAvettingPercentage[b].addEventListener('blur', (event)=>{
        DAtotalVetting=0;
        for(var j =0; j < DAvettingPercentage.length; j++){
            
            DAtotalVetting = DAtotalVetting + Number(DAvettingPercentage[j].value);
        }
        //DAtotalVetting = DAtotalVetting + Number(event.target.value);
        updateToViewDA(DAtotalStaffWeight, DAtotalVetting,DAtotalSFIA);
        //console.log(totalVetting)
    })
}


for(var a =0; a < DASFIA.length; a++){
    DASFIA[a].addEventListener('blur', (event)=>{
        DAtotalSFIA=0;
        for(var j =0; j < DASFIA.length; j++){
            
            DAtotalSFIA = DAtotalSFIA + Number(DASFIA[j].value);
        }
        // DAtotalSFIA = DAtotalSFIA + Number(event.target.value);
        updateToViewDA(DAtotalStaffWeight, DAtotalVetting,DAtotalSFIA);
    })
}

var tabLinks = document.querySelectorAll('.da-vetting-weighting');

if (tabLinks != null && tabLinks.length > 0) {

    var tabLinks = document.querySelectorAll('.ons-list__item');
  var tabContainer = document.getElementById('vertical_tab_nav');
  if (tabLinks != undefined && tabLinks != null && tabLinks.length > 0) {


    tabLinks[0].getElementsByTagName('a')[0].classList.add('selected');
    const elems = tabContainer.getElementsByTagName('article');
    for (var i = 0; i < elems.length; i++) {
      if (i === 0) {
        elems[i].style.display = 'block';
        itemSubText = tabLinks[0].getElementsByClassName('table-item-subtext')[0];
        resourceItemOnClick(elems[i],itemSubText);
      } else {
        elems[i].style.display = 'none';
      }
    }
    Array.from(tabLinks).forEach(link => {
      link.addEventListener('click', function (e) {
        let currentTarget = e.currentTarget;
        let clicked_index = $(this).index();
        $('#vertical_tab_nav > div > aside > nav > ol > li > a').removeClass("selected");
        currentTarget.getElementsByTagName('a')[0].classList.add('selected')
        $('#vertical_tab_nav > div > article').css('display', 'none');
        $('#vertical_tab_nav > div > article').eq(clicked_index).fadeIn();
        $(this).blur();
        return false;
      });

    });
  }
    // itemSubText = document.getElementsByClassName('table-item-subtext')[0];;
    // itemText = tabLinks[0].getElementsByTagName('a')[0].childNodes[0].data

    // if (itemText != null && itemText != '') {

    //     itemText = itemText.replaceAll(" ", "_");
    //     resourceItemOnClick(itemText);
    // }
    Array.from(tabLinks).forEach(link => {

        link.addEventListener('click', function (e) {
            let currentTarget = e.currentTarget;
            let clicked_index = $(this).index();

            itemSubText = currentTarget.getElementsByClassName('table-item-subtext')[0];
            //itemText = tabLinks[clicked_index].getElementsByTagName('a')[0].childNodes[0].data

            //itemText = itemText.replaceAll(" ", "_");    
            //itemText =  itemText.replace(/[\])}[{(]/g, '');
            let articles=tabContainer.getElementsByTagName('article');
            resourceItemOnClick(articles[clicked_index],itemSubText);
            //updateTotalResourceAdded();
            return false;
        });
    });


}


function resourceItemOnClick(article,itemSubText) {

    const weightQuantityId = article.querySelectorAll('[id^="da_sfia_weight_vetting_"]');
    const weightStaffId=article.querySelectorAll('[id^="da_weight_staff_"]');
    const weightVettingId=article.querySelectorAll('[id^="da_weight_vetting_"]');
    for (var a = 0; a < weightQuantityId.length; a++) {

        let weightQuantity = $(`#${weightQuantityId[a].id}`);

        weightQuantity.on('blur', () => {

            if(weightQuantity.val() != undefined && weightQuantity.val() !== null && weightQuantity.val() !== "")
                updateWeightVetting(weightQuantityId,weightStaffId,weightVettingId,itemSubText);
        });
    }
    for (var a = 0; a < weightStaffId.length; a++) {

        let weightStaff = $(`#${weightStaffId[a].id}`);

        weightStaff.on('blur', () => {

            if(weightStaff.val() != undefined && weightStaff.val() !== null && weightStaff.val() !== "")
            updateWeightVetting(weightQuantityId,weightStaffId,weightVettingId,itemSubText);
        });
    }
    for (var a = 0; a < weightVettingId.length; a++) {

        let weightVetting = $(`#${weightVettingId[a].id}`);

        weightVetting.on('blur', () => {

            if(weightVetting.val() != undefined && weightVetting.val() !== null && weightVetting.val() !== "")
            updateWeightVetting(weightQuantityId,weightStaffId,weightVettingId,itemSubText);
        });
    }
}

function updateWeightVetting(weightQuantityId,weightStaffId,weightVettingId,itemSubText) {
    let totalQuantity = 0;
    let totalStaff=0;
    let totalVetting=0;
    for (var a = 0; a < weightQuantityId.length; a++) {

        let weightQuantity = $(`#${weightQuantityId[a].id}`);
        if (weightQuantity.val() != undefined && weightQuantity.val() != '')
        if(weightQuantity.val()<0 || isNaN(weightQuantity.val()))
            totalQuantity = totalQuantity;
         else
              totalQuantity = totalQuantity + Number(weightQuantity.val());
        
    }
    for (var a = 0; a < weightStaffId.length; a++) {

        let weightStaff = $(`#${weightStaffId[a].id}`);
        if (weightStaff.val() != undefined && weightStaff.val() != '')
        totalStaff = totalStaff + Number(weightStaff.val());
    }
    for (var a = 0; a < weightVettingId.length; a++) {

        let weightVetting = $(`#${weightVettingId[a].id}`);
        if (weightVetting.val() != undefined && weightVetting.val() != '')
        totalVetting = totalVetting + Number(weightVetting.val());
    }
    itemSubText.innerHTML =  totalQuantity+" resources added,"+totalStaff+"% / "+totalVetting+"%";
}

function updateTotalResourceAdded() {

    let resourceCount = 0;
    for (let index = 0; index < tabLinks.length; index++) {

        let subText = tabLinks[index].getElementsByTagName('div')[0].childNodes[0].data;
        var numbr = subText.match(/\d/g);

        if(numbr !=null)
        {
            numbr = numbr.join("");
            resourceCount = resourceCount + Number(numbr);
        }
       
    }
    totalResourceAdded.text(resourceCount);
}


