$(document).ready(function () {
    setupRedirect();
});

function setupRedirect() {
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);
    $("#review").attr('action', "/detail/" + id);
}
