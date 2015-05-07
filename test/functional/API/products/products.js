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

		PRODUCTS API : Get A Category
		PRODUCTS API : Get Product By Category
		PRODUCTS API : Search Product
		PRODUCTS API : Get Sample Product 
		PRODUCTS API : Get Product by Id 

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
	
	var categoryId = null;
	it("Get A Category", function(done){
	
		db.Category.findAll({}).complete(function(err, records){
			
			if(err)
				throw new Error("Get Product Records error!");
			
			if(records.length > 0){
				categoryId = records[0].id;
				console.log(records[0].values);
				done();
			}	
			else{
				console.log("Customer table is empty please rund seedfile");
				done();
			}

		});

	});

	it("Get Products : Get Products By Category", function(done){
	
		rest.post(website + "api/getProducts" , {
			
			data : {
				"authentication_token" : auth_token,
				"categoryId" : categoryId,
			}

		}).on('complete', function(data) {

			if (data) {
				console.log("===================================");
				customerOrderId = data.response.id;
				console.log(JSON.stringify(data.response));
				done();
			}

		});		

	});


	it("Search Product : Search Product By Product Name", function(done){
	
		rest.post(website + "api/searchProduct" , {
			
			data : {
				"authentication_token" : auth_token,		
				"search" : "p"		
			}

		}).on('complete', function(data) {

			if (data) {
				console.log("===================================");
				console.log(JSON.stringify(data.response));
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


	it("Get Products : Get Products By ID", function(done){
	
		rest.post(website + "api/getProductById" , {
			
			data : {
				"authentication_token" : auth_token,
				"productId" : productId,
			}

		}).on('complete', function(data) {

			if (data) {
				console.log("===================================");
				customerOrderId = data.response.id;
				console.log(JSON.stringify(data.response));
				done();
			}

		});		

	});

});
