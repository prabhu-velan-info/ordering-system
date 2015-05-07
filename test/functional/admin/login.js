
//Test Case for Admin Login
// process.env.NODE_ENV = 'test';

var BrowserObj = require("zombie");
var assert = require("assert");

var app = require("../../../app");
var http = require("http");
var website = "http://localhost:3006/";
var Browser;

// Test Params
var email;
var password = "Comet123$";

var db = require("../../../models");
var config = require("../../../config/testConfig");

var timeout = config.timeout;



describe("Admin Authentication", function(){
	this.timeout(timeout);

	before(function(){
		this.server = http.createServer(app).listen(3006);
		Browser = new BrowserObj({site : website, debug : true, waitDuration : 60000});
	});
	
	beforeEach(function(done) {
		Browser.visit('/login', done);
	}); 

	it('LOGIN : Show the Login Page',function(){
		console.log("\n\n\n");
		assert.ok(Browser.success);
		assert.equal(Browser.url, website+"login");		
	});


	it("LOGIN : Get DATA from DB", function(done){
		db.Admin.findAll().complete(function(err, record){
			
			if(record){
				email = record[0].values.email;
				console.log("=======================");
				console.log(email);
				console.log(password);
				done();

			}	
			else{
				console.log("No record Found to LOGIN!");
					done();

			}
		});
	});


	it('LOGIN : Make sure Fields', function(done){
		console.log("\n\n\n");
		var browser = Browser;
		assert.equal(browser.field("email").type, "text");
		assert.equal(browser.field("password").type, "password");
		assert.equal(browser.field("submit").type, "submit");
		assert.equal(browser.field("reset").type, "reset");
		done();
	});

	it('LOGIN : Should refuse empty submissions', function(done){
		console.log("\n\n\n");
		var browser = Browser;
		browser.pressButton("submit", function(error){
			if(error) return done(error);

			var errorMsg = browser.text("#error");
			console.log("failed error : " + browser.text("#error"));
			assert.equal(errorMsg , "Email field should not be empty!");			
			
			done();
		});
	});

	it('LOGIN : Invalid Login username / password', function(done){
		console.log("\n\n\n");
		var browser = Browser;
		browser.fill("email","InvalidEmail@email.com");
		browser.fill("password","InvalidPassword123$");
		browser.pressButton("submit").then(function(){
			var errorMsg = browser.text("#error");
			console.log("failed error : " + browser.text("#error"));
			assert.equal(errorMsg , "No user found.");			
		}).then(done,done);

	});

	it('LOGIN : Login Successfully logged In', function(done){
		console.log("\n\n\n");
		var browser = Browser;
		browser.fill("email",email);
		browser.fill("password", password)
		browser.pressButton("submit").then(function(){
			assert.ok(browser.success);
			// successUrl = website+"dashboard";
			var successUrl = website;
			console.log(browser.url+"=="+successUrl);
			assert.equal(browser.url , successUrl);
		}).then(done, done);
	});

	after(function(done){
		this.server.close(done);
	});

});
