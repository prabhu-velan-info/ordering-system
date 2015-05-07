var rest = require('restler');
var async = require("async");

var http = require("http");
var website = "http://localhost:3006/";

var db = require("../../../models");
var config = require("../../../config/testConfig");

// var assert = require("chai").assert,
var assert = require("assert"),
	Browser = require("zombie"),
	app = require("../../../app");

var timeout = config.timeout;
var port = config.port;

var customerId = null, productId = null, quantity = 1;
var customerOrderId = null;

describe("Create Order API", function(){

	this.timeout(timeout);

	var server, browser, todoUrl;

	before(function() {
		server = app.listen(port);
	});

	beforeEach(function() {
		browser = new Browser({debug : true, waitDuration : 60000});
	});

	after(function() {
		// after ALL the tests, close the server
		server.close();
	});
	
	it("Get ProductId", function(done){
		
		db.Product.findAll({}).complete(function(err, productRecord){
			
			if(err)
				throw new Error("Get Product detail error!");
			
			if(productRecord.length > 0){
				productId = productRecord[productRecord.length - 1].id;
				done();
			}	
			else{
				console.log("Product table is empty please rund seedfile");
				done();
			}

		});

	});

	it("Get CustomerId", function(done){
		
		db.Customer.findAll({}).complete(function(err, customerRecord){
			if(err)
				throw new Error("Get Product detail error!");

			if(customerRecord.length > 0){
						//Call purchase order API for the number of customers
						async.each(customerRecord,

							function(recordItem, callback){
									
									rest.post(website + "purchaseOrder" , {
			
										data : {

											"customerId" : recordItem.id,
											"productId" : productId,
											"quantity" : 1

										}

									}).on('complete', function(data) {

										if (data) {

											console.log("===================================");
											customerOrderId = data.response.CustomerOrderId;
											console.log(data.message);

											rest.post(website + "changeOrderState" , {			
												data : {
													"customerOrderId" : data.response.CustomerOrderId,
													"orderState" : "pending"
												}
											}).on('complete', function(data) {
												if (data) {

													callback();
													
												}
											});	
											

										}

									});		
									

							},

							function(err){
								done();
							}
						);

			}	
			else{
				console.log("Customer table is empty please rund seedfile");
				done();
			}

		});
	});

	// it("Purchase order API", function(done){
	
	// 	rest.post(website + "purchaseOrder" , {
			
	// 		data : {

	// 			"customerId" : customerId,
	// 			"productId" : productId,
	// 			"quantity" : 1

	// 		}

	// 	}).on('complete', function(data) {

	// 		if (data) {
	// 			console.log("===================================");
	// 			customerOrderId = data.response.CustomerOrderId;
	// 			console.log(data.message);

	// 			done();

	// 		}

	// 	});		
	// });

	// it("PlaceOrder order API", function(done){
	
	// 	rest.post(website + "placeOrder" , {
			
	// 		data : {

	// 			"customerOrderId" : customerOrderId

	// 		}

	// 	}).on('complete', function(data) {

	// 		if (data) {
	// 			console.log("===================================");
	// 			console.log(customerOrderId);
	// 			console.log(data.message);
	// 			done();

	// 		}

	// 	});		
	// });


	// it("Change order state API order API", function(done){
	
	// 	rest.post(website + "changeOrderState" , {
			
	// 		data : {

	// 			"customerOrderId" : customerOrderId,
	// 			"orderState" : "new"

	// 		}

	// 	}).on('complete', function(data) {

	// 		if (data) {
	// 			console.log("===================================");
	// 			console.log(customerOrderId);
	// 			console.log(data.message);
	// 			done();

	// 		}

	// 	});		
	// });

	// it("Change order state API order API", function(done){
	
	// 	rest.post(website + "changeOrderState" , {			
	// 		data : {
	// 			"customerOrderId" : customerOrderId,
	// 			"orderState" : "pending"
	// 		}
	// 	}).on('complete', function(data) {
	// 		if (data) {
	// 			done();
	// 		}
	// 	});		
	// });



});