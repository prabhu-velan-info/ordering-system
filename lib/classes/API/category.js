var bcrypt = require('bcrypt-nodejs');
var db = require('../../../models');

var util = require("util"); 
var fs = require("fs"); 
var path = require('path');
var easyImg = require("easyimage");

//This method will initialize the Category class
//Input : none
//Output : initialized
function CategoryAPI(){

	console.log("Initialize Category Class");

};

//This method will list all the Category  from db
//Input : req,res,
//Output : category list
CategoryAPI.prototype.listCategory = function(req, res, callback) {
	// write operation to delete Category...
	db.Category.findAll().complete(function(err, categories){
		
		if(!err){
			console.log("Number of categories : " + categories.length);
			response = {"status" : true, "response" : categories, "message" : "Categories list"}
			callback(null, response);
		}
		else{
			throw new Error("No categories found...!");
			response = {"status" : false, "response" : null, "message" : "Categories list failed!"}
			callback(err, response);
		}

	});
};

//This method will list asll the search categories from db
//Input : req,res,
//Output : searched result response
CategoryAPI.prototype.searchCategory = function(req, res, callback) {
	// write operation to delete Category...
	console.log(req.body);
	var searchText = req.body.search;

	var search = '%'+searchText+'%';
	db.Category.findAll({

		// where:["categoryName like ?", search],
		where : {"categoryName" : { ilike : search}},
		attributes: ['categoryName', 'imageUrl']

	}).success(function(record){
		if(record != undefined && record.length > 0){
			console.log(record.length);
			response = {"status" : true, "response" : record, "message" : "Searched Categories"};
			callback(null, response);
		}
		else{
			// console.log(record);
			console.log("record is empty");
			response = {"status" : false, "response" : record, "message" : "No Category Matched!"};
			callback(null, response);
		}
	});

};
module.exports = CategoryAPI;

