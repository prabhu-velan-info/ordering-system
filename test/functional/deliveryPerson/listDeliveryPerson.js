
//Test Case for Admin Login
// process.env.NODE_ENV = 'test';


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

var visitPage = "listDeliveryPerson";

describe("List Delivery Person Test", function() {
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
	/*
		ADMIN AUTHENTICATION
	*/

	/*
		LIST DELIVERY PERSON : Show List Delivery person list  Page
		LIST DELIVERY PERSON : Delete An item 
		LIST DELIVERY PERSON : Edit A Delivery Person
		LIST DELIVERY PERSON : Make sure Edit page
		LIST DELIVERY PERSON : Make sure fields
		LIST DELIVERY PERSON : Update the Delivery Person Data
		 
	*/

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

		describe("List Delivery Person", function() {
			this.timeout(timeout);

			it('List Delivery Person : Show the List Delivery Person Page',function(done){
				console.log("\n\n\n");
				console.log(browser.url);
				assert.equal(browser.url, website + visitPage);		
				done();
			});

		});


		describe("List Delivery Person", function() {
			this.timeout(timeout);

			it('LIST ADMIN  : Delete A record from The Table', function(done){
				console.log("\n\n\n");
				console.log(browser.url);
				browser.clickLink("#deleteDeliveryPerson").then(function(){
					
					// assert.ok(Browser.success);
					var errorMsg = browser.text("#error");
					console.log("failed error : " + browser.text("#error"));	
									
				}).then(done,done);

			});	

		});

		describe("Edit Delivery Person", function() {
			this.timeout(timeout);
			
			beforeEach(function(done){

				browser.clickLink("#editDeliveryPerson").then(function(){
					console.log("visited :" + browser.url);
					assert.ok(browser.success);
				}).then(done,done);

			});
		
			it('EDIT DELIVERY PERSON  : Make Sure Edit Delivery Person Page', function(done){
				console.log("\n\n\n");
				console.log("visited :" + browser.url);
				done();				
			});

			it('EDIT DELIVERY PERSON  : Make sure Edit page fields', function(done){
				console.log("\n\n\n");
				console.log(browser.url);
				assert.equal(browser.field("name").type, "text");
				assert.equal(browser.field("email").type, "text");
				assert.equal(browser.field("password").type, "password");
				assert.equal(browser.field("phone").type, "text");
				done();
			});	

			it('EDIT DELIVERY PERSON  : Submit after Editing the Admin fields', function(done){
				console.log("\n\n\n");
				browser.fill("name","alteredText");
				browser.fill("password","Comet123$");
				console.log(browser.field("name").value);
				browser.pressButton("#submit").then(function(){
					assert.ok(browser.success);
					console.log(browser.url);
				}).then(done,done);

			});	

		});

	});


});
