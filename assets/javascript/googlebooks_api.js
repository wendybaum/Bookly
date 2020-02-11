/* Entry point: builds a HTML card populated with book details for each book in the library */
function updatePage(libraryBooks) {  
  var numBooks = libraryBooks.totalItems;
  console.log("num books: "+ numBooks);

  // build ui elements for the number of books in the library
  for (var i = 0; i < numBooks; i++) {        
    // get one book from the library and create a html bootstrap card
    var book = libraryBooks.items[i];
    //console.log("------------------------------------");
    //console.log("book: ", book); 
    if (!$.isEmptyObject(book)) {
      newCard(i, book);
    }  else {
      console.log("Empty book!");
    }         
   
  }
}

/* Build a HTML Card */
function newCard(i, book) {
  console.log("index: " + i);  

  // main card div
  var htmlCard = $("<div class='card'></div>");

    // book thumbnail  
  var imageDiv = $("<div class='card-image waves-effect waves-block waves-light'></div>");  
  imageDiv.append($("<img class='card-img-top activator'></img>").attr("id", "image_" + i));
  htmlCard.append(imageDiv);

  // card content
  var contentDiv = $("<div class='card-content'></div>");

  // this works to show the 3 dots but then title cannot be set because there is no id attribute to key on
  //var span1 = $("<span class='card-title activator grey-text text-darken-4'>Card Title<i class='material-icons right'>more_vert</i></span>");

  // TBD does not work to add id to span element like this - the 3 dots do not appear.  Added a little hack in populate card
  var span1 = $("<span class='card-title activator grey-text text-darken-4'>Card Title<i class='material-icons right'>more_vert</i></span>").attr("id", "title1_" + i);

  contentDiv.append(span1);

  // open library link
  var imagePara = $("<p></p>").append($("<a href='#' class='card-link'></span></a>").attr("id", "link_" + i));
  contentDiv.append(imagePara);
  htmlCard.append(contentDiv);

  // card reveal div
  var revealDiv = $("<div class='card-reveal'></div>");

  // TBD same issues as title1_ above
  var span2 = $("<span class='card-title grey-text text-darken-4'>Card Title<i class='material-icons right'>close</i></span>").attr("id", "title2_" + i);
  revealDiv.append(span2);
  revealDiv.inner
  var textPara = $("<p class='card-text'>Some quick example text to build on the card title.</p>").attr("id", "summary_" + i);
  revealDiv.append(textPara);

  // book details
  var list = $("<ul class='list-group list-group-flush'></ul>");  
  list.append($("<li class='list-group-item'>Author: Unknown</li>").attr("id", "author_" + i));
  list.append($("<li class='list-group-item'>ISBN: Unknown</li>").attr("id", "isbn_" + i));
  list.append($("<li class='list-group-item'>Publisher: Unknown</li>").attr("id", "publisher_" + i));
  list.append($("<li class='list-group-item'>Year: Unknown</li>").attr("id", "year_" + i));
  revealDiv.append(list);

  htmlCard.append(revealDiv);   

  $("#results").append(htmlCard);
  populateCard(i, book); 

}

/* Add data from Google Books and Open Libary to the HTML Card */
function populateCard(i, book) {
 
  // key in isbn 10 format to retrieve data from Open Library API
  var isbn = book.volumeInfo.industryIdentifiers[1].identifier; 
  console.log("isbn: " + isbn) 
  
  // append a little hack below to show 'more details' and close 'more details' prompts
  var title = book.volumeInfo.title;
  console.log("title: " + title);
  if (title  !== "") {
    $("#title1_" + i).text(title + "  ..."); 
    $("#title2_" + i).text(title + "     x"); 
  };

  if (book.volumeInfo.imageLinks.thumbnail  !== "") {
    $("#image_" + i).attr("src", book.volumeInfo.imageLinks.thumbnail); 
  };

  if (book.volumeInfo.description !== "") {
    $("#summary_" + i).text(book.volumeInfo.description); 
  };

  if (book.volumeInfo.authors[0] !== "") {
    $("#author_" + i).text("Author: " + book.volumeInfo.authors[0]);
  };

  if (book.volumeInfo.publishedDate !== "") {
    $("#year_" + i).text("Published: " + book.volumeInfo.publishedDate);  
  };

  if (book.volumeInfo.publisher !== "") {
    $("#publisher_" + i).text("Publisher: " + book.volumeInfo.publisher);

  if (isbn !== "") { 
    $("#isbn_" + i).text("ISBN: " + isbn);
    // call to Open Library API to get link to free online version of book by ISBN
    // the response is passed as an argument to getFreeVersionLink
    var queryURL2 = "https://openlibrary.org/api/books?bibkeys=ISBN:" + isbn + "&format=json";
    console.log("queryURL2: " + queryURL2);
    // api will full details
    //var queryURL3 = "http://openlibrary.org/api/volumes/brief/isbn/" + isbn + ".json";
    //console.log("queryURL3: " + queryURL3);
    
   
    $.ajax({
      url: queryURL2,
      method: "GET"
    }).then(getFreeVersionLink);
  };

}; 

 function getFreeVersionLink(response) {
   
   if (Object.keys(response).length === 0 && response.constructor === Object) {
     // do nothing
     console.log("No data found in Open Library for isbn: " + isbn);
   } else {
     var isFreeVersion = response["ISBN:" + isbn].preview;
     var previewUrl = response["ISBN:" + isbn].preview_url;
     console.log("viewable: " + isFreeVersion);
     console.log("preview_url: " + previewUrl);

     if (isFreeVersion === "full" || isFreeVersion === "borrow") {
       console.log("YAY I found a free version");
       var link = "https://openlibrary.org/isbn/" + isbn;
       console.log("Free book link: " + link);
       $("#link_" + i).text("Free Version");
       $("#link_" + i).attr("href", link);
     } else if (isFreeVersion === "restricted") {
       $("#link_" + i).text("Preview");
       $("#link_" + i).attr("href", previewUrl);
     } else if (isFreeVersion === "noview") {
       // no preview is available
     }
   }
 }
}

/* Handle Submit button */
$("#submitBtn").on("click", function(event) {
  event.preventDefault();
  // make sure you start with no cards
  document.getElementById("results").innerHTML = ""; 
  
  var userId = $("#bookUserId").val().trim();
  console.log("userId = " + userId);
  var bookShelfId = 2;

  // Wendy test url    
  //var queryURL = "https://www.googleapis.com/books/v1/users/114631064343079059920/bookshelves/2/volumes";
  // Rob test url
  //var queryURL = "https://www.googleapis.com/books/v1/users/110649015730155949938/bookshelves/2/volumes";

  // actual url  
  var queryURL = "https://www.googleapis.com/books/v1/users/" + userId + "/bookshelves/" + bookShelfId + "/volumes";
  console.log("queryURL: " + queryURL);  

  // call to Google Books API to get books from 'To Read' Library
  // the response is passed as an argument to updatePage
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(updatePage);
  

});