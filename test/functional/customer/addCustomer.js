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
var lastCustomerRecord = null;

var visitPage = "addCustomer";

describe("Add customer Test", function() {
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
		ADD CUSTOMER : Show the Page
		ADD CUSTOMER : Make Sure Fields
		ADD CUSTOMER : Refuse Empty submission
		ADD CUSTOMER : Create cUSTOMER
		ADD CUSTOMER : Email Already Exists
	*/


	it("Admin Data : Getting Admin Login Credentials for Passport Login", function(done) {
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

	it("Customer Data : Getting Last Customer data for registration", function(done) {
	
		db.Customer.findAll().complete(function(err, record){
					
			if(record.length > 0){
				lastCustomerRecord = record[record.length - 1].values;
				console.log(lastCustomerRecord);
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
			
			it('ADD CUSTOMER : Make sure Fields', function(){

				console.log("\n\n\n");
				console.log(browser.url);
				assert.equal(browser.field("name").type, "text");
				assert.equal(browser.field("email").type, "text");
				assert.equal(browser.field("password").type, "password");		
				assert.equal(browser.field("storeName").type, "text");
				assert.equal(browser.field("address").type, "textarea");
				assert.equal(browser.field("phone").type, "text");

				assert.equal(browser.field("submit").name, "submit");
				assert.equal(browser.field("reset").name, "reset");


			});

		});

		// // // //check the page once logged in
		describe("Empty Submission", function() {
			this.timeout(timeout);

			it('ADD CUSTOMER : should refuse empty submissions', function(done){
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

		// describe("Partial Submit", function() {
		// 	this.timeout(timeout);

		// 	it('Add customer  : Add Customer Partial Submit', function(done){

		// 		console.log("\n\n\n");
		// 		browser.fill("name","invaliuser");
		// 		browser.fill("email","invaliuser@email.com");
		// 		browser.fill("password","");
		// 		browser.pressButton("#submit").then(function(){

		// 			var errorMsg = browser.text("#error");
		// 			console.log("failed error : " + browser.text("#error"));
		// 			assert.equal(errorMsg , "Password field should not be empty!");			

		// 		}).then(done,done);

		// 	});

		// });


		// 		// //check the page once logged in
		describe("Create Customer", function() {
			this.timeout(timeout);

			it('ADD CUSTOMER  : Add Customer success', function(done){
				
				console.log("\n\n\n");
				console.log("Adding new customer with");
				console.log(lastCustomerRecord);
				console.log(browser.url);
				browser.fill("name",lastCustomerRecord.name + "1");
				browser.fill("email",lastCustomerRecord.name + "1"+"@customer.com");
				browser.fill("password","Comet123$");
				browser.fill("storeName",lastCustomerRecord.storeName);
				browser.fill("address",lastCustomerRecord.address);
				browser.fill("phone",lastCustomerRecord.phone);

				browser.pressButton("#submit").then(function(){
					var errorMsg = browser.text("#state");
					console.log("failed error : " + browser.text("#state"));
					assert.equal(errorMsg , "Customer created");					
				}).then(done, done);

			});

		});

		
		describe("Customer Already Registered", function() {
			this.timeout(timeout);

			it('ADD CUSTOMER  : Customer Already Present', function(done){
				
				console.log("\n\n\n");
				console.log(browser.url);
				browser.fill("name",lastCustomerRecord.name + "1");
				browser.fill("email",lastCustomerRecord.name + "1"+"@customer.com");
				browser.fill("password","Comet123$");
				browser.fill("storeName",lastCustomerRecord.storeName);
				browser.fill("address",lastCustomerRecord.address);
				browser.fill("phone",lastCustomerRecord.phone);

				browser.pressButton("#submit").then(function(){
					var errorMsg = browser.text("#state");
					console.log("failed error : " + browser.text("#state"));
					assert.equal(errorMsg , "That email is already taken.");					
				}).then(done, done);

			});

		});

		

	});
});