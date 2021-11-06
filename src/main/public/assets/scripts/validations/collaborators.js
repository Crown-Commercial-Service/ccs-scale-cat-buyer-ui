document.addEventListener('DOMContentLoaded', () => {

  if (document.getElementById("ccs_add_rfi_collab") !== null) {

    document.getElementById('potential-collaborator').classList.add('ccs-dynaform-hidden');
   
    let deleteButtons = document.querySelectorAll("a.del");
    deleteButtons.forEach((db) => {
      db.addEventListener('click', function (event) {
        event.preventDefault();
        let target = event.target.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
        prev_coll = Number(target);
        $.ajax({
          url: "/rfi/delete-rfi-collaborator?id=" + prev_coll,
          type: "POST",
          contentType: "application/json"
        }).done(function (result) {
          console.log(result);
          const parent_node = document.getElementById('collaborators-section');
          const node_to_remove = document.getElementById("rfi_collaborator_" + result.id);
          parent_node.removeChild(node_to_remove);
          var userOp = document.createElement('option');
          userOp.value = result.id;
          userOp.text = result.fullname;
          document.getElementById('rfi_collaborators').appendChild(userOp);
        });
      });
    });

    document.getElementById('rfi_collaborators').addEventListener('change', function (event) {
      event.preventDefault();
      if (event.target.value !== "0") {
        console.log({msg: "/rfi/get-collaborator-detail?id=" + event.target.value})
        $.ajax({
          url: "/rfi/get-collaborator-detail?id=" + event.target.value,
          type: "POST",
          contentType: "application/json",
          //data: JSON.stringify({ id: 2 })
        }).done(function (result) {
          document.getElementById('potential-collaborator').classList.remove('ccs-dynaform-hidden');
          setUserDetails(result);
        });
      }

    });

    const setUserDetails = (user) => {
      let div_email = document.getElementById('collab_email');
      div_email.innerText = user.email;
      let div_tel = document.getElementById('collab_tel');
      div_tel.innerText = user.telephone;
      let div_name = document.getElementById('collab_name');
      div_name.innerText = user.fullname;
    };

    document.getElementById('ccs_collab_add').addEventListener('click', function (event) {
      event.preventDefault();

      $.ajax({
        url: "/rfi/add-rfi-collaborator?id=" +  document.getElementById('rfi_collaborators').value,
        type: "POST",
        contentType: "application/json",
      //data: JSON.stringify({ id: 2 })
      }).done(function (result) {
        let parentNode = document.getElementById('collaborators-section');
      //clone the detail element 
      let clone = document.querySelector('#potential-collaborator-detail').cloneNode(true);
      clone.setAttribute('id', "rfi_collaborator_" + document.getElementById('rfi_collaborators').value);
      let anchorTag = document.createElement('a');
      anchorTag.href = document.getElementById('rfi_collaborators').value;
      anchorTag.innerText = 'Remove';
      anchorTag.classList.add('del', 'govuk-link', 'govuk-link--no-visited-state');
      anchorTag.addEventListener('click', RemoveUser);
      anchorTag.title = 'delete';
      clone.prepend(anchorTag);
      clone.classList.add('ccs-page-section');

      // add it to parent div
      parentNode.prepend(clone);
      [...document.getElementById('rfi_collaborators').options]
    .filter(opt_val => opt_val.value === result.id)
    .forEach(opt_val => opt_val.remove());
      document.getElementById('potential-collaborator').classList.add('ccs-dynaform-hidden');
      });
     
    });

    const RemoveUser = (event) => {
       event.preventDefault();
      let target = event.target.href.replace(/^(.+\/)(\d{1,2})$/, "$2"),
      prev_coll = Number(target);
      $.ajax({
        url: "/rfi/delete-rfi-collaborator?id=" + prev_coll,
        type: "POST",
        contentType: "application/json"
      }).done(function (result) {
        const parent_node = document.getElementById('collaborators-section');
        const node_to_remove = document.getElementById("rfi_collaborator_" + prev_coll);
        parent_node.removeChild(node_to_remove);
        var userOp = document.createElement('option');
        userOp.value = result.id;
        userOp.text = result.fullname;
        document.getElementById('rfi_collaborators').appendChild(userOp);
      });

    }

  }

});

