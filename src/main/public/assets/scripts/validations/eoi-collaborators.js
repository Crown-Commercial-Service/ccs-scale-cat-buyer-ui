$('#ccs_collab_view').hide();

let formURL = "/eoi/get-collaborator-detail/js-enabled";


$('#eoi_collaborators').on('change', function () {
  let id = this.value;

  if (id !== "") {
    let data = {
      "eoi_collaborators": id
    }

    var ajaxRequest = $.post(formURL, data, function (data) {

      let { userName, firstName, lastName, tel } = data;
      let collegueName = firstName + " " + lastName;
      let id = userName;

      $('#show_collab_name').html(collegueName)
      $('#show_collab_email').html(id)
      $('#show_collab-phone').html(tel)

      $("#eoi_collaborator_append").val(id);


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
  }



});