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
var categoryRecord = null;

var visitPage = "addProduct";

describe("Add Product Test", function() {
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
		ADD PRODUCT : Show the Page
		ADD PRODUCT : Make Sure Fields
		ADD PRODUCT : Refuse Empty submission
		ADD PRODUCT : Create product
		ADD PRODUCT : Product already present
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
		
		describe("Make Sure fields", function() {
			this.timeout(timeout);
			
			it('ADD PRODUCT : Make sure Add Product fields', function(done){

				console.log("\n\n\n");
				console.log(browser.url);
				assert.equal(browser.field("name").type, "text");
				assert.equal(browser.field("price").type, "text");
				assert.equal(browser.field("description").type, "text");
				assert.equal(browser.field("quantity").type, "text");
				assert.equal(browser.field("startDate").type, "text");
				assert.equal(browser.field("endDate").type, "text");
				assert.equal(browser.field("discountPercent").type, "text");
				assert.equal(browser.field("salePrice").type, "text");
				assert.equal(browser.field("categoryName").type, "text");
				assert.equal(browser.field("inStock").type, "text");

				assert.equal(browser.field("submit").name, "submit");
				assert.equal(browser.field("reset").name, "reset");
				done();

			});

		});

		describe("Empty Submission", function() {
			this.timeout(timeout);

				it('ADD PRODUCT : should refuse empty submissions', function(done){
				
					console.log("\n\n\n");
					browser.pressButton("#submit").then(function(){
						assert.ok(browser.success);
						
						var errorMsg = browser.text("#error");
						console.log("failed error : " + browser.text("#error"));
						assert.equal(errorMsg , "Name field should not be empty!");			

					}).then(done, done);

				});
		});


		
	
		describe("Get a Category to add new Product", function() {
			this.timeout(timeout);

				it('ADD PRODUCT : should refuse empty submissions', function(done){
			
					db.Category.findAll().complete(function(err, record){
				
						if(record.length > 0){
							categoryRecord = record[record.length - 1].values;
							console.log("Category detail");
							console.log(categoryRecord);
							done();
						}	
						else{
							console.log("___________________________________________________");
							console.log("No Category Found to add new product. Please run the config/seed.js!");
							console.log("___________________________________________________");
							done();
						}

					});	

				});
		});


	});
});