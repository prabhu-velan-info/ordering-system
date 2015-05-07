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

var visitPage = "addAdmin";

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
		ADD ADMIN : Show the Page
		ADD ADMIN : Make Sure Fields
		ADD ADMIN : Refuse Empty submission
		ADD ADMIN : Create Admin
		ADD ADMIN : Email Already Exists
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
		
		describe("Make Sure fields", function() {
			this.timeout(timeout);
			
			it('ADD ADMIN : Make sure Fields', function(){

				console.log("\n\n\n");
				console.log(browser.url);
				assert.equal(browser.field("name").type, "text");
				assert.equal(browser.field("email").type, "text");
				assert.equal(browser.field("password").type, "password");
				assert.equal(browser.field("submit").name, "submit");
				assert.equal(browser.field("reset").name, "reset");

			});

		});

		// // //check the page once logged in
		describe("Empty Submission", function() {
			this.timeout(timeout);

			it('ADD ADMIN : should refuse empty submissions', function(done){
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
		describe("Create Admin", function() {
			this.timeout(timeout);

			it('ADD ADMIN  : Add Admin success', function(done){
				
				console.log("\n\n\n");
				console.log(browser.url);
				browser.fill("name",lastAdminRecord.name + "1");
				browser.fill("email",lastAdminRecord.name + "1"+"@admin.com");
				browser.fill("password",password);

				browser.pressButton("#submit").then(function(){
					var errorMsg = browser.text("#state");
					console.log("failed error : " + browser.text("#state"));
					assert.equal(errorMsg , "Admin created");					
				}).then(done, done);

			});

		});

		describe("Email Already Exists", function() {
			this.timeout(timeout);

			it('ADD ADMIN  : Admin Already registered', function(done){
				
				console.log("\n\n\n");
				console.log(browser.url);
				browser.fill("name",lastAdminRecord.name + "1");
				browser.fill("email",lastAdminRecord.name + "1"+"@admin.com");
				browser.fill("password",password);

				browser.pressButton("#submit").then(function(){
					var errorMsg = browser.text("#state");
					console.log("failed error : " + browser.text("#state"));
					assert.equal(errorMsg , "That email is already taken.");					
				}).then(done, done);

			});


		});

		

	});
});