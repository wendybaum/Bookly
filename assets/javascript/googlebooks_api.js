function updatePage(libraryBooks) {  
    var numBooks = libraryBooks.totalItems;
    console.log("num books:"+ numBooks);
 
    // build ui elements for the number of books in the library
    for (var i = 0; i < numBooks; i++) {        
      // get a specific book from the library
      var book = libraryBooks.items[i];
      console.log("------------------------------------");
      console.log("book", book);            
      newCard(i, book);
    }
 }

 function newCard(i, book) {
  console.log("index: " + i);  
  
  // main card div
  var htmlCard = $("<div class='card'></div>");

  // book thumbnail  
  htmlCard.append($("<img class='card-img-top'></img>").attr("id", "image_" + i));

  // card summary div
  htmlCard.append($("<div class='card-body'></div>").append("<p class='card-text'></p>").attr("id", "summary_" + i));

  // book details
  var list = $("<ul class='list-group list-group-flush'></ul>");
  // TBD list items 
  // list.append($("class='list-group-item'"));
  // list.append($("class='list-group-item'")).attr("id", "isbn_" + i).text("item 2");
  // list.append($("class='list-group-item'")).attr("id", "publisher_" + i).text("item 3");
  // list.append($("class='list-group-item'")).attr("id", "year_" + i).text("item 4");
  htmlCard.append(list);

  // open library link
  htmlCard.append($("<div class='card-body'></div>")
  .append("<a href='#' class='card-link'><i class='fas fa-link'></i><span class='space'>OL link</span></a>"))
  .attr("id", "link_" + i);

  console.log("new card: ", htmlCard);
  $("#results").append(htmlCard);
  populateCard(i, book); 
 
 }

 function populateCard(i, book) {
   // key in isbn 10 format to retrieve data from Open Library API
  var isbn = book.volumeInfo.industryIdentifiers[1].identifier;      

  $("#image_" + i).attr("src", book.volumeInfo.imageLinks.thumbnail);  
  $("#summary_" + i).text(book.volumeInfo.description); 

  // TBD use jquery to select list items by id none of these worked
  //$("#author").innerText = book.volumeInfo.authors[0];
  //$("#author").innerHTML = book.volumeInfo.authors[0];    
  //$("#author").value = book.volumeInfo.authors[0];
  //$("#author").textContent = book.volumeInfo.authors[0];
  //$("#author").text(book.volumeInfo.authors[0]);
  // TBD Can the static strings be done in the html instead
  // document.getElementsByClassName('list-group-item')[0].innerHTML = "Author: " + book.volumeInfo.authors[0];
  // document.getElementsByClassName('list-group-item')[2].innerHTML = "Publisher: " + book.volumeInfo.publisher;
  // document.getElementsByClassName('list-group-item')[3].innerHTML = "Date Published: " + book.volumeInfo.publishedDate;
  // document.getElementsByClassName('list-group-item')[1].innerHTML = isbn;

  // for testing: first url returns {}
  // "https://openlibrary.org/api/books?bibkeys=ISBN:1786469561&format=json&callback=mycallback"
  // "https://openlibrary.org/api/books?bibkeys=ISBN:1593272820&format=json&callback=mycallback"
  var queryURL2 = "https://openlibrary.org/api/books?bibkeys=ISBN:" + isbn + "&format=json"
  console.log("queryURL2: " + queryURL2);

  // call to Open Library API to get link to free online version of book by ISBN
  // the response is passed as an argument to updateLink
   $.ajax({
     url: queryURL2,
     method: "GET"
   }).then(updateLink);

   function updateLink (response) {
    console.log("updateLink response: ", response)    
    var link = "https://openlibrary.org/isbn/" + isbn;
    console.log("link: " + link);
     // test only; doesn't link to free version yet
    $('#link_' + i).attr('href', link);
  }
}

// handle Submit button
$("#submitBtn").on("click", function(event) {
  event.preventDefault();
  
  var userId = $("#bookUserId").val().trim();
  console.log("userId = " + userId);
  var bookShelfId = 2;

  // Wendy test url    
  //var queryURL = "https://www.googleapis.com/books/v1/users/114631064343079059920/bookshelves/2/volumes";
  // Rob test url
  var queryURL = "https://www.googleapis.com/books/v1/users/110649015730155949938/bookshelves/2/volumes";

  // actual url  
  //var queryURL = "https://www.googleapis.com/books/v1/users/" + userId + "/bookshelves/" + bookShelfId + "/volumes";
  console.log("queryURL: " + queryURL)

  // call to Google Books API to get books from 'To Read' Library
  // the response is passed as an argument to updatePage
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(updatePage);

});
 