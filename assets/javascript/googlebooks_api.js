function updatePage(libraryBooks) {
  
    var numBooks = libraryBooks.totalItems;
    console.log("num books:"+ numBooks);
 
    // build elements for the number of books
    for (var i = 0; i < numBooks - 1; i++) {
      // get specific book
      var book = libraryBooks.items[i];
      console.log("------------------------------------");
      console.log("book", book);    
 
      $(".card-img-top").attr("src", book.volumeInfo.imageLinks.thumbnail);
      $(".card-title").text(book.volumeInfo.title);
      $(".card-text").text(book.volumeInfo.description);
     
      // nne of these worked
      //$("#author").innerText = book.volumeInfo.authors[0];
      //$("#author").innerHTML = book.volumeInfo.authors[0];    
      //$("#author").value = book.volumeInfo.authors[0];
      //$("#author").textContent = book.volumeInfo.authors[0];
      
      document.getElementsByClassName('list-group-item')[0].innerHTML= book.volumeInfo.authors[0];
      document.getElementsByClassName('list-group-item')[1].innerHTML= book.volumeInfo.industryIdentifiers[0].identifier;
      document.getElementsByClassName('list-group-item')[2].innerHTML= book.volumeInfo.publisher;
      document.getElementsByClassName('list-group-item')[3].innerHTML= book.volumeInfo.publishedDate;  
      
    }
 }
 
 // handle Submit button
 $("#submitBtn").on("click", function(event) {
     event.preventDefault();
     
     var userId = $("#goodReadsUserId").val().trim();
     console.log("userId = " + userId);
     var bookShelfId = 2;
 
     // test url    
     //var queryURL = "https://www.googleapis.com/books/v1/users/114631064343079059920/bookshelves/2/volumes";
    
     var queryURL = "https://www.googleapis.com/books/v1/users/" + userId + "/bookshelves/" + bookShelfId + "/volumes";
     console.log(queryURL)
 
     // call to Google Books API to get books in To Read Library
     // response is passed as an argument to updatePage
     $.ajax({
       url: queryURL,
       method: "GET"
     }).then(updatePage);
    
 });
 
 