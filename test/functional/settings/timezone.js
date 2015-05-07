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

var visitPage = "timeZone";

describe("Add Admin Test", function() {
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
		CHANGE TIMEZONE : Show the Page
		CHANGE TIMEZONE : Make Sure Fields
		CHANGE TIMEZONE : Refuse Empty submission
		CHANGE TIMEZONE : Change time zone
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
				// console.log(browser.feild("email").value);
				return browser.pressButton("submit");
			}).then(function() {
				var adminUrl = website + visitPage;
				return browser.visit(adminUrl);
			}).then(done, done);

		});
		
		// //check the page once logged in
		describe("Make Sure time zone page", function() {
			this.timeout(timeout);
			
			it('TIMEZONE SETTINGS', function(){

				console.log("\n\n\n");
				console.log(browser.url);
				assert.ok(browser.success);
				console.log(browser.url);
				assert.equal(browser.url, website + visitPage);		

			});

		});

		describe("Make Sure time zone fields", function() {
			this.timeout(timeout);
			
			it('TIMEZONE FIELDS', function(){

				console.log("\n\n\n");
				console.log(browser.url);
				assert.equal(browser.field("selectTimeZone").name, "selectTimeZone");
				assert.equal(browser.field("chageTimeZone").type, "button");

			});

		});

		describe("Change the Timezone", function() {
			this.timeout(timeout);

			it('CHANGE TIMEZONE : Change the Timezone', function(done){
		
				console.log("\n\n\n");
				browser.pressButton("#chageTimeZone").then(function(){

					assert.ok(browser.success);			
					operatorUrl = website+"timeZone";
					assert.equal(browser.url , operatorUrl);
					
					var errorMsg = browser.text("#error");
					console.log("failed error : " + browser.text("#error"));
					assert.equal(errorMsg , "Timezone Updated!");			
								
				}).then(done, done);
				
			});


		});

		

	});
});