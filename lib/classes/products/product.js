var db = require('../../../models');

var util = require("util"); 
var fs = require("fs"); 
var path = require('path');
var easyImg = require("easyimage");

//This method will initialize the Product class
//Input : none
//Output : initialized
function Product(){

	console.log("Initialize Customer Class");

};

//This method will create a new product
//Input : req,res, callback
//Output : created response
Product.prototype.addProduct = function(req, res, callback) {
	console.log(req.body);
	var categoryName = req.body.categoryName;
	
	db.Category.findAll().complete(function(err, categoryPresent){
		if(err)
			throw new Error(err);		
		
		if(categoryPresent.length > 0){
			db.Category.find({
								where: {"categoryName" : categoryName}
							}).complete(function(err, categoryRecord){
								if(err)
									throw new Error(err);		

								//check for the product
								if(categoryRecord){
									
									db.Product.find({
										where: {"productName" : req.body.name}
									}).complete(function(err, productRecord){
										if(err)
											throw new Error(err);

										if(productRecord){
											callback(null, {status : false, response : null, message : 'Product Already Registered'});		
										}
										else{					
											//Create a new product
											console.log("Creating a new Produc...!");
											saveAndGetFilePath(req, function(err, filePath){
												
												db.Product.create({
													"productName" :req.body.name,
													"price" :req.body.price,
													"description" :req.body.description,
													"categoryName" :req.body.categoryName,
													"imageUrl" : filePath,
													"quantity" : req.body.quantity,
													"inStock" : req.body.inStock,
													"startDate" : req.body.startDate,
													"endDate" : req.body.endDate,
													"discount" : req.body.discountPercent,
													"salePrice" : req.body.salePrice,
													"CategoryId" : categoryRecord.id
												}).complete(function(err, record){
													if(!err){
														response = {"status":true, "message" : "Product successfully created!"};
														callback(null, response);
													}
													else{
														throw new Error("Product creation failed...!");
														response = {"status":false, "message" : "Product creation failed..."};
														callback("Product creation failed", response);
													}
												});

											});

										}	
									});		

								}
								else{
									callback(null, {status : false, response : null, message : 'Category not found!'});
								}
							});
		}
		else{
			callback(null, {status : false, response : null, message : 'Category is Empty Please Add a Category!'});
		}
	});

};
//This method will updated Product data
//Input : req,res, callback
//Output : updated response
Product.prototype.editProduct = function(req, res, callback) {
	console.log(req.body);
	var id = req.params.id;
	var categoryName = req.body.categoryName;
	console.log("+++++++++++++");
	console.log(req.params.id)
	console.log(req.body)
	db.Category.find({
		where: {"categoryName" : categoryName}
	}).complete(function(err, categoryRecord){
		if(err)
			throw new Error(err);		

		//check for the product
		if(categoryRecord){
			
			db.Product.find({ where : { "id": id }}).complete(function(err, record){
				if(record != undefined){

					// saveAndGetFilePath(req, function(err, filePath){
								
								record.updateAttributes({
									"productName" :req.body.name,
									"price" :req.body.price,
									"description" :req.body.description,
									"categoryName" :req.body.categoryName,
									// "imageUrl" : filePath,
									"quantity" : req.body.quantity,
									"inStock" : req.body.inStock,
									"startDate" : req.body.startDate,
									"endDate" : req.body.endDate,
									"discount" : req.body.discountPercent,
									"salePrice" : req.body.salePrice,							
								}).complete(function(err, updated){
									callback(null, {status : true, response : updated, message : 'Product updated!'});
								});

							// });

				}
				else{
					throw new Error("Update Record error...!");
					callback(err,"Update Record error...!")
				}
			});		

		}
		else{
			callback(null, {status : false, response : null, message : 'Category not found!'});
		}
	});

};


//This method will list all the Product from db
//Input : req,res,
//Output : Product list
Product.prototype.listProduct = function(req, res, callback) {
	
	db.Product.findAll().complete(function(err, products){
		
		if(!err){
			console.log("Number of Product : " + products.length);
			callback(null, products);
		}
		else{
			throw new Error("No users found...!");
			callback(err, "No users found...!");
		}

	});
};

// //This method will update the product Data 
// //Input : req,res,
// //Output : response
// Product.prototype.editProduct = function(req, res, callback) {
// 	// body...
// 	var id = req.params.id;
// 	console.log("RECEIVED Product ID :" + id);

// 	db.Product.find({ where : { "id": id }}).complete(function(err, record){
// 		if(record != undefined){

// 			saveAndGetFilePath(req, function(err, filePath){
						
// 						record.updateAttributes({
// 							"productName" :req.body.name,
// 							"price" :req.body.price,
// 							"description" :req.body.description,
// 							"categoryName" :req.body.categoryName,
// 							"imageUrl" : filePath,
// 							"quantity" : req.body.quantity,
// 							"inStock" : req.body.inStock,
// 							"startDate" : req.body.startDate,
// 							"endDate" : req.body.endDate,
// 							"discount" : req.body.discountPercent,
// 							"salePrice" : req.body.salePrice,							
// 						}).complete(function(err, updated){
// 							callback(null, updated);
// 						});

// 					});

// 		}
// 		else{
// 			throw new Error("Update Record error...!");
// 			callback(err,"Update Record error...!")
// 		}
// 	});

// };

//This method will update the product Data 
//Input : req,res,
//Output : response
// Product.prototype.editProduct = function(req, res, callback) {
// 	// body...
// 	var id = req.params.id;
// 	console.log("RECEIVED Product ID :" + id);
// 	console.log(req.body);
// 	db.Product.find({ where : { "id": id }}).complete(function(err, record){
// 		if(record != undefined){

// 			saveAndGetFilePath(req, function(err, filePath){
						
// 						record.updateAttributes({
// 							"productName" :req.body.name,
// 							"price" :req.body.price,
// 							"description" :req.body.description,
// 							"categoryName" :req.body.categoryName,
// 							"imageUrl" : filePath,
// 							"quantity" : req.body.quantity,
// 							"inStock" : req.body.inStock,
// 							"startDate" : req.body.startDate,
// 							"endDate" : req.body.endDate,
// 							"discount" : req.body.discountPercent,
// 							"salePrice" : req.body.salePrice,							
// 						}).complete(function(err, updated){
// 							callback(null, updated);
// 						});

// 					});

// 		}
// 		else{
// 			throw new Error("Update Record error...!");
// 			callback(err,"Update Record error...!")
// 		}
// 	});

// };


//This method will get the product based on id
//Input : req,res,
//Output : response
Product.prototype.getProductById = function(req, res, callback) {
	
	var id = req.params.id;
	console.log("ID : "+id);
	db.Product.find({
		where: { 'id' : id }
	}).complete(function(err, searchedRecord){
		if(!err){		
			console.log("Searched Product detail");
			console.log(searchedRecord.values);	 
			callback(null, searchedRecord);
		}
		else{
			throw new Error("No products found to edit...!");
			callback(err, "No products found to edit...!");
		}
	});

};


//This method will delete a product from the DB
//Input : req,res
//Output : response
Product.prototype.deleteProduct = function(req, res, callback) {
	
	console.log(req.body);
	var id = req.params.id;
	db.Product.find({
		where:{'id':id}
	}).complete(function(err, record){
		if(record != undefined){
			record.destroy().complete(function(err, destroyed){
				
				if(err) throw new Error(error);
				callback(null, destroyed);

			});
		}
		else{
			throw new Error("No product found to delete...!");
			callback(err, "No product found to delete...!");
		}
	});

};

//This method will save the product image in server 
//Input : req,res,
//Output : return file path
function saveAndGetFilePath(req, callback){
	
	// get the temporary location of the file
	var tmp_path = req.files.myFile.path;
	// set where the file should actually exists - in this case it is in the "images" directory
	var target_path = './public/uploads/images/products/' + req.files.myFile.name;
	var savePath = "/uploads/images/products/";
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


module.exports = Product;
