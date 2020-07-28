$(document).ready(
    function(){
        $("#searchField").keyup(fetchJSONData);
        console.log("works");
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
    //alert("Results recieved..." + data);
    var searchResults= $("#searchResults");
    searchResults.empty();
  
    for(var i=0; i< data.books.length; i++){
        var book = $("<li></li>");
        var bookLink = $("<a></a>");
        bookLink.html(data.books[i].title);
        var link= "/detail/" + data.books[i].id;
        bookLink.attr("href", link);
        book.append(bookLink);
        searchResults.append(book);
        console.log(data);
    }
    
}

function errorRequestingData(requestObject, textStatus, errorThrown) {
    alert("Error receiving results..." + textStatus + ":" + errorThrown);
}