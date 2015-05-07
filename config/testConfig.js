module.exports = test = {

	//admin config
	adminUsername : "admintest",
	adminEmail : "admintest@admin.com",
	adminPassword : "Comet123$",
	
	//Delivery Person config
	deliveryPersonUsername : "deliveryPersontest",
	deliveryPersonEmail : "deliveryPersontest@delivery.com",
	deliveryPersonPassword : "Comet123$",
	deliveryPersonPhone : "1234567890",

	//Customer config
	customerUsername : "customertest",
	customerEmail : "customertest@customer.com",
	customerPassword : "Comet123$",
	customerStoreName : "Test Store",
	customerAddress : "customer Address Content",	
	customerPhone : "1231231321",

	timeout : 60000000,

	port : 3006,
	
};

// Steps to run the test cases
// delete all the tables
// run the project to create required tables		
// node config/seed.js
// mocha --recursive
// comment initsocket, alteradmin, loadtimezone
