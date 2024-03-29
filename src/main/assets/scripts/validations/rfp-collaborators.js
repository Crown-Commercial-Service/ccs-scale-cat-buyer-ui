$('#ccs_collab_view').hide();

let rfpFormURL = "/rfp/get-collaborator-detail/js-enabled";

$('#potential-collaborator').hide()

$('#rfp_collaborators').on('change', function () {
  let id = this.value;
    
  if (id !== "") {
    let data = {
      "rfp_collaborators": id
    }

    var ajaxRequest = $.post(rfpFormURL, data, function (data) {

      let { userName, firstName, lastName, tel } = data;
      let collegueName = firstName + " " + lastName;
      let id = userName;
      $('#potential-collaborator').show()
      $('#show_collab_name').html(collegueName)
      $('#show_collab_email').html(id)
      $('#show_collab-phone').html(tel)

      $("#rfp_collaborator_append").val(id);
      $('#ccs_collab_add').prop("disabled", false)
      $('.addcolleaguedetailsdos').show();
    })
      .fail(function () {
        console.log("failed")
      })
      .always(function () {
        console.log("finsihed")
      });
  }
  else {
    $('#show_collab_name').html("")
    $('#show_collab_email').html("")
    $('#show_collab-phone').html("")
    $('#ccs_collab_add').prop("disabled", true)
    $('.addcolleaguedetailsdos').hide();
  }



});

$('.add').addClass('ccs-dynaform-hidden');