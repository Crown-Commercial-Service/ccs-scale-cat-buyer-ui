// Dashboard pagination starts
$(document).ready(function () {
    // Active event 
    $('#active-data').after('<div class="ccs-pagination" id="nav"><p class="govuk-visually-hidden" aria-labelledby="pagination-label">Pagination navigation</p></div>');
    var rowsShown = 5;
    var rowsTotal = $('#active-data tbody tr').length;
    var numPages = rowsTotal / rowsShown;
    var pageNum = 0;
    $('#nav').append('<a id="active-data-previous" rel="0" class="ccs-pagination__link" href="#">Previous<span class="govuk-visually-hidden"> set of pages</span></a>');
    for (i = 0; i < numPages; i++) {
      pageNum = i + 1;
      $('#nav').append('<a class="ccs-pagination__link" id="pageId_'+i+'" href="#" rel="' + i + '">' + pageNum + '</a> ');
    }
    $('#nav').append('<a id="active-data-next" rel="1" class="ccs-pagination__link" href="#">Next<span class="govuk-visually-hidden"> set of pages</span></a>');
    $('#active-data-previous').addClass("govuk-visually-hidden");
    $('#nav').append('<span class="govuk-visually-hidden" id="total_page_active_event">' + pageNum + '</span> ');
  
    $('#nav').append('<p class="ccs-pagination__results">Showing <b><label id="start_count">1</label></b> to <b><label id="end_count">' + rowsShown + '</label></b> of <b><label id="total_count">' + rowsTotal + '</label></b> results</p>');
    $('#active-data tbody tr').hide();
    $('#active-data tbody tr').slice(0, rowsShown).show();
    $('#nav a:nth-child(3)').addClass('ccs-pagination__item--active');
    $('#nav a').bind('click', function () {
      var currPage = $(this).attr('rel');
      var activePage = "#pageId_"+currPage;
      $('#nav a').removeClass('ccs-pagination__item--active');
      $(activePage).addClass('ccs-pagination__item--active');
      
      if (currPage != 0) {
        $("#active-data-previous").attr('rel', parseInt(currPage) - 1);
        $('#active-data-previous').removeClass("govuk-visually-hidden");
      } else {
        $('#active-data-previous').addClass("govuk-visually-hidden");
      }
  
      if (parseInt($('#total_page_active_event')[0].innerHTML) - parseInt(currPage) != 1) {
        $("#active-data-next").attr('rel', parseInt(currPage)+1);
        $('#active-data-next').removeClass("govuk-visually-hidden");
      } else {
        $('#active-data-next').addClass("govuk-visually-hidden");
        $("#active-data-next").attr('rel', parseInt(currPage)+1);
      }
  
      var startItem = currPage * rowsShown;
      var endItem = startItem + rowsShown;
  
      document.getElementById('start_count').innerHTML = startItem + 1;
      if (document.getElementById('total_count').innerHTML < endItem) {
        document.getElementById('end_count').innerHTML = document.getElementById('total_count').innerHTML;
      } else {
        document.getElementById('end_count').innerHTML = endItem;
      }
  
      $('#active-data tbody tr').css('opacity', '0.0').hide().slice(startItem, endItem).
        css('display', 'table-row').animate({ opacity: 1 }, 300);
      return false;
    });
  });
  
    // Historical event
    $(document).ready(function () {
    $('#historical-data').after('<div class="ccs-pagination" id="historical-nav"><p class="govuk-visually-hidden" aria-labelledby="pagination-label">Pagination historical-navigation</p></div>');
    var rowsShown = 5;
    var rowsTotal = $('#historical-data tbody tr').length;
    var numPages = rowsTotal / rowsShown;
    var pageNum = 0;
    $('#historical-nav').append('<a id="historical-data-previous" rel="0" class="ccs-pagination__link" href="#">Previous<span class="govuk-visually-hidden"> set of pages</span></a>');
    for (i = 0; i < numPages; i++) {
      pageNum = i + 1;
      $('#historical-nav').append('<a class="ccs-pagination__link" id="pageId_'+i+'" href="#" rel="' + i + '">' + pageNum + '</a> ');
    }
    $('#historical-nav').append('<a id="historical-data-next" rel="1" class="ccs-pagination__link" href="#">Next<span class="govuk-visually-hidden"> set of pages</span></a>');
    $('#historical-data-previous').addClass("govuk-visually-hidden");
    $('#historical-nav').append('<span class="govuk-visually-hidden" id="total_page_active_event">' + pageNum + '</span> ');
  
    $('#historical-nav').append('<p class="ccs-pagination__results">Showing <b><label id="start_count">1</label></b> to <b><label id="end_count">' + rowsShown + '</label></b> of <b><label id="total_count">' + rowsTotal + '</label></b> results</p>');
    $('#historical-data tbody tr').hide();
    $('#historical-data tbody tr').slice(0, rowsShown).show();
    $('#historical-nav a:nth-child(3)').addClass('ccs-pagination__item--active');
    $('#historical-nav a').bind('click', function () {
      var currPage = $(this).attr('rel');
      var activePage = "#pageId_"+currPage;
      $('#historical-nav a').removeClass('ccs-pagination__item--active');
      $(activePage).addClass('ccs-pagination__item--active');
      
      if (currPage != 0) {
        $("#historical-data-previous").attr('rel', parseInt(currPage) - 1);
        $('#historical-data-previous').removeClass("govuk-visually-hidden");
      } else {
        $('#historical-data-previous').addClass("govuk-visually-hidden");
      }
  
      if (parseInt($('#total_page_active_event')[0].innerHTML) - parseInt(currPage) != 1) {
        $("#historical-data-next").attr('rel', parseInt(currPage)+1);
        $('#historical-data-next').removeClass("govuk-visually-hidden");
      } else {
        $('#historical-data-next').addClass("govuk-visually-hidden");
        $("#historical-data-next").attr('rel', parseInt(currPage)+1);
      }
  
      var startItem = currPage * rowsShown;
      var endItem = startItem + rowsShown;
  
      document.getElementById('start_count').innerHTML = startItem + 1;
      if (document.getElementById('total_count').innerHTML < endItem) {
        document.getElementById('end_count').innerHTML = document.getElementById('total_count').innerHTML;
      } else {
        document.getElementById('end_count').innerHTML = endItem;
      }
  
      $('#historical-data tbody tr').css('opacity', '0.0').hide().slice(startItem, endItem).
        css('display', 'table-row').animate({ opacity: 1 }, 300);
      return false;
    });
  });
  // Dashboard pagination ends