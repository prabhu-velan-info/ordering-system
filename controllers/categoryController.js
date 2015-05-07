var util = require("util"); 
var fs = require("fs"); 
var path = require('path');
var easyImg = require("easyimage");
var categoryClass = require("../lib/classes/category/category.js");

module.exports.controller = function(app, passport) {
	
	var redirectMessage = null;
	//This action will render page to add category page
	//Input : req,res
	//Output : renders addCategory page
	app.get('/addCategory', isLoggedIn,function(req, res) {
	
		var message = null
		if(redirectMessage != undefined){
			message = redirectMessage;
			redirectMessage = null; 
		}
  	
  		res.render('dashboard/categories/addCategory.ejs', { title: 'Add Category Page' , "message" : message});
	});
	
	//This action will add a new category
	//Input : req,res
	//Output : returns added resopnse
	app.post("/addCategory", function(req, res){
		
		var Category = new categoryClass();
		Category.addCategory(req, res, function(err, response){

			if(!err){
				res.send({status : response.status, message : response.message});
			}
			else{
				//error response
				res.send({status : response.status, message : response.message});
			}

		});
	
	});


	//This action will render page to edit category page
	//Input : req,res
	//Output : renders editCategory page
	app.get('/editCategory', isLoggedIn, function(req, res) {
  		res.render('dashboard/categories/editCategory.ejs', { title: 'Edit Category Page' , message : ''});
	});



	//This action will render page to list category page
	//Input : req,res
	//Output : renders listCategory page
	app.get('/listCategory', function(req, res) {
		var message = null
		if(redirectMessage != undefined){
			message = redirectMessage;
			redirectMessage = null; 
		}
		
  		res.render('dashboard/categories/listCategory.ejs', { title: 'List Category Page' , message : message});
	});

	//This action will return list of Category 
	//Input : req,res
	//Output : sends the category lists
	app.post('/listCategory', function(req, res) {
		
		var Category = new categoryClass();
		Category.listCategory(req, res,function(err, response){
			
			if(!err){
				res.send({"status" : true, "response" : response, message : ""});		
			}
			else{
				res.send({"status" : false, "response" : null, message : response});	
			}
			

		});  	

	});

	//This action will delete an Category based on the id 
	//Input : req,res
	//Output : deleted category response
	app.get('/deleteCategory/:id', isLoggedIn, function(req, res) {
		
		var Category = new categoryClass();
		Category.deleteCategory(req, res,function(err, response){			
			
			if(err)
				console.log("Error occured : " + err);
			
			redirectMessage = "Category data Deleted!";
			res.redirect("/listCategory");

		});  	

	});

	//This action will edit The Category detail
	//Input : req,res
	//Output : renders editCategory page
	app.get('/editCategory/:id', isLoggedIn, function(req, res){
		console.log(req.params);
		
		var Category = new categoryClass();
		Category.getCategoryById(req, res,function(err, response){
			
			if(!err){
				console.log("rendering the edit page...!");
				res.render('dashboard/categories/editCategory.ejs', { title: 'Edit Category Page' , data : response, message : null});
			}
			else{
				res.render('dashboard/categories/editCategory.ejs', { title: 'Edit Category Page' , data : "", message : null});
			}
		
		}); 
	});

	//This action will search and lists the category name for the given input
	//Input : req,res
	//Output : category list name
	app.get('/searchCategory/:search', isLoggedIn, function(req, res){
		
		var Category = new categoryClass();		
		Category.searchCategory(req, res, function(err, response){
			if(!err){
				res.jsonp(response);
			}	
			else{
				res.send({'status':false , "response" : []});
			}
		});

	});

	//This action update the edited fileds of the selected Category
	//Input : req,res
	//Output : renders listCategory page
	app.post('/editCategory/:id', function(req, res){

		console.log(req.params);
		var Category = new categoryClass();
		
		Category.editCategory(req, res,function(err, response){
	
			if(err)
				console.log("Error occured : " + err);
			
			redirectMessage = "Category data Updated!";			
			res.redirect("/listCategory");
	
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


