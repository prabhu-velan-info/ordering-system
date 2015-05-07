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
var lastDeliveryPersonRecord = null;

var visitPage = "addDeliveryPerson";

describe("Add add Delivery Person Test", function() {
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
		ADD DELIVERY PERSON : Show the Page
		ADD DELIVERY PERSON : Make Sure Fields
		ADD DELIVERY PERSON : Refuse Empty submission
		ADD DELIVERY PERSON : Create Delivery Person
		ADD DELIVERY PERSON : Email Already Exists
	*/

	it("DeliveryPerson Data : Getting Admin Login Credentials for Passport Login", function(done) {
		db.Admin.findAll().complete(function(err, record){
					
			if(record.length > 0){
				lastAdminRecord = record[record.length - 1].values;
				email = record[0].values.email;
				console.log(email);
				console.log(password);
				done();

			}	
			else{
				console.log("___________________________________________________");
				console.log("No Admin users found please run the config/seed.js!");
				console.log("___________________________________________________");
				done();
			}
		});		
	});

	it("Delivery Person Data : Getting Last Customer data for registration", function(done) {
	
		db.DeliveryPerson.findAll().complete(function(err, record){
					
			if(record.length > 0){
				lastDeliveryPersonRecord = record[record.length - 1].values;
				console.log(lastDeliveryPersonRecord);
				done();

			}	
			else{
				console.log("___________________________________________________");
				console.log("No Customers found please run the config/seed.js!");
				console.log("___________________________________________________");
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
		
		// //check the page once logged in
		describe("Make Sure fields", function() {
			this.timeout(timeout);
			
			it('ADD DELIVERY PERSON : Make sure Fields', function(done){

				console.log("\n\n\n");
				console.log(browser.url);
				assert.equal(browser.field("name").type, "text");
				assert.equal(browser.field("email").type, "text");
				assert.equal(browser.field("password").type, "password");
				assert.equal(browser.field("phone").type, "text");
				assert.equal(browser.field("submit").name, "submit");
				assert.equal(browser.field("reset").name, "reset");
				done();
			});

		});

		// // //check the page once logged in
		describe("Empty Submission", function() {
			this.timeout(timeout);

			it('ADD ADD DELIVERY PERSON : should refuse empty submissions', function(done){
				console.log("\n\n\n");

				browser.pressButton("#submit").then(function(){
					assert.ok(browser.success);
					console.log(browser.url);
					adminUrl = website + visitPage;
					var errorMsg = browser.text("#state");
					console.log("failed error : " + browser.text("#state"));
					assert.equal(browser.url , adminUrl);
				}).then(done, done);

			});

		});

				// //check the page once logged in
		describe("Create Delivery Person", function() {
			this.timeout(timeout);

			it('ADD ADD DELIVERY PERSON  : Add Delivery Person success', function(done){
				
				console.log("\n\n\n");
				console.log(browser.url);
				browser.fill("name",lastDeliveryPersonRecord.name + "1");
				browser.fill("email",lastDeliveryPersonRecord.name + "1"+"@admin.com");
				browser.fill("password","Comet123$");
				browser.fill("phone",lastDeliveryPersonRecord.phone);

				browser.pressButton("#submit").then(function(){
					var errorMsg = browser.text("#state");
					console.log("failed error : " + browser.text("#state"));
					assert.equal(errorMsg , "Delivery Person created");					
				}).then(done, done);

			});

		});

		describe("Email Already Exists", function() {
			this.timeout(timeout);

			it('ADD ADD DELIVERY PERSON  : Delivery Person Already registered', function(done){
				
				console.log("\n\n\n");
				console.log(browser.url);
				console.log(lastDeliveryPersonRecord.name);
				browser.fill("name",lastDeliveryPersonRecord.name + "1");
				browser.fill("email",lastDeliveryPersonRecord.name + "1"+"@admin.com");
				browser.fill("password","Comet123$");
				browser.fill("phone",lastDeliveryPersonRecord.phone);
				browser.pressButton("#submit").then(function(){
					var errorMsg = browser.text("#state");
					console.log("failed error : " + browser.text("#state"));
					assert.equal(errorMsg , "That email is already taken.");					
				}).then(done, done);

			});

		});


	});
});