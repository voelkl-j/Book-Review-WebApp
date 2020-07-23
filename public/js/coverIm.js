$(document).ready(function () {
    console.log("works");
    showCover();
});

function showCover() {
    var cover = $('#cover');
    var isbn = $('#isbn').text();
    var url;
    $.get("https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn + "&maxResults=1&projection=lite", function (Request, Response) {
        url = Response.items[0].imageLinks.thumbnail;
    });
    cover.attr('src', url);
}