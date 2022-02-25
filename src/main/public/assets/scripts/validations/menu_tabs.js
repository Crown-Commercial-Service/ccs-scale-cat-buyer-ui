


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
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById("ccs_ca_menu_tabs_form_later") !== null) {
    let inputs;
    let index;
    let container;
    container = document.getElementById('ccs_ca_menu_tabs_form_later');
    inputs = container.getElementsByTagName('input');
    for (index = 0; index < inputs.length; ++index) {
      inputs[index].value = '';
    }
    document.getElementById('ccs_eoi_procurement_lead').addEventListener('change', function (event) {
      event.preventDefault();

    });
  }
});
