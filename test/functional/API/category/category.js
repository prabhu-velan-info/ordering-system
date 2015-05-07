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
		CATEGORY API : Get Categories
		CUSTOMER API : Search Categories 
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

	it("Get Categories", function(done){
	
		rest.post(website + "api/getCategories" , {
			
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

	it("Search Categories", function(done){
	
		rest.post(website + "api/searchCategory" , {
			
			data : {
				"authentication_token" : auth_token,		
				"search" : "t"		
			}

		}).on('complete', function(data) {

			if (data) {
				console.log("===================================");
				console.log(JSON.stringify(data.response));
				done();
			}

		});		

	});

	


});
