

const controller1 = new Controller();
controller1.addListeners();
router.addListeners();

   

  var socket = new WebSocket("ws://localhost:5001/");

  socket.onopen = function() {
    socket.send("Go");
  };
  
  socket.onmessage = function() {
    location.reload()
  };
  

  
socket.onclose = function(event) {
  if (event.wasClean) {
    
  } else {
    location.reload()
  }
 
};
