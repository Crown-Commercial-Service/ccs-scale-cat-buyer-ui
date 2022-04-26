var inactiviyTime = 0;
let logoutlocationURL = window.location.origin + '/oauth/logout'
var inactivateAfter = 15;

$(document).ready(function () {
    // Increment the idle time counter every minute.
    var idleInterval = setInterval(timerIncrement, 60000); // 1 minute

       // Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        inactiviyTime = 0;
    });
    $(this).keypress(function (e) {
        inactiviyTime = 0;
    });
});

function timerIncrement() {
    inactiviyTime = inactiviyTime + 1;

    if (inactiviyTime > inactivateAfter) { // 15 minutes
        window.location.href= logoutlocationURL
    }
}