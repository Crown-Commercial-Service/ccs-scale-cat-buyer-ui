const weight_staff = [
  'weight_staff_1SoftwareDeveloper',
  'weight_staff_2DevOps',
  'weight_staff_3SecurityArchitect',
  'weight_staff_4InfrastructureEngineer',
  'weight_staff_5NetworkArchitect',
  'weight_staff_6TechnicalArchitect',
  'weight_staff_7DataArchitect',
  'weight_staff_1PerformanceAnalyst',
  'weight_staff_4DataScientist',
  'weight_staff_2DataEngineer',
  'weight_staff_3DataAnalyst',
  'weight_staff_1Delivery',
  'weight_staff_2BusinessAnalysis',
  'weight_staff_7ApplicationsOperations',
  'weight_staff_2BusinessRelationshipManager',
  'weight_staff_3ITServiceManager',
  'weight_staff_1ChangeandReleaseManager',
  'weight_staff_5EngineerInfrastructure',
  'weight_staff_8ServiceTransitionManager',
  'weight_staff_4TechnicalWriter',
  'weight_staff_3ProductManager',
  'weight_staff_5ContentDesigner',
  'weight_staff_9ServiceDeskManager',
  'weight_staff_2Delivery',
  'weight_staff_1BusinessAnalysis',
  'weight_staff_10ProblemManager',
  'weight_staff_11IncidentManager',
  'weight_staff_1GraphicInteractionDesigner',
  'weight_staff_2ServiceDesigner',
  'weight_staff_3UserResearcher',
  'weight_staff_4EngineerEndUser',
  'weight_staff_3ProductManager',
  'weight_staff_6CommandandControl',
  'weight_staff_1UserResearcher',
  'weight_staff_3TechnicalWriter',
  'weight_staff_4ServiceDesigner',
  'weight_staff_5GraphicInteractionDesigner',
  'weight_staff_1TestEngineer',
  'weight_staff_2TestManager',
  'weight_staff_3QATAnalyst',
  'weight_staff_1CommandandControl',
  'weight_staff_2ApplicationsOperations',
  'weight_staff_3IncidentManager',
  'weight_staff_4EngineerInfrastructure',
  'weight_staff_5ServiceDeskManager',
  'weight_staff_6BusinessRelationshipManager',
  'weight_staff_7ProblemManager',
  'weight_staff_8ITServiceManager',
  'weight_staff_9EngineerEndUser',
  'weight_staff_10ServiceTransitionManager',
  'weight_staff_11ChangeandReleaseManager',
  'weight_staff_1TechnicalArchitect',
  'weight_staff_2DataArchitect',
  'weight_staff_3NetworkArchitect',
  'weight_staff_4SoftwareDeveloper',
  'weight_staff_5DevOps',
  'weight_staff_6SecurityArchitect',
  'weight_staff_7InfrastructureEngineer',
  'weight_staff_1DataScientist',
  'weight_staff_2PerformanceAnalyst',
  'weight_staff_2PerformanceAnalyst',
  'weight_staff_3DataEngineer',
  'weight_staff_4DataAnalyst'
]

const weight_vetting = ['weight_vetting_1SoftwareDeveloper',
  'weight_vetting_2DevOps',
  'weight_vetting_3SecurityArchitect',
  'weight_vetting_4InfrastructureEngineer',
  'weight_vetting_5NetworkArchitect',
  'weight_vetting_6TechnicalArchitect',
  'weight_vetting_7DataArchitect',
  'weight_vetting_1TestEngineer',
  'weight_vetting_2TestManager',
  'weight_vetting_3QATAnalyst',
  'weight_vetting_1PerformanceAnalyst',
  'weight_vetting_2DataEngineer',
  'weight_vetting_3DataAnalyst',
  'weight_vetting_4DataScientist',
  'weight_vetting_1ChangeandReleaseManager',
  'weight_vetting_2BusinessRelationshipManager',
  'weight_vetting_3ITServiceManager',
  'weight_vetting_4EngineerEndUser',
  'weight_vetting_5EngineerInfrastructure',
  'weight_vetting_6CommandandControl',
  'weight_vetting_7ApplicationsOperations',
  'weight_vetting_8ServiceTransitionManager',
  'weight_vetting_9ServiceDeskManager',
  'weight_vetting_10ProblemManager',
  'weight_vetting_11IncidentManager'
]


const ccsTabMenuNaviation = () => {
  var tabLinks = document.querySelectorAll('.ons-list__item');
  var tabContainer = document.getElementById('vertical_tab_nav');
  tabLinks[0].getElementsByTagName('a')[0].classList.add('selected');
  const elems = tabContainer.getElementsByTagName('article');
  for (var i = 0; i < elems.length; i++) {
    if (i === 0) {
      elems[i].style.display = 'block';
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
};
let staffs = [];
let vettings = [];
let staffIDs = [];
let vettingIDs = [];
$('#redirect-button-vetting').on('click', function () {
  staffIDs.length = 0;
});

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById("ccs_ca_menu_tabs_form_later") !== null) {
    let inputs;
    let container;
    let oldIdName;
    let oldIdValue;
    let repeated = false;
    //const total_resources = document.getElementById('total-resources');
    const total_staffs = document.getElementById('total-staff');
    const total_vettings = document.getElementById('total-vetting');
    container = document.getElementById('ccs_ca_menu_tabs_form_later');
    inputs = container.getElementsByTagName('input');

    let values = [];
    let keys = [];
    for (let index = 0; index < inputs.length; ++index) {
      inputs[index].value = '';
      inputs[index].addEventListener('focus', function (e) {
        oldIdName = e.currentTarget.id;
        oldIdValue = e.currentTarget.value;
      }, true);
      inputs[index].addEventListener('change', function (event) {
        event.preventDefault();
        let indx = 0;
        if (weight_staff.includes(event.currentTarget.id)) {
          repeated = false;

          if (staffIDs.length !== 0) {
            keys = Object.keys(staffIDs[0]);
            repeated = keys.find(key => {
              if (key === event.currentTarget.id) {
                return key;
              }
            });
          }
          if (repeated === undefined) repeated = false;
          // if there is not repeated element
          if (staffIDs.length === 0 || (repeated !== event.currentTarget.id && !repeated)) {
            const idName = event.currentTarget.id;
            staffIDs.push({ [idName]: event.currentTarget.value });
            //values = Object.values(staffIDs[0]);
            //keys = Object.keys(staffIDs[0]);
            total_staffs.innerHTML = staffIDs.reduce((acc, value, i) => {
              if (staffIDs.length === 1) indx = i + 1;

              console.log('the indx ', Object.values(staffIDs.slice(-1)[0])[0])
              let v = Object.values(staffIDs.slice(-1)[0])[0];
              return (parseInt(acc) + parseInt(v));
            }, 0);
          } else {
            //  if there is repeated element
            const idName = event.currentTarget.id;
            staffIDs.splice(-1, 1, { [idName]: event.currentTarget.value });
            total_staffs.innerHTML = staffIDs.reduce((acc, value, i) => {
              // console.log(Object.values(value)[staffIDs.length - indx])
              //if (staffIDs.length === 1) indx = i + 1;

              let v = Object.values(staffIDs.slice(-1)[0])[0];
              if (oldIdName === idName && staffIDs.length >= 2) {
                oldIdValue = 0;
              }
              return ((parseInt(acc) - Number(oldIdValue)) + parseInt(v));
            }, Number(oldIdValue));
          }
        }
      })
    }
  }
});
