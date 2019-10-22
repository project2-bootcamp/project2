

$(document).ready(function() {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
  });

  $("#spotify-submit").on("click", function(event){
    event.preventDefault();

   var searchTerm = $("#userSearch").val().trim();
    $.get("/api/search/" + searchTerm, function(req, res) {
      
      return res;
    }) 
  })

  
});

