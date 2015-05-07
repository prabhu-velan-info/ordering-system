var ordersClass = require("../lib/classes/orders/order.js");

module.exports.controller = function(app, passport) {

	var messageContent = "";
	//This action will load the allorders page
	//Input : req,res
	//Output : renders all orders page
	app.get('/allOrdersList', isLoggedIn, function(req, res) {

		if(messageContent != null){
			var status = messageContent;
			messageContent = "";
		}
  		res.render('dashboard/orders/allOrders.ejs', { title: 'All orders list' , message : null});

	});
	
	//This action will All customer order with its states
	//Input : req,res
	//Output : send all orders list to the front end
	app.post('/allOrders', function(req, res) {
		
		var Order = new ordersClass();
		Order.allOrders(req, res,function(err, response){
			
			if(!err){

				res.send(response);
			
			}
			else{
			
				throw new Error("get all orders failed!!!");
				res.send({ "status" : false, response : null, message : "get all orders failed!!!"});
			
			}
			
		});  		
  		
	});
	
	//This action will get orders by state
	//Input : req,res
	//Output : returns orders by state
	app.post('/getOrderBystatus', function(req, res) {
		
		var Order = new ordersClass();
		Order.getOrderBystatus(req, res,function(err, response){
			
			if(!err){

				res.send(response);
			
			}
			else{
			
				throw new Error("get OrdersBy status failed!!!");
				res.send({ "status" : false, response : null, message : "get OrdersBy status failed!!!"});
			
			}
			
		});  		
  		
	});

	//This action will purchase a new order to customer
	//Input : req,res
	//Output : sends purchased order response 
	app.post('/purchaseOrder', function(req, res) {
		
		var Order = new ordersClass();
		Order.purchaseOrder(req, res,function(err, response){
			
			if(!err){

				res.send(response);
			
			}
			else{
			
				throw new Error("Order Purchase failed!!!");
				res.send({ "status" : false, response : null, message : "Order Purchase failed!!!"});
			
			}
			
		});  		
  		
	});

	//This action will return the order detail for the given Customer order id
	//Input : req,res
	//Output : renders order detail page
	app.get('/getOrderDetail/:customerOrderId', function(req, res) {
		
		var Order = new ordersClass();
		Order.getOrderDetail(req, res,function(err, response){
			
			if(!err){

				// res.send(response);
				res.render('dashboard/orders/ordersDetail.ejs', { title: 'View Orders Page' , data : response.response, message : null});
			}
			else{
			
				throw new Error("Get Order Detail failed!!!");
				res.send({ "status" : false, response : null, message : "Get Order Detail failed!!!"});
			
			}
			
		});  		
  		
	});

	//This action will confirms the customer order (changes the state from new to pending) 
	//Input : req,res
	//Output : sends placed order response 
	app.post('/placeOrder', function(req, res) {
		
		var Order = new ordersClass();
		Order.placeOrder(req, res,function(err, response){
			
			if(!err){

				res.send(response);
			
			}
			else{
			
				throw new Error("place order API failed!!!");
				res.send({ "status" : false, response : null, message : "Order Purchase failed!!!"});
			
			}
			
		});  		
  		
	});

	//This action will delete an Order based on order id
	//Input : req,res
	//Output : delete order record
	app.get('/deleteOrder/:customerOrderId', isLoggedIn, function(req, res) {
		
		var Order = new ordersClass();
		Order.deleteOrder(req, res,function(err, response){
			
			if(!err){
				
				messageContent = "Order data Deleted!";
				console.log(response);
				// res.redirect("/allOrdersList");
				res.send({ "status" : false, response : null, message : "Delete Order failed!!!"});
			}
			else{
			
				throw new Error("Delete Order failed!!!");
				res.send({ "status" : false, response : null, message : "Delete Order failed!!!"});
			
			}
			
		});  		

	});

	//This action will delete an Order based on order id
	//Input : req,res
	//Output : delete order record
	app.post('/deleteOrderAPI', function(req, res) {
		console.log(req.body);
		var Order = new ordersClass();
		
		Order.deleteOrderAPI(req, res,function(err, response){
			
			console.log(response);
			if(!err){								
				res.send(response);			
			}
			else{
			
				throw new Error("Delete Order failed!!!");
				res.send({ "status" : false, response : null, message : "Delete Order failed!!!"});
			
			}
			
		});  		

	});

	//This action will change the order state to confirm and add a ship entry
	//Input : req,res
	//Output : confirmed response
	app.post('/confirmOrder', function(req, res) {
		console.log(req.body);
		var Order = new ordersClass();
		
		Order.confirmOrder(req, res,function(err, response){
			
			console.log(response);
			if(!err){								
				res.send(response);			
			}
			else{
			
				throw new Error("Delete Order failed!!!");
				res.send({ "status" : false, response : null, message : "Confirm Order API failed!!!"});
			
			}
			
		});  		

	});



	//This action will change the order state
	//Input : req,res
	//Output : changed order state result
	app.post('/changeOrderState', function(req, res) {
		
		var Order = new ordersClass();
		Order.changeOrderState(req, res,function(err, response){
			
			if(!err){

				res.send(response);
			
			}
			else{
			
				throw new Error("Change order status failed!!!");
				res.send({ "status" : false, response : null, message : "Delete Order failed!!!"});
			
			}
			
		});  		
  		
	});

	//This action will Cancel the customer order based on order id
	//Input : req,res
	//Output : sends cancelled response
	app.post('/cancelOrder', function(req, res) {
		
		var Order = new ordersClass();
		Order.cancelOrder(req, res,function(err, response){
			
			if(!err){

				res.send(response);
			
			}
			else{
			
				throw new Error("Cancel Order operation failed!!!");
				res.send({ "status" : false, response : null, message : "Cancel Order operation failed!!!"});

			}
			
		});  		
  		
	});


	//This action will return todays orders counts
	//Input : req,res
	//Output : sends todays order counts
	app.post('/todaysOrderCount', function(req, res) {
		
		var Order = new ordersClass();
		Order.todaysOrderCount(req, res,function(err, response){
			
			if(!err){

				res.send(response);
			
			}
			else{
			
				throw new Error("Order count operation failed!!!");
				res.send({ "status" : false, response : null, message : "Order count operation failed!!!"});
			}
			
		});  		
  		
	});

	



};

//This action will check user is present in session or not
//Input : req,res
//Output : login page or next();
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
}


