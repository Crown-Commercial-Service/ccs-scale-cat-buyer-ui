const weight_staff = ['weight_staff_1SoftwareDeveloper',
  'weight_staff_2DevOps',
  'weight_staff_3SecurityArchitect',
  'weight_staff_4InfrastructureEngineer',
  'weight_staff_5NetworkArchitect',
  'weight_staff_6TechnicalArchitect',
  'weight_staff_7DataArchitect',
  'weight_staff_1TestEngineer',
  'weight_staff_2TestManager',
  'weight_staff_3QATAnalyst',
  'weight_staff_1PerformanceAnalyst',
  'weight_staff_2DataEngineer',
  'weight_staff_3DataAnalyst',
  'weight_staff_4DataScientist',
  'weight_staff_1ChangeandReleaseManager',
  'weight_staff_2BusinessRelationshipManager',
  'weight_staff_3ITServiceManager',
  'weight_staff_4EngineerEndUser',
  'weight_staff_5EngineerInfrastructure',
  'weight_staff_6CommandandControl',
  'weight_staff_7ApplicationsOperations',
  'weight_staff_9ServiceDeskManager',
  'weight_staff_10ProblemManager',
  'weight_staff_11IncidentManager'
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
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById("ccs_ca_menu_tabs_form_later") !== null) {
    let inputs;
    let index;
    let container;

    //const total_resources = document.getElementById('total-resources');
    const total_staffs = document.getElementById('total-staff');
    const total_vettings = document.getElementById('total-vetting');
    container = document.getElementById('ccs_ca_menu_tabs_form_later');
    inputs = container.getElementsByTagName('input');
    for (index = 0; index < inputs.length; ++index) {
      inputs[index].value = '';
      inputs[index].addEventListener('change', function (event) {
        event.preventDefault();

        if (weight_staff.includes(event.currentTarget.id)) {
          let repeated = false;
          if (staffIDs.length !== 0) {
            // Object.keys(staffIDs[0]).find(key => {
            //   console.log('xxxx 1 ', staffIDs[0]);
            //   console.log('xxxx keys ', staffIDs[0][key]);
            //   return staffIDs[key];
            // })
            // for (const [key, value] of Object.entries(staffIDs[0])) {
            //   //console.log(key, value);
            //   repeated = key === event.currentTarget.id;
            //   console.log('repeated ', repeated);
            // }
            // for (let key in staffIDs[0]) {
            //   console.log(key); // Outputs: foo, fiz or fiz, foo
            // }
            repeated = Object.keys(staffIDs[0]).find(key => key === event.currentTarget.id);

          }
          if (staffIDs.length === 0 || repeated !== event.currentTarget.id) {
            const idName = event.currentTarget.id;
            staffIDs.push({ [idName]: event.currentTarget.value });
            total_staffs.innerHTML = staffIDs.reduce((acc, value) => {
              let values = Object.values(value);
              let v = values[0];
              return (parseInt(acc) + parseInt(v));
            }, 0);
          } else {
            const idName = event.currentTarget.id;
            staffIDs.splice(-2, 1, { [idName]: event.currentTarget.value });
            total_staffs.innerHTML = staffIDs.reduce((acc, value) => {
              let values = Object.values(value);
              let v = values[0];
              return (parseInt(acc) + parseInt(v));
            }, 0);
          }
        }
        if (weight_vetting.includes(event.currentTarget.id)) {
          vettings.push(event.currentTarget.value);

        }

        // total_vettings.innerHTML = vettings.reduce((acc, value) => {
        //   return (parseInt(acc) + parseInt(value));
        // }, 0);

      });
    }
  }
});
