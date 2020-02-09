/* Entry point: builds a HTML card populated with book details for each book in the library */
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

 /* Build a HTML Card */
 function newCard(i, book) {
  console.log("index: " + i);  

//   $('<div/>',{
//     text: 'Div text',
//     class: 'className'
// }).appendTo('#parentDiv');
  
  // main card div
  var htmlCard = $("<div class='card'></div>");
  
    // book thumbnail  
  var imageDiv = $("<div class='card-image waves-effect waves-block waves-light'></div>");  
  imageDiv.append($("<img class='card-img-top activator'></img>").attr("id", "image_" + i));
  htmlCard.append(imageDiv);

  // card content
  var contentDiv = $("<div class='card-content'></div>");
  contentDiv.append($("<span class='card-title activator grey-text text-darken-4'>'Card Title'<i class='material-icons right>'more_vert'</i></span>").attr("id", "title_1" + i));

  // open library link
  var imagePara = $("<p></p>").append($("<a href='#' class='card-link'>Free Version</span></a>").attr("id", "link_" + i));
  contentDiv.append(imagePara);
  htmlCard.append(contentDiv);
  
  // card reveal div
  var revealDiv = $("<div class='card-reveal'></div>").append("<p class='card-text'></p>");
  var span = $("<span 'card-title grey-text text-darken-4'>'Card Title'<i class='material-icons right'>close</i></span>").attr("id", "title_2" + i);
  revealDiv.append(span);
  revealDiv.append($("<p class='card-text'>'Some quick example text to build on the card title and make up the bulk of the card content.'</p>")).attr("id", "summary_" + i);

  // book details
  var list = $("<ul class='list-group list-group-flush'></ul>");  
  list.append($("<li class='list-group-item'></li>").attr("id", "author_" + i));
  list.append($("<li class='list-group-item'></li>").attr("id", "isbn_" + i));
  list.append($("<li class='list-group-item'></li>").attr("id", "publisher_" + i));
  list.append($("<li class='list-group-item'></li>").attr("id", "year_" + i));
  revealDiv.append(list);

  htmlCard.append(revealDiv);  
  console.log("htmlCard ==>", htmlCard);

  $("#results").append(htmlCard);
  populateCard(i, book); 
 
 }

 /* Add data from Google Books and Open Libary to the HTML Card */
 function populateCard(i, book) {
   // key in isbn 10 format to retrieve data from Open Library API
   var isbn = book.volumeInfo.industryIdentifiers[1].identifier;  
   
  $("#title_1" + i).text(book.volumeInfo.title); 
  $("#title_2" + i).text(book.volumeInfo.title); 
  $("#image_" + i).attr("src", book.volumeInfo.imageLinks.thumbnail);  
  $("#summary_" + i).text(book.volumeInfo.description); 
  $("#author_" + i).text(book.volumeInfo.authors[0]);
  $("#publisher_" + i).text(book.volumeInfo.publisher);
  $("#year_" + i).text(book.volumeInfo.publishedDate);
  $("#isbn_" + i).text(book.volumeInfo.isbn);

  // for testing: first url returns {}
  // "https://openlibrary.org/api/books?bibkeys=ISBN:1786469561&format=json&callback=mycallback"
  // "https://openlibrary.org/api/books?bibkeys=ISBN:1593272820&format=json&callback=mycallback"
  var queryURL2 = "https://openlibrary.org/api/books?bibkeys=ISBN:" + book.volumeInfo.isbn + "&format=json"
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
     // TBD doesn't link to free version yet
    $('#link_' + i).attr('href', link);
  }
}

/* Handle Submit button */
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
 