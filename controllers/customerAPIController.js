var db = require('../models');

var ordersClass = require("../lib/classes/API/orders.js");
var customerClass = require("../lib/classes/API/customer.js");
var categoryClass = require("../lib/classes/API/category.js");
var productClass = require("../lib/classes/API/product.js");
module.exports.controller = function(app, passport) {

	//This action will register a new Customer
	//Input : req,res
	//Output : created response
	app.post('/api/customerSignup', function(req, res) {
  		console.log(req.body);
  		var Customer = new customerClass();
  		Customer.customerSignup(req, res, function(err, response){
  			if(!err){
  				res.send(response);
  			}
  			else{
  				res.send({"status" : false, "response" : null, "message" : "Customer registration API failed!"});
  			}
  		});

	});
	
	//This action will register a new Customer
	//Input : req,res
	//Output : created response
	app.post('/api/customerSignIn', function(req, res) {
  		console.log(req.body);
  		var Customer = new customerClass();
  		Customer.customerSignIn(req, res, function(err, response){
  			if(!err){
  				res.send(response);
  			}
  			else{
  				res.send({"status" : false, "response" : null, "message" : "Customer registration API failed!"});
  			}
  		});

	});

	//This action will register a new Customer
	//Input : req,res
	//Output : created response
	app.post('/api/customerLogout', isAuthenticated, function(req, res) {
  		console.log(req.body);
  		var Customer = new customerClass();
  		Customer.customerLogout(req, res, function(err, response){
  			if(!err){
  				res.send(response);
  			}
  			else{
  				res.send({"status" : false, "response" : null, "message" : "Customer Logout API failed!"});
  			}
  		});

	});

	//This action will purchase a new order to customer
	//Input : req,res
	//Output : sends purchased order response 
	app.post('/api/addToMyCart', isAuthenticated, function(req, res) {
		
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

	//This action will confirms the customer order (changes the state from new to pending) 
	//Input : req,res
	//Output : sends placed order response 
	app.post('/api/placeMyOrder', function(req, res) {
		
		var Order = new ordersClass();
		Order.placeMyOrder(req, res,function(err, response){
			
			if(!err){

				res.send(response);
			
			}
			else{
			
				throw new Error("place order API failed!!!");
				res.send({ "status" : false, response : null, message : "Order Purchase failed!!!"});
			
			}
			
		});  		
  		
	});

	//This action will get list of orders in to to show in My Cart
	//Input : req,res
	//Output : sends placed order response 
	app.post('/api/getMyCart',isAuthenticated, function(req, res) {
		
		var Order = new ordersClass();
		Order.getMyCart(req, res,function(err, response){
			
			if(!err){

				res.send(response);
			
			}
			else{
			
				throw new Error("Get Cart detail API failed!!!");
				res.send({ "status" : false, response : null, message : "Getting Customer Cart failed!!!"});
			
			}
			
		});  		
  		
	});

	//This action will get by status
	//Input : req,res
	//Output : returns orders by state
	app.post('/api/getOrderBystatus', isAuthenticated, function(req, res) {
		
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

	//This action will return the order detail for the given Customer order id
	//Input : req,res
	//Output : renders order detail page
	app.post('/api/getOrderDetail', isAuthenticated, function(req, res) {
		
		var Order = new ordersClass();
		Order.getOrderDetail(req, res,function(err, response){
			
			if(!err){

				res.send(response);

			}
			else{
			
				throw new Error("Get Order Detail failed!!!");
				res.send({ "status" : false, response : null, message : "Get Order Detail failed!!!"});
			
			}
			
		});  		
  		
	});

	//This action will return the get the users orders in new state
	//Input : req,res
	//Output : renders order detail page
	app.post('/api/getMyOrders', isAuthenticated, function(req, res) {
		
		var Order = new ordersClass();
		Order.getMyOrders(req, res,function(err, response){
			
			if(!err){

				res.send(response);

			}
			else{
			
				throw new Error("Get My Order Detail failed!!!");
				res.send({ "status" : false, response : null, message : "Get My Order Detail failed!!!"});
			
			}
			
		});  		
  		
	});
	
	//This action will search and lists the orders for the given input
	//Input : req,res
	//Output : orders list 
	app.post('/api/searchOrders', isAuthenticated, function(req, res){

		var Order = new ordersClass();		
		Order.searchOrders(req, res, function(err, response){
			if(!err){
				res.jsonp(response);
			}	
			else{
				res.send({'status':false , "response" : [], message : "Search Order API failed!!!"});
			}
		});

	});

	//This action will return the order detail for the given Customer order id
	//Input : req,res
	//Output : renders order detail page
	app.post('/api/getCategories', isAuthenticated, function(req, res) {
		
		var Category = new categoryClass();
		Category.listCategory(req, res,function(err, response){
			
			if(!err){

				res.send(response);

			}
			else{
			
				throw new Error("Get Order Detail failed!!!");
				res.send({ "status" : false, response : null, message : "Get Order Detail failed!!!"});
			
			}
			
		});  		
  		
	});


	//This action will search and lists the category name for the given input
	//Input : req,res
	//Output : category list name
	app.post('/api/searchCategory', isAuthenticated, function(req, res){

		var Category = new categoryClass();		
		Category.searchCategory(req, res, function(err, response){
			if(!err){
				res.jsonp(response);
			}	
			else{
				res.send({'status':false , "response" : []});
			}
		});

	});

	//This action will return the order detail for the given Customer order id
	//Input : req,res
	//Output : renders order detail page
	app.post('/api/getProducts', isAuthenticated, function(req, res) {
		
		var Product = new productClass();
		Product.getProducts(req, res,function(err, response){
			
			if(!err){

				res.send(response);

			}
			else{
			
				throw new Error("Get Order Detail failed!!!");
				res.send({ "status" : false, response : null, message : "Get Order Detail failed!!!"});
			
			}
			
		});  		
  		
	});

	//This action will return the order detail for the given Customer order id
	//Input : req,res
	//Output : renders order detail page
	app.post('/api/getProductById', isAuthenticated, function(req, res) {
		
		var Product = new productClass();
		Product.getProductById(req, res,function(err, response){
			
			if(!err){

				res.send(response);

			}
			else{
			
				throw new Error("Get Order Detail failed!!!");
				res.send({ "status" : false, response : null, message : "Get Order Detail failed!!!"});
			
			}
			
		});  		
  		
	});

	//This action will search and lists the orders for the given input
	//Input : req,res
	//Output : orders list 
	app.post('/api/searchProduct', isAuthenticated, function(req, res){

		var Product = new productClass();
		Product.searchProduct(req, res, function(err, response){
			if(!err){
				res.jsonp(response);
			}	
			else{
				res.send({'status':false , "response" : [], message : "Search Order API failed!!!"});
			}
		});

	});

};

//This action will check user is present in session or not
//Input : req,res
//Output : login page or next();
function isAuthenticated(req, res, next) {
	
	db.Customer.find({
		where : {"authentication_token" : req.body.authentication_token}
	}).complete(function(err, record){
		if(err)
			throw new Error("Error in checking the authentication_token");

		if(record != undefined){

			//We can access the current customer record with all the authenticated APIs
			req.customer = record;
			return next();

		}
		else{
			var response = {"status" : false, "response" : null, "message" : "Invalid Authentication Token!"};
			res.send(response);
		}
	});

}

