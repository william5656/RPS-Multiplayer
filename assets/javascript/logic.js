$( document ).ready(function() {

var config = {
    apiKey: "AIzaSyBSbZaKvEu4u3BEUnf66MJhEG9vs_t8G7g",
    authDomain: "uft-bootcamp.firebaseapp.com",
    databaseURL: "https://uft-bootcamp.firebaseio.com",
    projectId: "uft-bootcamp",
    storageBucket: "uft-bootcamp.appspot.com",
    messagingSenderId: "195249751148"
  };

  firebase.initializeApp(config);

  var database = firebase.database();
  var name;


  $("#add-player").on("click", function(event) {
    event.preventDefault();

    database.ref().once("value", function(snapshot) {

        if (!snapshot.child("player1").exists()) {
            name = $("#player-input").val().trim();

       var player1 = {
                id : 1,
                name : $("#player-input").val().trim(),
                wins : 0,
                loss : 0,
            };

            $(".login").hide();
            database.ref().update({
                player1 : player1 
            })
        }
        else if (snapshot.child("player1").exists() && snapshot.child("player2").exists()){
            $(".login").hide();
        }
        else if (snapshot.child("player1").exists()) {
            player2 = {
                id : 2,
                name : $("#player-input").val().trim(),
                wins : 0,
                loss : 0,
            };
            $(".login").hide();
            database.ref().update({
                player2 : player2
            })
        }
        })
    })

  
  $(".enter-messege").on("click", function(event) {
    event.preventDefault();

        var chat = $("#messege-input").val().trim();

        database.ref().push({
            chat : chat,
        });
})

database.ref().on("child_added", function(snapshot) {
    console.log(snapshot.val().chat);

})


database.ref().limitToLast(5).on("child_added", function(snapshot) {
    
    $("ul").append("<li>"+ name + ':' + snapshot.val().chat + "</li>");
          
},function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });  




})
