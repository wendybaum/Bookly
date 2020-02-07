function updatePage(libraryBooks) {  
    var numBooks = libraryBooks.totalItems;
    console.log("num books:"+ numBooks);
 
    // build elements for the number of books
    for (var i = 0; i < numBooks - 1; i++) {        
      // get a specific book from the library
      var book = libraryBooks.items[i];
      console.log("------------------------------------");
      console.log("book", book);  
     
      buildCard(book);        
    }
 }

 function buildCard(book) {
   // key in isbn 10 format to retrieve data from Open Library API
  var isbn = book.volumeInfo.industryIdentifiers[1].identifier;    

  $(".card-img-top").attr("src", book.volumeInfo.imageLinks.thumbnail);
  $(".card-title").text("Title: " + book.volumeInfo.title);
  $(".card-text").text("Description: " + book.volumeInfo.description);
  // test
  $('.card-link').attr('href', "https://openlibrary.org/isbn/" + isbn);

  // none of these worked
  //$("#author").innerText = book.volumeInfo.authors[0];
  //$("#author").innerHTML = book.volumeInfo.authors[0];    
  //$("#author").value = book.volumeInfo.authors[0];
  //$("#author").textContent = book.volumeInfo.authors[0];
  // TBD Can the static strings be done in the html
  document.getElementsByClassName('list-group-item')[0].innerHTML = "Author: " + book.volumeInfo.authors[0];
  document.getElementsByClassName('list-group-item')[2].innerHTML = "Publisher: " + book.volumeInfo.publisher;
  document.getElementsByClassName('list-group-item')[3].innerHTML = "Date Published: " + book.volumeInfo.publishedDate;
  document.getElementsByClassName('list-group-item')[1].innerHTML = isbn;

  // returns {}
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
    //var linkObj = "ISBN:" + isbn +"." + "info_url"; 
    //var linkObj = "ISBN:" + isbn +"."    
    //console.log("linkObj: " + linkObj);
    //var link = linkObj.toString().info_url;
    var link = "https://openlibrary.org/isbn/" + isbn;
    console.log("link: " + link);
  }
}




// handle Submit button
$("#submitBtn").on("click", function(event) {
  event.preventDefault();
  
  var userId = $("#bookUserId").val().trim();
  console.log("userId = " + userId);
  var bookShelfId = 2;

  // test url    
  var queryURL = "https://www.googleapis.com/books/v1/users/114631064343079059920/bookshelves/2/volumes";
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
 