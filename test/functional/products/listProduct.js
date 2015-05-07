
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

var visitPage = "listProduct";

describe("List Product Test", function() {
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
		LIST PRODUCT : Show List Product Page
		LIST PRODUCT : Delete An item 
		LIST PRODUCT : Edit A List product page
		LIST PRODUCT : Make sure Edit page
		LIST PRODUCT : Make sure fields
		LIST PRODUCT : Update the Product info
		 
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

		describe("List listProductProduct", function() {
			this.timeout(timeout);

			it('List Product : Show the List Product Page',function(){
				console.log("\n\n\n");
				console.log(browser.url);
				assert.equal(browser.url, website + visitPage);		
			});

		});


		describe("List Product", function() {
			this.timeout(timeout);

			it('DELETE PRODUCT  : Delete A record from The Table', function(done){
				console.log("\n\n\n");
				console.log(browser.url);
				browser.clickLink("#deleteProduct").then(function(){
					var errorMsg = browser.text("#error");
					console.log("failed error : " + browser.text("#error"));					
				}).then(done,done);

			});	

		});

		describe("Edit Product", function() {
			this.timeout(timeout);
			
			beforeEach(function(done){

					console.log("visited :" + browser.url);
				browser.clickLink("#editProduct").then(function(){
					assert.ok(browser.success);
				}).then(done,done);

			});
		
			it('EDIT PRODUCT  : Make Sure Edit Product Page', function(done){
				console.log("\n\n\n");
				console.log("visited :" + browser.url);
				done();				
			});

			it('EDIT Product  : Make sure Edit page fields', function(done){
					console.log("\n\n\n");
			
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


			it('EDIT Product  : Submit After Editing Product Information', function(done){
				console.log("\n\n\n");
				browser.fill("name","Altered Product Name");
				console.log("==========================");
				console.log(browser.field("name").value);
				console.log("==========================");
				browser.pressButton("#submit").then(function(){
					assert.ok(browser.success);
					console.log(browser.url);
				}).then(done,done);

			});	

		});

	});


});
