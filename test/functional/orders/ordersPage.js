
//Test Case for Admin Login
// process.env.NODE_ENV = 'test';
var rest = require('restler');


var http = require("http");
var website = "http://localhost:3006/";

// var assert = require("chai").assert,
var assert = require("assert"),
	Browser = require("zombie"),
	app = require("../../../app");

var db = require("../../../models");
var config = require("../../../config/testConfig");

var timeout = config.timeout;
var port = config.port;

var email = null, password = "Comet123$"

var lastAdminRecord = null;

var visitPage = "allOrdersList";

describe("List All Orders Page Test", function() {
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
	
	it("Admin Data : Getting Admin Login Credentials for Passport Login", function(done) {
		db.Admin.findAll().complete(function(err, record){
					
			if(record){
				lastAdminRecord = record[record.length - 1].values;
				email = lastAdminRecord.email;
				console.log(email);
				console.log(password);
				done();

			}	
			else{
				console.log("No Admin users found please run the config/seed.js!");
				process.exit(0);
				done();
			}
		});		
	});


	describe("Admin Authentication", function() {
		this.timeout(timeout);

		beforeEach(function(done) {
			
			var loginUrl = website + "login";
	
			browser.visit(loginUrl).then(function() {
				browser.fill("email", email);
				browser.fill("password", password);
				return browser.pressButton("submit");
			}).then(function() {
				var adminUrl = website + visitPage;
				return browser.visit(adminUrl);
			}).then(done, done);

		});

		describe("List Admin", function() {
			this.timeout(timeout);

			it('List Admin : Show the List All Orders Page',function(){
				console.log("\n\n\n");
				console.log(browser.url);
				assert.equal(browser.url, website + visitPage);		
			});

		});


		describe("List All Orders Page", function() {
			this.timeout(timeout);

			it('LIST ADMIN  : Delete A record from The Table', function(done){
				console.log("\n\n\n");
				console.log(browser.url);
				console.log(browser.text("#ordersTable"));
				done();
				// browser.clickLink("#pendingOrders").then(function(){
				// 	// assert.ok(Browser.success);
				// 	var errorMsg = browser.text("#error");
				// 	console.log("failed error : " + browser.text("#error"));					
				// }).then(done,done);

			});	

		});

		// describe("List All Orders Page", function() {
		// 	this.timeout(timeout);

		// 	it('LIST ADMIN  : Delete A record from The Table', function(done){
		// 		console.log("\n\n\n");
		// 		console.log(browser.url);
				
		// 		browser.pressButton("viewOrder").then(function(){
		// 			// var errorMsg = browser.text("#state");
		// 			// console.log("failed error : " + browser.text("#state"));
		// 			// assert.equal(errorMsg , "Admin created");					
		// 		}).then(done, done);
				

		// 	});	

		// });


		

		// describe("List All Orders Page", function() {
		// 	this.timeout(timeout);

		// 	it('LIST ADMIN  : Delete A record from The Table', function(done){
		// 		console.log("\n\n\n");
		// 		console.log(browser.url);
		// 		browser.pressButton("deleteOrder").then(function(){
		// 			// assert.ok(Browser.success);
		// 			var errorMsg = browser.text("#error");
		// 			console.log("failed error : " + browser.text("#error"));					
		// 		}).then(done,done);

		// 	});	

		// });

	});


});
