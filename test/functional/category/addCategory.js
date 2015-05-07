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

var visitPage = "addCategory";

describe("Add Category Test", function() {
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
		ADD CATEGORY : Show the Page
		ADD CATEGORY : Make Sure Fields

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
		
		// //check the page once logged in
		describe("Make Sure Category Page opened", function() {
			this.timeout(timeout);
			
			it("ADD CATEGORY : Show the Add Category Page", function(){
				assert.ok(browser.success);
				assert.equal(browser.url, website + visitPage);
			});


		});

			// //check the page once logged in
		describe("Make Sure category page fields", function() {
			this.timeout(timeout);
			
			it("ADD CATEGORY : Make sure category page fields", function(){
				assert.equal(browser.field("categoryName").type,"text");
				assert.equal(browser.field("myFile").type,"file");
			});

		});

	});
});