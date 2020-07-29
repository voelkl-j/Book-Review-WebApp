$(document).ready(
    function(){
        $("#searchField").keyup(fetchJSONData);
    }
);

function fetchJSONData(Event) {
    var url = "/searchdata";
    var input= Event.target;
    $.ajax({
        type: 'POST',
        url: url,
        dataType: "json",
        data: {text: input.value},
        success: resultsRecieved,
        error: errorRequestingData
    });
}

function resultsRecieved(data) {
    var searchResults= $("#searchResults");
    searchResults.empty();
    
    if(data.books.length==0){
        var book = $("<li></li>");
        book.html("No Match. Sorry!");
        searchResults.append(book);
    }
  
    for(var i=0; i< data.books.length; i++){
        var book = $("<li></li>");
        var bookLink = $("<a></a>");
        bookLink.html(data.books[i].title);
        var link= "/detail/" + data.books[i].id;
        bookLink.attr("href", link);
        book.append(bookLink);
        searchResults.append(book);
    }
    
}

function errorRequestingData(requestObject, textStatus, errorThrown) {
    alert("Error receiving results..." + textStatus + ":" + errorThrown);
}