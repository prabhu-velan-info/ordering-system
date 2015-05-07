var moment = require("moment");
var db = require('../../../models');
var async = require("async");

//import in other classes
var SocketClass = require('../utils/socket.js');
var Socket = SocketClass.getInstance();

//This method will initialize the OrderAPI class
//Input : none
//Output : initialized
function OrderAPI(){

	console.log("Initialize OrderAPI Class");

};

//This method will list asll the search ordrs from db
//Input : req,res,
//Output : searched result response
OrderAPI.prototype.searchOrders = function(req, res, callback) {
	// write operation to delete Category...
	console.log(req.body);
	var searchText = req.body.search;

	var search = '%'+searchText+'%';
	db.CustomerOrder.findAll({

		// where:["categoryName like ?", search],
		where : {"placedDate" : { ilike : search}},

	}).success(function(record){
		if(record != undefined && record.length > 0){
			console.log(record.length);
			response = {"status" : true, "response" : record, "message" : "Searched Orders"};
			callback(null, response);
		}
		else{
			// console.log(record);
			console.log("record is empty");
			response = {"status" : false, "response" : record, "message" : "No Orders Matched!"};
			callback(null, response);
		}
	});

};

//This method will this will change the order state from new to pending 
//Input : req, res, callback
//Output : changes the order state to pending
OrderAPI.prototype.placeMyOrder = function(req, res, callback) {
	// body...
	var customerOrderId = req.body.customerOrderId;

	getStateId("new", function(stateErr, newStateId){

		db.CustomerOrder.find({
			where: {"id" : customerOrderId, "OrderStatusId" : newStateId}
		}).complete(function(customerErr, customerOrderRecord){
			
			if(customerErr)
				throw new Error("Place order API falied");

			if(customerOrderRecord != undefined){
				
				getStateId("pending", function(updateStateErr, updateStateId){

					customerOrderRecord.updateAttributes({
						"OrderStatusId" : updateStateId
					}).complete(function(err, updated){
						//sending notification in front end to alert the admin for new orders
						response = {"status" : false, "response" : null, "message" : "Purchased order submitted successfully"};
						callback(customerErr, response);		

					});
					
				});

			}
			else{
				response = {"status" : false, "response" : null, "message" : "No Customer order found!"};
				callback(customerErr, response);
			}

		});


	});

};

//This method will list order by state
//Input : req, res, callback
//Output : returns order by state
OrderAPI.prototype.getOrderBystatus = function(req, res, callback) {
	// body...
	console.log(req.body);	
	
	var orderState = req.body.orderState;
	var customerObject = req.customer;

	getStateId(orderState.toLowerCase(), function(statusErr, statusId){

		db.CustomerOrder.findAll({
			where: {
				"OrderStatusId" : statusId,
				"CustomerId" : customerObject.id
			},
			include : [
				{model: db.OrderStatus, required : true},
			]
		}).complete(function(err, records){
			
			if(err)
				throw new Error("order by status records shows!");

			if(records != undefined){

				console.log(records.length);
				response = {"status" : true, "response" : records, "message" : null};
				callback(err, response);
				
			}
			else{
				console.log("records are empty");
				response = {"status" : false, "response" : records, "message" : "No Customer order found!"};
				callback(err, response);
			}
		});

	});

};

//This method will send all customer orders with its status
//Input : req, res, callback
//Output : sends all orders with order states
OrderAPI.prototype.getOrderDetail = function(req, res, callback) {

	// body...	
	var customerOrderId = req.body.customerOrderId;
	
	db.CustomerOrder.find({
		where: {
			"id" : customerOrderId
		},
		include : [
			{model: db.OrderStatus, required : true},			
			{model: db.Order, required : true},			
		]
	}).complete(function(err, records){
		
		if(err)
			throw new Error("order by status records shows!");

		if(records != undefined){

			console.log(records.length);
			response = {"status" : true, "response" : records, "message" : null};
			callback(err, response);
			
		}
		else{
			console.log("records are empty");
			response = {"status" : false, "response" : records, "message" : "No Customer order found!"};
			callback(err, response);
		}
	});

};

//This method will send all customer orders with its status
//Input : req, res, callback
//Output : sends all orders with order states
OrderAPI.prototype.getMyOrders = function(req, res, callback) {

	// body...	
	getStateId("new", function(stateErr, stateId){

		db.CustomerOrder.find({
			where: {
				"CustomerId" : req.customer.id,
				"OrderStatusId" : stateId,
			},
			include : [
				{model: db.OrderStatus, required : true},			
				{model: db.Order, required : true},			
			]
		}).complete(function(err, records){
			
			if(err)
				throw new Error("order by status records shows!");

			if(records != undefined){

				console.log(records.length);
				response = {"status" : true, "response" : records, "message" : "My Orders"};
				callback(err, response);
				
			}
			else{
				console.log("records are empty");
				response = {"status" : false, "response" : records, "message" : "My Orders are Empty!"};
				callback(err, response);
			}
		});

	});
	

};


//This method will send all customer cart with its status
//Input : req, res, callback
//Output : sends all card data with order states
OrderAPI.prototype.getMyCart = function(req, res, callback) {

	// body...	
	db.CustomerOrder.findAll({
		where: {
			"CustomerId" : req.customer.id,
		}
	}).complete(function(err, records){
		
		if(err)
			throw new Error("Error in getting customer record!");

		if(records != undefined){

			console.log(records.length);
			response = {"status" : true, "response" : records, "message" : "Cart lists"};
			callback(err, response);
			
		}
		else{
			console.log("records are empty");
			response = {"status" : false, "response" : null, "message" : "Cart is Empty!"};
			callback(err, response);
		}
	});

};

//This method will creates or adds a new product to customers order
//Input : req, res, callback
//Output : creates or update a new order
OrderAPI.prototype.purchaseOrder = function(req, res, callback) {
	
	
	console.log(req.body);
	
	var productId = req.body.productId, customerId = req.customer.id, quantity = req.body.quantity;
	//Find whether the product is available or not
	db.Product.find({
		where : { "id" : parseInt(productId)}
	}).complete(function(err, productRecord){
		
			if(err)
				throw new Error("Purchase produc API failed");

			if(productRecord != undefined){
					
					//Check the customer id whether is present or not
					db.Customer.find({
						where: {"id" : customerId}
					}).complete(function(customerErr, customerRecord){
						
							if(customerErr)
								throw new Error("Error in checking the valid customer");
							
							if(customerRecord != undefined){

										//Check the New status id				
										db.OrderStatus.find({
											where : {"status" : "new"}
										}).complete(function(statusErr, statusRecord){
											
												if(statusErr)
													throw new Error("Error in getting the New status");	
												
													if(statusRecord != undefined){
														
																//Check the previous order for the customer if so update the orders details
																console.log(statusRecord.values);																
																db.CustomerOrder.find({
																
																	where : { "CustomerId" : customerId, OrderStatusId : statusRecord.id }

																}).complete(function(customerOrderErr, customerOrderRecord){
																	
																		if(customerOrderErr)
																			throw new Error("Error in getting Customer Order Record");	

																		//checkout the product quantity
																		checkoutProductQuantity(productRecord.id, quantity, "debit", function(checkoutErr, checkoutResponse){
																			
																			if(!checkoutErr){
																					
																					// Check and Perform new / edit updates for the customer orders
																					if(customerOrderRecord != undefined){

																						//update only the totalquantity in CustomerOrders
																						//create / update a new entry in orders table
																						var calculatedTotalPrice = parseFloat(customerOrderRecord.totalPrice) + (parseFloat(quantity) * parseFloat(productRecord.salePrice));
																						customerOrderRecord.updateAttributes({
																							"totalQuantity" : (parseInt(customerOrderRecord.totalQuantity) + parseInt(quantity)),
																							"totalPrice" : calculatedTotalPrice
																						}).complete(function(customerOrderUpdatedErr, customerOrderUpdated){
																								
																								console.log("IDS");
																								console.log("--------------------");
																								console.log(productRecord.id);
																								console.log(customerOrderRecord.id);
																								//customer record update
																								db.Order.find({
																									where: { "ProductId" : productRecord.id, "CustomerOrderId" : customerOrderRecord.id, }
																								}).complete(function(previousOrderRecordErr, previousOrderRecord){
																									
																									if(previousOrderRecordErr)
																										throw new Error("Error in updating previous customer order record!");
																									
																									if(previousOrderRecord != undefined){
																										
																										console.log("PREVIOUS ORDER DETAIL");
																										
																										var previousOrderRecordData = previousOrderRecord.values;
																										console.log(previousOrderRecordData);	

																										var calculatedPrice = parseFloat(previousOrderRecordData.totalPrice) + (parseFloat(quantity) * parseFloat(productRecord.salePrice));
																										var calculatedQuantity = parseInt(previousOrderRecordData.quantity) + parseInt(quantity);
																										
																										previousOrderRecord.updateAttributes({
																											"quantity" : calculatedQuantity,
																											"totalPrice" : calculatedPrice
																										}).complete(function(previousRecordUpdatedErr, previousRecordUpdated){
																											if(previousRecordUpdatedErr)
																												throw new Error("Update purchased product failed!");

																											if(previousRecordUpdated != undefined){
																												response = {"status" : true, "response" : previousRecordUpdated, "message" : "Order successfully purchased!"};
																												callback(previousRecordUpdatedErr, response);
																											}
																											else{
																												response = {"status" : false, "response" : previousRecordUpdated, "message" : "Order updation failed!"};
																												callback(previousRecordUpdatedErr, response);
																											}
																											
																										});

																									}
																									else{
																										//create a new order for the previous customer Order
																										db.Order.create({"ProductId" : productRecord.id, "CustomerOrderId" : customerOrderRecord.id, "productName": productRecord.productName, "imageUrl" : productRecord.imageUrl, "discount" : productRecord.discount, "salePrice" : productRecord.salePrice, "quantity" : quantity, "totalPrice" : (parseFloat(quantity) * parseFloat(productRecord.salePrice))	}).complete(function(createdOrderErr, createdOrder){
																												
																												if(createdOrderErr)
																														throw new Error("Create New Order whe updating the customer record failed!");

																												if(createdOrder != undefined){
																													response = {"status" : true, "response" : createdOrder, "message" : "Order successfully purchased!"};
																													callback(createdOrderErr, response);
																												}
																												else{
																													response = {"status" : false, "response" : null, "message" : "Order status table are empty!"};
																													callback(customerOrderErr, response);	
																												}
																										});
																									}

																								});
																						});
																						
																					}
																					else{
																							console.log("CREATEING NEW CUSTOMER ORDER FOR CUSTOMER RECORD");
																							//customer order is empty!!!
																								//create customerOrder Record
																								//create/update Product from the orders table
																							//create customerOrderRecord and add a new product in orders table
																							var todayDate = moment(new Date()).format('DD-MM-YYYY');
																							console.log(todayDate);

																							db.CustomerOrder.create({"customerName" : customerRecord.name,"placedDate" : todayDate,"totalQuantity" : quantity,"totalPrice" : (parseFloat(quantity) * parseFloat(productRecord.salePrice)), "CustomerId" : customerRecord.id,"OrderStatusId" : statusRecord.id}).complete(function(createdCustomerOrderErr, createdCustomerOrder){
																								// add/ update the product count in orders table

																									db.Order.create({"ProductId" : productRecord.id, "CustomerOrderId" : createdCustomerOrder.id, "productName": productRecord.productName, "imageUrl" : productRecord.imageUrl, "discount" : productRecord.discount, "salePrice" : productRecord.salePrice, "quantity" : quantity, "totalPrice" : (parseFloat(quantity) * parseFloat(productRecord.salePrice))	}).complete(function(createdOrderErr, createdOrder){
																											if(createdOrderErr)
																													throw new Error("Create New Order whe updating the customer record failed!");

																											if(createdOrder != undefined){
																												response = {"status" : true, "response" : createdOrder, "message" : "Order successfully purchased!"};
																												callback(createdOrderErr, response);
																											}
																											else{
																												response = {"status" : false, "response" : null, "message" : "Order status table are empty!"};
																												callback(customerOrderErr, response);	
																											}
																									});

																							});

																					}


																			}
																			else{
																				callback(null, checkoutResponse);
																			}
																		});

																});
													}
													else{
														response = {"status" : false, "response" : null, "message" : "Order status table are empty!"};
														callback(customerOrderErr, response);		
													}
												
										});							
								
							}
							else{
								response = {"status" : false, "response" : null, "message" : "Invalid Customer ID!"};
								callback(customerErr, response);
							}
					});
			}	
			else{
				response = {"status" : false, "response" : null, "message" : "No product found!"};
				callback(err, response);
			}

	});

};


//This is to get stateid by status
//Input : orderState, callback
//Output : sttus id
function getStateId(orderState, callback){

		db.OrderStatus.find({
			where : {"status" : orderState}
		}).complete(function(stateErr, stateRecord){
			
			if(stateErr)
				throw new Error("Error In retriving the state");

			if(stateRecord != undefined){
				callback(null, stateRecord.id);
			}					
			else{
				console.log("Orders state are empty please execute seed file");
				callback(stateErr, null);
			}
			
		});

}

//This method will reduce the product quantity
//Input : productId, quantity, callback
//Output : reduce the product quantity
function checkoutProductQuantity(productId, quantity, stateType, callback){
	
	var calculatedQuantity = null;
	
	db.Product.find({
		where : {"id" : productId}
	}).complete(function(err, productRecord){
		
		if(err)
			throw new Error("Error In Check out product quantity!");
		
		if(productRecord != undefined){

			if((parseInt(productRecord.quantity) >= parseInt(quantity)) && (parseInt(quantity) > 0)){
				
				
				//Crediting or debiting the product quantity
				if(stateType == "credit"){
					calculatedQuantity = parseInt(productRecord.quantity) + parseInt(quantity)
				}
				else{
					calculatedQuantity = parseInt(productRecord.quantity) - parseInt(quantity)
				}

				productRecord.updateAttributes({
					"quantity" : calculatedQuantity 
				}).complete(function(updateErr, updated){
				
					if(updateErr)
							throw new Error("Product Quantity updation failed");
					
					if(updated != undefined){

						console.log("PRODUCT QUANTITY REDUCED!!!");
						response = {status : true, response : updated, message : "Product quantity credited/debited!"};
						callback(null, response);					

					}
					else{

						response = {status : false, response : null, message : "Product quantity reduction failed!"};
						callback("Product quantity reduction failed!", response);						
					}

				});	
			}
			else{
				
				var message = (parseInt(quantity) > 0)?  ( (parseInt(productRecord.quantity) > 0)? "Only " + productRecord.quantity + " items available to purchase!" : "Product out of stock!" ) : "Quantity should not be greater than zero!";
				response = {"status" : false, "response" : null, "message" : message};
				callback(message, response);				
			}

		}
		else{
			response = {status : false, response : null, message : "Product not found!"};
			callback("Product not found!", response);

		}
	});

}

//This method will return customer orders by passing customer order id
//Input : customerOrderId, callback
//Output : callback orders
function getOrdersByCustomerOrderById(customerOrderId, callback){

	db.Order.findAll({
		where : {"CustomerOrderId" : customerOrderId}
	}).complete(function(totalOrdersErr, totalOrders){
		if(totalOrdersErr)
			throw new Error("Error occured retriving total orders");
		
		if(totalOrders != undefined){

			callback(null, totalOrders);

		}
		else{

			throw new Error("Total orders are empty!");
			callback("Orders are empty!", null);

		}
		
	});

}


//This method will delete the customer orders and the orders based on CustomerOrderId
//Input : customerOrderId, callback
//Output : callback deleted status
function deleteCustomerOrder(customerOrderId, callback){

	db.Order.find({
		where: {"CustomerOrderId" : customerOrderId}
	}).complete(function(isCustomerOrderPresentErr, isCustomerOrderPresent){	
		
		if(isCustomerOrderPresentErr)
			throw new Error("No record found to delete");
		
		if(isCustomerOrderPresent != undefined){
			
			db.Order.destroy({
				where: {"CustomerOrderId" : customerOrderId}
			}).complete(function(orderRecordErr, orderRecord){

				if(orderRecordErr)
					throw new Error("Error in deleting the customer order record");

				if(orderRecord != undefined){

					db.CustomerOrder.destroy({
						where: {"id" : customerOrderId}
					}).complete(function(customerRecordErr, customerRecord){
					
						if(customerRecordErr)
							throw new Error("Error in deleting the customer order record");

						if(customerRecord){

							response = {status : true, response : customerRecord, message : "Cutomer Record deleted successfully!"};
							callback(null, response);

						}
						else{

							response = {status : false, response : customerRecord, message : "No customer orders found to delete...1!"};
							callback("No customer orders found to delete...1!", response);

						}

					});

				}
				else{

					response = {status : false, response : customerRecord, message : "No orders found to delete...!"};
					callback("No orders found to delete...!", response);

				}

			});

		}
		else{

			response = {status : false, response : null, message : "No customer orders found to delete...2!"};
			callback(isCustomerOrderPresentErr, response);

		}

	});



}

//This method will return the status ids in an array
//Input : arrayData, callbacj
//Output : arrayIds
function getStatusIdsByArray(arrayData, callback){

	var stateIds = [];
	db.OrderStatus.findAll({
		where : { "status" : arrayData},
		attributes : ["id"]
	}).complete(function(err, records){
		

		console.log(records.length);

		async.each(records,

			function(item, callback){
					stateIds.push(item.values.id);
					callback();

			},

			function(err){

				if(!err){
					callback(null, stateIds);
				}
				else{
					throw new Error("Order status table is empty!");

					callback(err, null);
				}

			}
		);

	});
}


module.exports = OrderAPI;
