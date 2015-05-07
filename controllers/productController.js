var productClass = require("../lib/classes/products/product.js");

module.exports.controller = function(app, passport) {

	//Product Section
	//This action will render page to add Product page
	//Input : req,res
	//Output : renders addProduct page
	app.get('/addProduct', isLoggedIn, function(req, res) {
  		res.render('dashboard/products/addProduct.ejs', { title: 'Add Product Page' , message : ''});
	});

	//This action will create an Product
	//Input : req,res
	//Output : sends created Response
	app.post('/addProduct', function(req, res) {
		
		var Product = new productClass();
		Product.addProduct(req, res,function(err, response){
			if(!err){
				res.send({status : response.status, message : response.message});
			}
			else{
				//error response
				res.send({status : response.status, message : response.message});
			}
			
		});  		
  		
	});

	//This action will edit The previous Product detail
	//Input : req,res
	//Output : renders editProduct page
	app.get('/editProduct/:id', isLoggedIn, function(req, res){

		console.log(req.params);
		var Product = new productClass();
		Product.getProductById(req, res,function(err, response){
			
			if(!err){
				console.log("rendering the edit page...!");
				res.render('dashboard/products/editProduct.ejs', { title: 'Edit Product Page' , data : response, message : ''});
			}
			else{
				res.render('dashboard/products/editProduct.ejs', { title: 'Edit Product Page' , data : "", message : ''});
			}
		
		}); 

	});

	//This action will delete an Product based on the result 
	//Input : req,res
	//Output : send listProduct response
	app.get('/deleteProduct/:id', isLoggedIn, function(req, res) {
		
		var Product = new productClass();
		Product.deleteProduct(req, res,function(err, response){			
			
			if(!err){
				messageContent = "Product data Deleted!";
				res.redirect("/listProduct");						
			}
			else{
				console.log("Error occured : " + err);
			}

		});  	

	});

	var messageContent = "";
	//This action update the edited fileds of the selected Product
	//Input : req,res
	//Output : renders listProduct page
	app.post('/editProduct/:id', function(req, res){
		console.log(req.params);
		var Product = new productClass();
		
		Product.editProduct(req, res,function(err, response){
	
			if(!err){
				// messageContent = "Product data Updated!";			
				// res.redirect("/listProduct");				
				res.send({status : response.status, message : response.message, response: response.response})					
			}
			else{
				console.log("Error occured : " + err);
			}

	
		}); 
	});

	//This action will render page to list Product page
	//Input : req,res
	//Output : renders listProduct page
	app.get('/listProduct', isLoggedIn, function(req, res) {
		if(messageContent != null){
			var status = messageContent;
			messageContent = "";
		}
  		res.render('dashboard/products/listProduct.ejs', { title: 'List Product Page' , message : status});
	});

	//This action will redirects the list product page with a message
	//Input : req,res
	//Output : renders listProduct page
	app.get('/listUpdatedProduct', isLoggedIn, function(req, res) {
		
		messageContent = "Product data Updated";
  		res.redirect("/listProduct");
	
	});

	//This action will return list of Product 
	//Input : req,res
	//Output : send listProducts response
	app.post('/listProduct', function(req, res) {
		
		var Product = new productClass();
		
		Product.listProduct(req, res,function(err, response){
			
			if(!err){
				res.send({"status" : true, "response" : response, message : ""});		
			}
			else{
				res.send({"status" : false, "response" : null, message : null});	
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


