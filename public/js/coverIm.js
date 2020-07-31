$(document).ready(function () {
    showCover();
});

function showCover() {
    var cover = $('#cover');
    var title = $('#title').text();
    var author = $('#author').text();
    var url= null;
    $.get("https://www.googleapis.com/books/v1/volumes?q=" + title + "+" + author + "&maxResults=1&projection=lite", function (request, response) {
        cover.attr('src', request.items[0].volumeInfo.imageLinks.thumbnail);
        url=request.items[0].volumeInfo.imageLinks.thumbnail;
    });
    if(url == null){
         $.get("https://www.googleapis.com/books/v1/volumes?q=" + title + "&maxResults=1&projection=lite", function (request, response) {
        cover.attr('src', request.items[0].volumeInfo.imageLinks.thumbnail);
    });
    }
}