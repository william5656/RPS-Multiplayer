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
      var maxPlayer = 2;
      var connections = database.ref('connections');

      player1 = {
        name : "",
        wins : 0,
        loss : 0,
      };

      player2 = {
        id : 2,
        name : "",
        wins : 0,
        loss : 0,
    };

    })