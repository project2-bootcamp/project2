

$(document).ready(function() {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function(data) {
    $(".member-name").text(data.email);
  });

  $("#spotify-submit").on("click", function(event){
    event.preventDefault();
    console.log("u hit this button")

   var searchTerm = $("#userSearch").val().trim();
   console.log(searchTerm);
   console.log($.get("/api/search/" + searchTerm))

    $.get(`/api/search/${req.params.app}` + searchTerm, function(req, artistData){
      console.log(artistData);
      $("#artist-name").text(artistData.name);
    }) 
  })

  
});

