var socket = io.connect('/');
var user = null;

function login(name){
  user = name;
  socket.emit('login', {name: user});
}

function send(message) {
  socket.emit("send", {message: message, sender: user}, function(){
    $("#userInput").prop("disabled", false);
  });
}

socket.on('stats', function(data){
  var userCount = data.users.length;
  var users = data.users;
  $('#numberUsersOnline').html(userCount + " usuários online");
  $('#usersOnline').empty();
  if(userCount > 0){
   for (var i in users) {
      $('#usersOnline').append("<li>" + users[i] + "</li>");
    };
  } 
});

socket.on("message", function(data){
  // if message comes from me, it goes right
  if(data.sender == user){
  $(".chatBox").append(`<div class="bubble right">               
                 <div >                   
                   <p class="talk"><span class="sender green-text ">Você</span>: ${data.message}</p>
                   <span class="timestamp shadow-text left red-text">${data.time}</span>
                 </div>               
               </div>`);
  $("#userInput").prop("disabled", false);
  $("#userInput").val(" ");
  $("#userInput").focus();
  } else {
  $(".chatBox").append(`<div class="bubble left">               
                 <div >                   
                   <p class="talk"><span class="sender orange-text ">${data.sender}</span>: ${data.message}</p>
                   <span class="timestamp shadow-text right red-text">${data.time}</span>
                 </div>               
               </div>`);

               Notification.requestPermission(function() {
                var notification = new Notification("Nova mensagem de " + data.sender, {body: data.message});
              });
  }

  $(".chatBox").scrollTop($(".chatBox")[0].scrollHeight);

})
  



socket.on('loggedin', function(data) {

  $('#modal_login').modal('close');
})

