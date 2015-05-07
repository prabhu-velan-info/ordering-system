var server, io;

var Socket = (function() {

	var instance;
	function init() {
		
		//private variable declration section
		//public variable and function declaration

		//Purpose : This function will call the sendPreviousOrders method on every 5 seconds
		//Input   : NA
		//Output  : NA
		return {
			// Public methods and variables
			start : function(server) {
				console.log("Starting the socket service");
				io = require('socket.io').listen(server);
			},

			//Purpose : This will send the message to client which listening to this socket
			//Input   : key, value
			//Output  : NA
			send : function(key, value){
				io.emit(key.toString(), value);
			},
			// Public methods and variables
			stop : function() {				

			},
		};
	};

	//option for creating singleton instance
	return {

		// Get the Singleton instance if one exists
		getInstance : function() {

			if (!instance) {
				instance = init();
				console.log("Initializing the socket object......!");
			}

			return instance;
		}
	};

})(); 

//setting the object for module 
module.exports = Socket;
