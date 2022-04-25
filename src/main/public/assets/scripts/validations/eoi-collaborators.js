$('#ccs_collab_view').hide();

let formURL = "/eoi/get-collaborator-detail/js-enabled";

if (document.getElementById("eoi_collaborators") !== null) {
  document.getElementById('eoi_collaborators').addEventListener('change', function () {
    let id = this.value;
    if (id !== "") {
      let data = {
        "eoi_collaborators": id
      }

      var ajaxRequest = $.post(formURL, data, function (data) {

        let { userName, firstName, lastName, tel } = data;
        let collegueName = firstName + " " + lastName;
        let id = userName;

        $('#eoi_show_collab_name').html(collegueName)
        $('#eoi_show_collab_email').html(id)
        $('#eoi_show_collab-phone').html(tel)

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
      $('#eoi_show_collab_name').html("")
      $('#eoi_show_collab_email').html("")
      $('#eoi_show_collab-phone').html("")
    }
  })
}