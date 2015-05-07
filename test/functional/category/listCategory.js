
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

var visitPage = "listCategory";

describe("List Category Test", function() {
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
		LIST CATEGORY : Show List Category Page
		LIST CATEGORY : Delete An item 
		LIST CATEGORY : Edit A Category
		LIST CATEGORY : Make sure Edit page
		LIST CATEGORY : Make sure fields
		LIST CATEGORY : Update the Category
		 
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

		describe("List Category", function() {
			this.timeout(timeout);

			it('List Category : Show the List Category Page',function(){
				console.log("\n\n\n");
				console.log(browser.url);
				assert.equal(browser.url, website + visitPage);		
			});

		});

		describe("List Category", function() {
			this.timeout(timeout);

			it('LIST Category  : Delete Categoory', function(done){
				console.log("\n\n\n");
				browser.clickLink("#deleteCategory").then(function(){
					assert.ok(browser.success);					
					var errorMsg = browser.text("#state");
					console.log("failed error : " + browser.text("#state"));
					assert.equal(errorMsg , "Category data Deleted!");
				}).then(done,done);

			});	

		});


		describe("Edit Category", function() {
				this.timeout(timeout);
				
				beforeEach(function(done){

					browser.clickLink("#editCategory").then(function(){
						console.log("visited :" + browser.url);
						assert.ok(browser.success);
					}).then(done,done);

				});
			
				it('EDIT CATEGORY  : Make Sure Edit Category Page', function(done){
					console.log("\n\n\n");
					console.log("visited :" + browser.url);
					assert.ok(browser.success);		
					done();				
				});
			
		});


	});


});
