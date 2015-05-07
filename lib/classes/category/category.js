var bcrypt = require('bcrypt-nodejs');
var db = require('../../../models');

var util = require("util"); 
var fs = require("fs"); 
var path = require('path');
var easyImg = require("easyimage");

//This method will initialize the Category class
//Input : none
//Output : initialized
function Category(){

	console.log("Initialize Category Class");

};

//This method will Add a new category for the category 
//Input : req,res,
//Output : added response
Category.prototype.addCategory = function(req, res, callback) {
	
	var response = null;
	var categoryName = req.body.categoryName;

	db.Category.find({
		where: {"categoryName" : categoryName}
	}).complete(function(err, categoryRecord){

		if(err)
			throw new Error(err);		

		//if category already exists
		if(categoryRecord){
			response = {"status":false, "message" : "Category already present!"};
			callback(null, response);
		}
		//perform operation to create new product
		else{
			saveAndGetFilePath(req, function(err, filePath){
		
				if(!err){
					var storedFilePath = filePath;//filePath.replace(/^./,'');		
					console.log(req.body);
					console.log("STORED IMAGE LOCATION : "+storedFilePath);
					db.Category.create({"categoryName" : req.body.categoryName, "imageUrl": storedFilePath}).complete(function(err, record){
						if(!err){
							response = {"status":true, "message" : "Category successfully created!"};
							callback(null, response);
						}
						else{
							throw new Error("Category creation failed...!");
							response = {"status":false, "message" : "Category creation failed..."};
							callback("Category Creation Failed", response);
						}
					});
				}
				else{
					//return the error Message
					throw new Error("Image Uploading failed...!");
					response = {"status":false, "message" : "Image Uploading failed..."};
					callback("Image Upload Failed", response);
				}


			});
		}
	});

};

//This method will list all the Category  from db
//Input : req,res,
//Output : category list
Category.prototype.listCategory = function(req, res, callback) {
	// write operation to delete Category...
	db.Category.findAll().complete(function(err, categories){
		
		if(!err){
			console.log("Number of categories : " + categories.length);
			callback(null, categories);
		}
		else{
			throw new Error("No categories found...!");
			callback(err, "No categories found...!");
		}

	});
};

//This method will list all the search categories from db
//Input : req,res,
//Output : searched result response
Category.prototype.searchCategory = function(req, res, callback) {
	// write operation to delete Category...
	console.log("+++++++++++++++++")
	console.log(req.params);
	var searchText = req.params.search;

	var search = '%'+searchText+'%';
	db.Category.findAll({

		// where:["categoryName like ?", search],
		where : {"categoryName" : { ilike : search}},
		attributes: ['categoryName'],
		limit: 3
	}).success(function(record){
		if(record != undefined){
			console.log(record.length);
			callback(null, record);
		}
		else{
			// console.log(record);
			console.log("record is empty");
			callback("record is empty", null);
		}
	});

};




//This method will delete and category from the DB
//Input : req,res,
//Output : deleted response
Category.prototype.deleteCategory = function(req, res, callback) {
	// write operation to delete Category...
	console.log(req.body);
	var id = req.params.id;
	db.Category.find({
		where:{'id':id}
	}).complete(function(err, record){
		if(record != undefined){
			record.destroy().complete(function(err, destroyed){
				
				if(err) throw new Error(error);
				callback(null, destroyed);

			});
		}
		else{
			throw new Error("No Category found to delete...!");
			callback(err, "No Category found to delete...!");
		}
	});

};

//This method will get category based on id
//Input : req,res,
//Output : category response
Category.prototype.getCategoryById = function(req, res, callback) {

	var id = req.params.id;
	console.log("ID : "+id);
	db.Category.find({
		where: { 'id' : id }
	}).complete(function(err, searchedRecord){
		if(!err){		
			console.log("Searched Record");
			console.log(searchedRecord.values);	
			// searchedRecord.values.password = 
			callback(null, searchedRecord);
		}
		else{
			throw new Error("No users found to edit...!");
			callback(err, "No users found to edit...!");
		}
	});

};

//This method will update the Category Data 
//Input : req,res,
//Output : response
Category.prototype.editCategory = function(req, res, callback) {
	// body...
	var id = req.params.id;
	console.log("RECEIVED Category ID :" + id);

	db.Category.find({ where : { "id": id }}).complete(function(err, record){
		if(record != undefined){
			console.log("++++++++++++++++++++++++++");
			console.log(req.files.myFile);
			saveAndGetFilePath(req, function(err, filePath){
			
				if(!err){

					record.updateAttributes({"categoryName" : req.body.categoryName, "imageUrl" : filePath}).complete(function(err, updated){
						callback(null, updated);
					});

				}
				else{

					throw new Error("Update Record error...!");
					callback(err,"Update Record error...!");

				}

			});

		}
		else{

			throw new Error("Update Record error...!");
			callback(err,"Update Record error...!");

		}
	});

};


//This method will upload and returns 
//Input : req,res,
//Output : returns saved file location
function saveAndGetFilePath(req, callback){
	
	// get the temporary location of the file
	var tmp_path = req.files.myFile.path;
	// set where the file should actually exists - in this case it is in the "images" directory
	var target_path = './public/uploads/images/categories/' + req.files.myFile.name;
	var savePath = "/uploads/images/categories/";
	// move the file from the temporary location to the intended location
	fs.rename(tmp_path, target_path, function(err) {
	    if (err) throw err;
	    // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
	    fs.unlink(tmp_path, function() {
	        if (err) throw err;
	        // res.send('File uploaded to: ' + target_path + ' - ' + req.files.myFile.size + ' bytes');
			console.log('File uploaded to: ' + target_path + ' - ' + req.files.myFile.size + ' bytes');	            
			savePath = savePath + req.files.myFile.name;
			console.log("Save File to :" + savePath);
	        callback(null, savePath);
	        // res.redirect("/addCategory");

	    });
	});
}

module.exports = Category;