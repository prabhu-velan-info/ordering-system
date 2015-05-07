var bcrypt = require('bcrypt-nodejs');
var db = require('../../../models');

//This method will initialize the Customer API class
//Input : none
//Output : initialized
function CustomerAPI(){

	console.log("Initialize Customer API Class");

};

//This method will create a Customer user
//Input : req,res, callback
//Output : created response
CustomerAPI.prototype.customerSignup = function(req, res, callback) {
	
	console.log(req.body);

	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var storeName = req.body.storeName;
	var address = req.body.address;
	var phone = req.body.phone;
	var latitude = req.body.lat;
	var longtitude = req.body.long;
	var deviceToken = req.body.deviceToken;

	db.Customer.find({
	        where: { 'email': email }
	      }).complete(function(err, user) {

        if (err)
           callback(err);
       
        if (user) {      

        	console.log("Previous Record");
	    	console.log(user.values);
        	callback(null, {"status" : false,  "response" : null, "message" : 'That email is already taken.'});

        } else {

        	var auth_token = generateHash(email + Date.now());
            db.Customer.create({'authentication_token' : auth_token, 'name' : name, 'email' : email, 'password': generateHash(password), 'storeName' : storeName, 'address' : address, 'phone' : phone, "GPSLat" : latitude, "GPSLong" : longtitude}).success(function(record){                                            
                if(!record){
                    throw err;
                }
                else{
                    var newUser = record.values;
                    console.log("----New USER----");
                    console.log(newUser);

                    addOrUpdateDeviceToken(record.id, deviceToken, function(updateStateErr, updateState){
                    	if(updateState){
                    		callback(null, {"status" : true, "response" : record, "message" : 'Customer created successfully'});
                    	}
                    	else{
                    		callback(null, {"status" : true, "response" : null, "message" : 'Device Token updation failed!'});	
                    	}
                    });
                    
                }            
            });
        }
	});

};

//This method will perform an authentication
//Input : req,res, callback
//Output : authenticated response
CustomerAPI.prototype.customerSignIn = function(req, res, callback) {
	
	// body...
	var email = req.body.email;
	var password = req.body.password;
	var deviceToken = req.body.deviceToken;

	db.Customer.find({
		where : {"email" : email}
	}).complete(function(customerRecordErr, customerRecord){
		if(customerRecordErr)
				throw new Error("Error in access Customer Table");

		if(!customerRecord){
			var response = {"status" : false, "response" : null, "message" : "No Customer found!"};
			callback(customerRecordErr, response);
		}
		else{
			if(!validPassword(password, customerRecord.password)){
				var response = {"status" : false, "response" : null, "message" : "Oops! Wrong password!"};
				callback(customerRecordErr, response);
			}
			else{

				//updating the device token
				addOrUpdateDeviceToken(customerRecord.id, deviceToken, function(updateStateErr, updateState){
                	if(updateState){
                		callback(null, {"status" : true, "response" : customerRecord, "message" : 'Customer LoggedIn successfully'});
                	}
                	else{
                		callback(null, {"status" : true, "response" : null, "message" : 'Device Token updation failed!'});	
                	}
                });

			}
		}
	})
};

//This method will perform an authentication
//Input : req,res, callback
//Output : authenticated response
CustomerAPI.prototype.customerLogout = function(req, res, callback) {
	
	// body...
	var authentication_token = req.body.authentication_token;
	
	db.Customer.find({
		where : {"authentication_token" : authentication_token},
	}).complete(function(customerRecordErr, customerRecord){
		if(customerRecordErr)
				throw new Error("Error in access Customer Table");

		if(!customerRecord){
			var response = {"status" : false, "response" : null, "message" : "No Customer found!"};
			callback(customerRecordErr, response);
		}
		else{
			
			db.CustomerDevice.destroy({
				where : {"CustomerId" : customerRecord.id},
				limit:1, 
				order:'"updatedAt" DESC',
			}).complete(function(deletedErr, deleted){

				if(deleted != undefined){
					var response = {"status" : true, "response" : deleted, "message" : "Logout success"};
					callback(deletedErr, response);
				}
				else{
					var response = {"status" : false, "response" : null, "message" : "Destroy device token failed!"};
					callback(deletedErr, response);
				}

			});

		}
	})
};




//This method will update the customer data based on customer id
//Input : req,res, callback
//Output : updated response
CustomerAPI.prototype.updateCustomer = function(req, res, callback) {
	
	// body...
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var storeName = req.body.storeName;
	var address = req.body.address;
	var phone = req.body.phone;
	var latitude = req.body.lat;
	var longtitude = req.body.long;
	var deviceToken = req.body.deviceToken;
	
	db.Customer.find({
		where : {"email" : email}
	}).complete(function(customerRecordErr, customerRecord){
		if(customerRecordErr)
				throw new Error("Error in access Customer Table");

		if(!customerRecord){
			var response = {"status" : false, "response" : null, "message" : "No Customer found!"};
			callback(customerRecordErr, response);
		}
		else{

			customerRecord.updateAttributes({'name' : name, 'email' : email, 'password': generateHash(password), 'storeName' : storeName, 'address' : address, 'phone' : phone, "GPSLat" : latitude, "GPSLong" : longtitude}).success(function(record){                                            
				
				if(!record){
					throw err;
				}
				else{									
					callback(null, {"status" : true, "response" : record, "message" : 'Customer updated successfully'});
				}            

			});
		}
	})
};

//This method will update or create CustomerDevice token record
//Input : customerId, deviceToken, callback
//Output : true or false
var addOrUpdateDeviceToken = function(customerId, deviceToken, callback){

    getDeviceTypeId("android", function(deviceTypeIdErr, deviceTypeId){
    	
    	if(deviceTypeIdErr)
    		throw new Error("Error accessing Device Type IDs");
    		
    	if(!deviceTypeIdErr){
    		
    		db.CustomerDevice.find({
    			where : {"CustomerId" : customerId, "deviceToken" : deviceToken}
    		}).complete(function(err, record){
    			
    			if(err)
    				throw new Error("Error accessing Customer Device Records");
    			
    			if(record != undefined){
    				console.log("device Token already present!");
    				callback(null, true);
    			}
    			else{

    				console.log("Creating Device Token record!");
		    		db.CustomerDevice.create({
		    			"deviceToken" : deviceToken,
		    			"CustomerId" : customerId,
		    			"DeviceTypeId" : deviceTypeId
		    		}).complete(function(deviceTokenCreatedErr, deviceTokenCreated){
		    			if(deviceTokenCreatedErr)
		    				new Error("Error in registering new Device Token");

		    			if(deviceTokenCreated != undefined){
		    				callback(null, true);
		    			}
		    			else{
		    				callback(null, false);
		    			}

		    		});    				

    			}
    		});

    	}
    	else{
    		console.log("Device Types are Empty please run the seed file!");
    		callback(null, false);
    	}
    });

}

//Purpose : The function is to get Device Id based on device typd
//Input   : type, callback
//Output   : deviceId
var getDeviceTypeId = function(type, callback){
	
	db.DeviceType.find({
		"type" : type
	}).complete(function(err, record){
		if(err)
			throw new Error("Error in finding the deviceToken ID");
		if(record != undefined){
			callback(null, record.id);
		}
		else{
			callback("Error in accessing Device Token id",null);
		}
	});
}

//Purpose : The function is to convert the user password to hash
//Input   : password
//Output   : passwordHash
var generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//Purpose : The function is used to compare the users password with the paswordHash
//Input   : password
//Output  : true or false
var validPassword = function(password, encryptedPassword) {
	return bcrypt.compareSync(password, encryptedPassword);
};
module.exports = CustomerAPI;