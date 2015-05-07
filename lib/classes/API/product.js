var db = require('../../../models');

var util = require("util"); 
var fs = require("fs"); 
var path = require('path');
var easyImg = require("easyimage");

//This method will initialize the Product class
//Input : none
//Output : initialized
function ProductAPI(){

	console.log("Initialize Customer Class");

};

//This method will list all the Product from db
//Input : req,res,
//Output : Product list
ProductAPI.prototype.getProducts = function(req, res, callback) {
	
	var categoryId = req.body.categoryId;

	db.Product.findAll({
		"CategoryId" : categoryId
	}).complete(function(err, products){
		
		if(!err){
			console.log("Number of Product : " + products.length);
			response = {"status" : true, "response" : products, "message" : "List of products"};
			callback(null, response);
		}
		else{
			throw new Error("No products found...!");
			response = {"status" : false, "response" : null, "message" : "No products found...!"};
			callback(err, response);
		}

	});
};

//This method will get the product based on id
//Input : req,res,
//Output : response
ProductAPI.prototype.getProductById = function(req, res, callback) {
	
	var productId = req.body.productId;
	
	console.log("ID : "+productId);
	db.Product.find({
		where: { 'id' : productId }
	}).complete(function(err, searchedRecord){
		if(!err){		
			console.log("Searched Product detail");
			console.log(searchedRecord.values);	 
			response = {"status" : true, "response" : searchedRecord, "message" : "Product info"};
			callback(null, response);
		}
		else{
			throw new Error("No products found...!");
			response = {"status" : false, "response" : null, "message" : "No products found...!"};
			callback(err, response);
		}
	});

};

//This method will list the searched products from db
//Input : req,res,
//Output : searched result response
ProductAPI.prototype.searchProduct = function(req, res, callback) {
	// write operation to delete Category...
	console.log(req.body);
	var searchText = req.body.search;

	var search = '%'+searchText+'%';
	db.Product.findAll({

		where : {"productName" : { ilike : search}},

	}).success(function(record){
		if(record != undefined && record.length > 0){
			console.log(record.length);
			response = {"status" : true, "response" : record, "message" : "Searched Products"};
			callback(null, response);
		}
		else{
			// console.log(record);
			console.log("record is empty");
			response = {"status" : false, "response" : record, "message" : "No Product Matched!"};
			callback(null, response);
		}
	});

};
module.exports = ProductAPI;
