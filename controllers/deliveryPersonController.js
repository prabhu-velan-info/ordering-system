var DeliveryPersonClass = require("../lib/classes/users/deliveryPerson.js");
module.exports.controller = function(app, passport) {
	
	//DeliveryPerson Section
	//This action will render page to add DeliveryPerson
	//Input : req,res
	//Output : renders add DeliveryPerson page
	app.get('/addDeliveryPerson', isLoggedIn, function(req, res) {
  		res.render('dashboard/deliveryPerson/addDeliveryPerson.ejs', { title: 'Add Delivery Person Page' , message : ''});
	});


	//This action will create an Delivery Person
	//Input : req,res
	//Output : sends created Response
	app.post('/addDeliveryPerson', function(req, res){
		
		var deliveryPerson = new DeliveryPersonClass();
		deliveryPerson.createDeliveryPerson(req, res,function(err, response){
			if(!err){
				res.send({status : response.status, message : response.message});
			}
			else{
				//error response
				res.send({status : response.status, message : response.message});
			}
		});  	

	});

	//This action will edit The previous Delivery Person detail
	//Input : req,res
	//Output : renders editDeliveryPerson page
	app.get('/editDeliveryPerson/:id', isLoggedIn,  function(req, res){
		console.log(req.params);
		var deliveryPerson = new DeliveryPersonClass();
		deliveryPerson.getDeliveryPersonById(req, res,function(err, response){
			
			if(!err){
				console.log("rendering the edit page...!");
				res.render('dashboard/deliveryPerson/editDeliveryPerson.ejs', { title: 'Edit Delivery Person Page' , data : response, message : ''});
			}
			else{
				res.render('dashboard/deliveryPerson/editDeliveryPerson.ejs', { title: 'Edit Delivery Person Page' , data : "", message : ''});
			}
		
		}); 
	});

	var messageContent = "";
	//This action update the edited fileds of the selected Delivery Person
	//Input : req,res
	//Output : renders listDeliveryPerson page
	app.post('/editDeliveryPerson/:id', function(req, res){
		console.log(req.params);
		var deliveryPerson = new DeliveryPersonClass();
		deliveryPerson.editDeliveryPerson(req, res,function(err, response){
	
			if(!err){
				messageContent = "Delivery Person data Updated!";			
				res.redirect("/listDeliveryPerson");
			}
			else{
				console.log("Error occured : " + err);
			}			

	
		}); 
	});
	

	//This action will render page to list DeliveryPerson
	//Input : req,res
	//Output : renders listDeliveryPerson page
	app.get('/listDeliveryPerson', isLoggedIn, function(req, res) {
		if(messageContent != null){
			var status = messageContent;
			messageContent = "";
		}
  		res.render('dashboard/deliveryPerson/listDeliveryPerson.ejs', { title: 'Add Delivery Person Page' , message : status});
	});

	//This action will load the registered DeliveryPerson
	//Input : req,res
	//Output : returns registered DeliveryPerson
	app.post('/listDeliveryPerson', function(req, res) {
  	
  		var deliveryPerson = new DeliveryPersonClass();
		deliveryPerson.listDeliveryPerson(req, res,function(err, response){
			
			if(!err){
				res.send({"status" : true, "response" : response, message : ""});		
			}
			else{
				res.send({"status" : false, "response" : null, message : response});	
			}
			

		});  	
	
	});

	//This action will delete an DeliveryPerson based on the result 
	//Input : req,res
	//Output : redirects to listDeliveryPerson
	app.get('/deleteDeliveryPerson/:id', isLoggedIn, function(req, res) {
		
		var deliveryPerson = new DeliveryPersonClass();
		deliveryPerson.deleteDeliveryPerson(req, res,function(err, response){			
			
			if(!err){
				
				messageContent = "Delivery Person data Deleted!";
				res.redirect("/listDeliveryPerson");
				
			}
			else{
				console.log("Error occured : " + err);
			}


		});  	

	});
	
	//This action will search and lists the delivery person for the given input
	//Input : req,res
	//Output : delivery person list name
	app.get('/searchDeliveryPerson/:search', isLoggedIn, function(req, res){
		
		var deliveryPerson = new DeliveryPersonClass();
		deliveryPerson.searchDeliveryPerson(req, res, function(err, response){
			if(!err){
				res.jsonp(response);
			}	
			else{
				res.send({'status':false , "response" : []});
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


