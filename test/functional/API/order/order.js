var rest = require('restler');
var async = require("async");

var http = require("http");
var website = "http://localhost:3006/";

var db = require("../../../../models");
var config = require("../../../../config/testConfig");

var app = require("../../../../app");
var timeout = config.timeout;
var port = config.port;

var auth_token = null;
describe("Customers API", function(){
	this.timeout(timeout);

	var server, browser, todoUrl;

	before(function() {
		server = app.listen(port);
	});

	after(function() {
		// after ALL the tests, close the server
		server.close();
	});

	/*

		ORDERS API : Get Product Details
		ORDERS API : Purchase A Product
		ORDERS API : Get Order Detail
		ORDERS API : Get Order By status
		ORDERS API : Search Orders By Date
		
		NOTE : Products quantity should not be below 0

	*/	
	it("Get An AuthToken", function(done){
	
		db.Customer.findAll({}).complete(function(err, customerRecords){
			
			if(err)
				throw new Error("Get customer Records error!");
			
			if(customerRecords.length > 0){
				auth_token = customerRecords[customerRecords.length - 1].authentication_token;
				console.log("Athuentication Token : "+auth_token);
				done();
			}	
			else{
				console.log("Customer table is empty please rund seedfile");
				done();
			}

		});

	});
	
	var productId = null, customerOrderId = null;
	it("Get Product Details", function(done){
	
		db.Product.findAll({}).complete(function(err, records){
			
			if(err)
				throw new Error("Get Product Records error!");
			
			if(records.length > 0){
				productId = records[records.length - 1].id;
				console.log(records[records.length - 1].values);
				done();
			}	
			else{
				console.log("Customer table is empty please rund seedfile");
				done();
			}

		});

	});

	it("Purchase A Product : Add Product To My Cart", function(done){
	
		rest.post(website + "api/addToMyCart" , {
			
			data : {
				"authentication_token" : auth_token,
				"productId" : productId,
				"quantity" : 1
			}

		}).on('complete', function(data) {

			if (data) {
				console.log("===================================");
				customerOrderId = data.response.CustomerOrderId;
				console.log(JSON.stringify(data.message));
				done();
			}

		});		

	});


	it("Get Customer Order Detail", function(done){
	
		rest.post(website + "api/getOrderDetail" , {
			
			data : {
				"authentication_token" : auth_token,
				"customerOrderId" : customerOrderId				
			}

		}).on('complete', function(data) {

			if (data) {
				console.log("===================================");
				console.log(JSON.stringify(data.response));
				done();
			}

		});		

	});


	it("Get Order By status : new", function(done){
	
		rest.post(website + "api/getOrderBystatus" , {
			
			data : {
				"authentication_token" : auth_token,
				"orderState" : "new"
			}

		}).on('complete', function(data) {

			if (data) {
				console.log("===================================");
				console.log(JSON.stringify(data.response));
				done();
			}

		});		

	});

	var placedDate = null;
	it("Get an Customer Order", function(done){
	
		db.CustomerOrder.findAll({}).complete(function(err, customerOrderRecords){
			
			if(err)
				throw new Error("Get customer Records error!");
			
			if(customerOrderRecords.length > 0){
				placedDate = customerOrderRecords[customerOrderRecords.length - 1].placedDate;
				console.log("PLACED DATE : "+placedDate);
				done();
			}	
			else{
				console.log("Customer orders table is empty please rund seedfile");
				done();
			}

		});

	});

	it("Search Order By Date", function(done){
	
		rest.post(website + "api/searchOrders" , {
			
			data : {
				"authentication_token" : auth_token,		
				"search" : placedDate.substr(1,3)		
			}

		}).on('complete', function(data) {

			if (data) {
				console.log("===================================");
				console.log(JSON.stringify(data.response));
				done();
			}

		});		

	});

	it("Get My Orders", function(done){
	
		rest.post(website + "api/getMyOrders" , {
			
			data : {
				"authentication_token" : auth_token,		
			}

		}).on('complete', function(data) {

			if (data) {
				console.log("===================================");
				console.log(JSON.stringify(data.response));
				done();
			}

		});		

	});

	// it("Submit My Orders", function(done){
	
	// 	rest.post(website + "api/placeMyOrder" , {
			
	// 		data : {
	// 			"authentication_token" : auth_token,		
	// 			"customerOrderId" : customerOrderId
	// 		}

	// 	}).on('complete', function(data) {

	// 		if (data) {
	// 			console.log("===================================");
	// 			console.log(JSON.stringify(data));
	// 			done();
	// 		}

	// 	});		

	// });


	it("Get My Cart", function(done){
	
		rest.post(website + "api/getMyCart" , {
			
			data : {
				"authentication_token" : auth_token,		
			}

		}).on('complete', function(data) {

			if (data) {
				console.log("===================================");
				console.log(JSON.stringify(data));
				done();
			}

		});		

	});

});
