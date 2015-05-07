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
		CUSTOMER API : Get an Athuentication Token
		CUSTOMER API : SignUp Customer 
		CUSTOMER API : SignIn Customer 
		CUSTOMER API : Logout Customer 

	*/
	//Test case
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

	it("SignUp Customer", function(done){
	
		rest.post(website + "api/customerSignup" , {
			
			data : {
				"name" : "test",
				"email" : "test@test.com",
				"password" : "Comet123$",
				"storeName" : "Store Name",
				"address" : "Test Address",
				"phone" : "6666666666",
				"lat" : "123",
				"long" : "321",
				"deviceToken" : "deviceToken123431",
			}

		}).on('complete', function(data) {

			if (data) {
				console.log("===================================");
				console.log(JSON.stringify(data.message));
				done();
			}

		});		

	});

	it("SignIn Customer", function(done){
	
		rest.post(website + "api/customerSignIn" , {
			
			data : {
				"email" : "test@test.com",
				"password" : "Comet123$",
				"deviceToken" : "deviceToken123431",
			}

		}).on('complete', function(data) {

			if (data) {
				console.log("===================================");
				console.log(JSON.stringify(data.message));
				done();
			}

		});		

	});

	it("Logout Customer", function(done){
	
		rest.post(website + "api/customerLogout" , {
			
			data : {
				"authentication_token" : auth_token,
			}

		}).on('complete', function(data) {

			if (data) {
				console.log("===================================");
				console.log(JSON.stringify(data.message));
				done();
			}

		});		

	});

});
