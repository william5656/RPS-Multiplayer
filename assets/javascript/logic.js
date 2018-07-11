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
    var user1Choice = "";
    var user2Choice = "";
    var newMessage = "";
    var winPlayer1 = 0;
    var losePlayer1 = 0;
    var winPlayer2 = 0;
    var losePlayer2 = 0;
    var turns = 1;
    var IsGameResetting = false;
    pickP2 = $(".pickP2");
    pickP1 = $(".pickP1");
        
        function resetGame(){
            IsGameResetting = false;
            turns = 1;
                database.ref().update({
                    turn : turns
                });
        }

        function clearDelay(){
            clearTimeout(delayTimer);
            resetGame();
        }

        function updatewinner1() {
            $(".vsBox").html("<h3>" + user1Name + " Wins <h3>")

            console.log(user1Name);
            console.log("hi");
        }

        function updatewinner2() {
            $(".vsBox").html("<h3>" + user2Name + " Wins <h3>");
        }

        function updateScore() {
            database.ref("player/1").update({
                win : winPlayer1,
                lose : losePlayer1
            });
            database.ref("player/2").update({
                win: winPlayer2,
                lose: losePlayer2
            });
        }

        function playerScore(){
            if(user1Choice == "rock" && user2Choice == "paper" || user1Choice == "paper" && user2Choice == "scissors" || user1Choice == "scissors" && user2Choice == "rock"){
                winPlayer2++;
                losePlayer1++;
                updatewinner2();
                updateScore();
            }

            if(user1Choice == "rock" && user2Choice == "scissors" || user1Choice == "paper" && user2Choice == "rock" || user1Choice == "scissors" && user2Choice == "paper"){
                winPlayer1++;
                losePlayer2++;
                updatewinner1();
                updateScore();
            }

            if(user1Choice == "rock" && user2Choice == "rock" || user1Choice == "paper" && user2Choice == "paper" || user1Choice == "scissors" && user2Choice == "scissors"){
                updatewinner1();
                updateScore();
            }
        }
        function hidden(){
            $(".pickP2").hide()
            $(".pickP1").hide()
        }
        $("#add-player").on("click", function(event) {
            event.preventDefault();
                var username = $("#player-input").val().trim();

                name = username;
                console.log(username);

            database.ref().once("value", function(snapshot) {
                if ((!snapshot.child("player").child(1).exists()) && ((snapshot.child("player").child(2).exists()) && snapshot.child("player").child(2).val().name == name)){
                    $(".vsBox").html("<h3> Name Taken </h3>")
                }
                else if (!snapshot.child("player").child(1).exists()) {
                    $(".vsBox").empty();
                    database.ref("player/1").set({
                            name : username,
                            win: winPlayer1,
                            lose: losePlayer1
                            });
                            $(".login").hide();
                }
                else if ((snapshot.child("player").child(1).exists()) && ((snapshot.child("player").child(2).exists()))) {
                alert("there is two players playing");
                }
                else if ((snapshot.child("player").child(1).exists()) && (!(snapshot.child("player").child(2).exists()) && snapshot.child("player").child(1).val().name == name)){
                    $(".vsBox").html("<h3> Name Taken </h3>")
                }
                else if ((snapshot.child("player").child(1).exists()) && (!(snapshot.child("player").child(2).exists()))){
                    $(".vsBox").empty();
                    database.ref("player/2").set({
                        name : username,
                        win: winPlayer2,
                        lose: losePlayer2
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
            
            

            if((!snapshot.child("player").child(1).exists()) && ((!snapshot.child("player").child(2).exists()))){
                $(".p2-name").html("<h3> waiting for player  </h3>");
                $(".p1-name").html("<h3> waiting for player </h3>");
                
            }
            else if((snapshot.child("player").child(2).exists()) && ((snapshot.child("player").child(1).exists()) === false)){
                $(".p2-name").html(snapshot.child("player").child(2).val().name);
                $(".p1-name").html("<h3> waiting for player1 <h3>");
                $(".win2").empty();
                $(".lose2").empty();
				//when any player disconnect from the game
				disconnect();
            };
            if((snapshot.child("player").child(1).exists()) && ((snapshot.child("player").child(2).exists()) === false)){
                $(".p1-name").html(snapshot.child("player").child(1).val().name);  
                $(".p2-name").html("<h3> waiting for player2 </h3>");
                $(".win1").empty();
                $(".lose1").empty();
                //when any player disconnect from the game
                disconnect();
                    //at the player1's  browser    
                }else if((snapshot.child("player").child(2).exists()) && ((snapshot.child("player").child(1).exists()))){
                var databaseTurn = snapshot.child("turn").val();
                $(".p1-name").html(snapshot.child("player").child(1).val().name);  
                $(".p2-name").html(snapshot.child("player").child(2).val().name);
                $(".win1").html(snapshot.child("player").child(1).val().win);
                $(".lose1").html(snapshot.child("player").child(1).val().lose);
                $(".win2").html(snapshot.child("player").child(2).val().win);
                $(".lose2").html(snapshot.child("player").child(2).val().lose);
                disconnect();

			if((name == snapshot.child("player").child(1).val().name) && (databaseTurn == 1)){
                hidden();
                pickP1.show(); 
            }
            if((name == snapshot.child("player").child(2).val().name) && (databaseTurn == 1)){
                hidden();
            }
            if((name == snapshot.child("player").child(1).val().name) && (databaseTurn == 2)){
                hidden();
                console.log(snapshot.child("player").child(1).val().name);
            }
            if((name == snapshot.child("player").child(2).val().name) && (databaseTurn == 2)){
                hidden();
                pickP2.show();
            }
            if(databaseTurn == 3 && IsGameResetting == false){
                IsGameResetting = true;
                user1Name = snapshot.child("player").child(1).val().name;
                user2Name = snapshot.child("player").child(2).val().name;
               
                user1Choice = snapshot.child("player").child(1).val().choice;
                user2Choice = snapshot.child("player").child(2).val().choice;
                winPlayer1 = snapshot.child("player").child(1).val().win;
                losePlayer1 = snapshot.child("player").child(1).val().lose;
                winPlayer2 = snapshot.child("player").child(2).val().win;
                losePlayer2 = snapshot.child("player").child(2).val().lose;
                playerScore();
                delayTimer = setTimeout(clearDelay, 4 * 1000);
            }
        }
    })

        
        pickP1.on("click","button", function(){
            user1Choice = $(this).val();
            console.log (this);
            console.log (user1Choice);
            
            database.ref().once('value').then(function(snapshot) {
                turns = (snapshot.child("turn").exists() ? snapshot.child("turn").val() : turns);
                turns++;
                
            if((name = snapshot.child("player").child(1).val().name)){
                database.ref("player/1").update({
                    choice : user1Choice,
                })

                database.ref().update({
                    turn : turns
                })
            }   
            })
        })

        pickP2.on("click","button", function(){
            user2Choice = $(this).val();
            console.log (user2Choice);
            
            database.ref().once('value').then(function(snapshot) {
                turns = (snapshot.child("turn").exists() ? snapshot.child("turn").val() : turns);
                turns++;
                
            if((name = snapshot.child("player").child(2).val().name)){
                database.ref("player/2").update({
                    choice : user2Choice,
                })

                database.ref().update({
                    turn : turns
                })
            }   
            })
        })

        hidden();
    })
