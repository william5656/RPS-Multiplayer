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
    var name = "";
    var user1Name = "";
    var user2Name = "";
    var newMessage = "";
    var winPlayer1 = "";
    var lossPlayer1 = "";
    var winPlayer2 = "";
    var lossPlayer2 = "";
    var turns = 1;
    var reset = false;


        $("#add-player").on("click", function(event) {
            event.preventDefault();
                var username = $("#player-input").val().trim();

                name = username;
                console.log(username);

            database.ref().once("value", function(snapshot) {

                if (!snapshot.child("player").child(1).exists()) {
                    database.ref("player/1").set({
                            name : username,
                            win: winPlayer1,
                            lose: lossPlayer1
                            });
                            $(".login").hide();
                }
                else if ((snapshot.child("player").child(1).exists()) && ((snapshot.child("player").child(2).exists()))) {
                alert("there is two players playing");
                }
                else if ((snapshot.child("player").child(1).exists()) && (!(snapshot.child("player").child(2).exists()))){
                    database.ref("player/2").set({
                        name : username,
                        win: winPlayer2,
                        lose: lossPlayer2
                    });
                    $(".login").hide();
                        database.ref().update({
                            turn: turns,
                    })
                }
            })
        })

        
        $(".enter-message").on("click", function(event){

            event.preventDefault();
            console.log(this);

            var messages = $("#message-input").val().trim();
            $("#message-input").val("");
            
            newMessage = name + " : " + messages;
                    

            database.ref("/chat").update({		
                        message: newMessage,
                        dateAdded: firebase.database.ServerValue.TIMESTAMP								
                    });//database push
    }); //on click

    //updating the chat messages in the browser's chat window by using the last one added into the database (time added)
    database.ref("/chat").orderByChild("dateAdded").limitToLast(1).on("value", function(snapshot) {
                    $(".chatBox").append("</br>" + snapshot.val().message + "</br>");
    });//database

        database.ref().on("value", function(snapshot){

            function disconnect(){
                if(name != ""){
                  
                    if ((snapshot.child("player").child(1).exists()) && (name == snapshot.child("player").child(1).val().name)){					
                     
                            database.ref("/chat").onDisconnect().update({							
                                message: ((snapshot.child("player").child(1).val().name) + " has been DISCONNECTED!!"),
                                dateAdded: firebase.database.ServerValue.TIMESTAMP												
                            });
                 
                            database.ref("player/1").onDisconnect().remove();
           
                    }else if ((snapshot.child("player").child(2).exists()) && (name == snapshot.child("player").child(2).val().name)){	
                          
                            database.ref("/chat").onDisconnect().update({						
                                message: ((snapshot.child("player").child(2).val().name) + " has been DISCONNECTED!!"),
                                dateAdded: firebase.database.ServerValue.TIMESTAMP													
                            });	
                    
                            database.ref("player/2").onDisconnect().remove();
                       				
                            database.ref("/turn").onDisconnect().remove();	
                    }
                }
            }

            if((snapshot.child("player").child(2).exists()) && ((snapshot.child("player").child(1).exists()))){
                $(".p2-name").html(snapshot.child("player").child(2).val().name);
				//when any player disconnect from the game
				disconnect();
            };
            if((snapshot.child("player").child(1).exists()) && ((snapshot.child("player").child(2).exists()) === false)){
                $(".p1-name").html(snapshot.child("player").child(1).val().name);  
                
                //when any player disconnect from the game
                disconnect();
                    //at the player1's  browser
                
                }

    })
})
