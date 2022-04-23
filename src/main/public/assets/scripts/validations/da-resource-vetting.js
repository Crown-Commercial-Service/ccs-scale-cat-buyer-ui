const staffweightPercentage = $('.weight_staff_class');
const vettingPercentage = $('.weight_vetting_class_p');


const allValidations_p_to = $('.p_to');

for(var a =0; a < allValidations_p_to.length; a++){
    
}


var totalStaffWeight = 0;
var totalVetting = 0;


for(var a =0; a < staffweightPercentage.length; a++){
    document.getElementsByClassName('weight_staff_class')[a].addEventListener('blur', (event)=>{
        totalStaffWeight = totalStaffWeight + Number(document.getElementsByClassName('weight_staff_class')[a].value);
        updateToView(totalStaffWeight, totalVetting);
    })
}


for(var b =0; b < vettingPercentage.length; b++){
    document.getElementsByClassName('weight_vetting_class_p')[a].addEventListener('blur', (event)=>{
        totalVetting = totalVetting + Number(document.getElementsByClassName('weight_vetting_class_p')[b].value);
        updateToView(totalStaffWeight, totalVetting);
        console.log(totalVetting)
    })
}



const updateToView = (totalStaffWeight, totalVetting) => {
    $('#staff_percentage').html(totalStaffWeight);
    $('#vetting_percentage').html(totalVetting);
}