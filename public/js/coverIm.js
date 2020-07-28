$(document).ready(function () {
    showCover();
});

function showCover() {
    var cover = $('#cover');
    var title = $('#title').text();
    var url="";
    $.get("https://www.googleapis.com/books/v1/volumes?q=" + title + "&maxResults=1&projection=lite", function (request, response) {
         cover.attr('src', request.items[0].volumeInfo.imageLinks.thumbnail);
    });
}
