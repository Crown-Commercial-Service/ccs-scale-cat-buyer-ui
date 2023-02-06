$('#ccs_collab_view').hide();

let rfiFormURL = "/rfi/get-collaborator-detail/js-enabled";

$('#potential-collaborator').hide()

$('#rfi_collaborators').on('change', function () {
  let id = this.value;

  if (id !== "") {
    let data = {
      "rfi_collaborators": id
    }

    var ajaxRequest = $.post(rfiFormURL, data, function (data) {

      let { userName, firstName, lastName, tel } = data;
      let collegueName = firstName + " " + lastName;
      let id = userName;

      $('#potential-collaborator').show()

      $('#show_collab_name').html(collegueName)
      $('#show_collab_email').html(id)
      $('#show_collab-phone').html(tel)

      $("#rfi_collaborator_append").val(id);
      $('#ccs_collab_add').prop("disabled", false)

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
  }



});