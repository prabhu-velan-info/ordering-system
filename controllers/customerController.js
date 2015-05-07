var customerClass = require("../lib/classes/users/customer.js");
module.exports.controller = function(app, passport) {

	//This action will load the Add new Customer
	//Input : req,res
	//Output : renders addCustomer page
	app.get('/addCustomer', isLoggedIn, function(req, res) {
  		res.render('dashboard/customer/addCustomer.ejs', { title: 'Add Customer Page' , message : ''});
	});

	//This action will show the customer lists
	//Input : req,res
	//Output : renders listCustomer page
	app.get('/listCustomer', isLoggedIn, function(req, res) {
		if(messageContent != null){
			var status = messageContent;
			messageContent = "";
		}
  		res.render('dashboard/customer/listCustomer.ejs', { title: 'Customers lists' , message : status});
	});

	//This action will return the list of customer details
	//Input : req,res
	//Output : send listCustomer response
	app.post('/listCustomer', function(req, res) {
		console.log("++++++++++++++++++++++")
		console.log(req.params);
		var Customer = new customerClass();
		Customer.listCustomer(req, res,function(err, response){
			
			if(!err){
				res.send({"status" : true, "response" : response, message : ""});		
			}
			else{
				res.send({"status" : false, "response" : null, message : response});	
			}
			

		});  	

	});

	//This action will create an Customer
	//Input : req,res
	//Output : sends created Response
	app.post('/addCustomer', function(req, res) {
		
		var Customer = new customerClass();
		Customer.createCustomer(req, res,function(err, response){
			if(!err){
				res.send({status : response.status, message : response.message});
			}
			else{
				res.send({status : response.status, message : response.message});
			}			
		});  		
  		
	});
	
	//This action will edit The previous Customer detail
	//Input : req,res
	//Output : renders editCustomer page
	app.get('/editCustomer/:id',isLoggedIn, function(req, res){
		console.log(req.params);
		var Customer = new customerClass();
		Customer.getCustomerById(req, res,function(err, response){
			
			if(!err){
				console.log("rendering the edit page...!");
				res.render('dashboard/customer/editCustomer.ejs', { title: 'Edit Customer Page' , data : response, message : ''});
			}
			else{
				res.render('dashboard/customer/editCustomer.ejs', { title: 'Edit Customer Page' , data : "", message : ''});
			}
		
		}); 
	});

	var messageContent = "";
	//This action update the edited selected Customer data
	//Input : req,res
	//Output : renders listCustomer page
	app.post('/editCustomer/:id', function(req, res){
		console.log("++++++++++++++++++++++")
		console.log(req.params);
		var Customer = new customerClass();
		
		Customer.editCustomer(req, res,function(err, response){
	
			if(!err){
				messageContent = "Customer data Updated!";			
				res.redirect("/listCustomer");				
			}
			else{
				console.log("Error occured : " + err);
			}
	
		}); 
	});

	//This action will delete an Customer based on the result 
	//Input : req,res
	//Output : send listCustomer page
	app.get('/deleteCustomer/:id', isLoggedIn,  function(req, res) {
		console.log("========================");
		console.log(req.params);
		var Customer = new customerClass();
		Customer.deleteCustomer(req, res,function(err, response){			
			
			if(!err){
				messageContent = "Customer data Deleted!";
				res.redirect("/listCustomer");
			}
			else{
				console.log("Error occured : " + err);
			}

		});  	

	});

};

//This action will check user is present in session or not
//Input : req,res
//Output : login page or next();
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
}

