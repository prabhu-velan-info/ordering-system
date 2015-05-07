var bcrypt = require('bcrypt-nodejs');
var db = require('../../../models');

//This method will initialize the Customer class
//Input : none
//Output : initialized
function Customer(){

	console.log("Initialize Customer Class");

};

//This method will create a Customer user
//Input : req,res, callback
//Output : created response
Customer.prototype.createCustomer = function(req, res, callback) {
	
	console.log(req.body);
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var storeName = req.body.storeName;
	var address = req.body.address;
	var phone = req.body.phone;
	
	db.Customer.find({
	        where: { 'email': email }
	      }).complete(function(err, user) {

        if (err)
           callback(err);
       
        if (user) {      
        	console.log("Previous Record");
	    	console.log(user.values);
        	callback(null, {status : false, message : 'That email is already taken.'});
        } else {
        	var auth_token = generateHash(email + Date.now());
            db.Customer.create({'authentication_token' : auth_token, 'name' : name, 'email' : email, 'password': generateHash(password), 'storeName' : storeName, 'address' : address, 'phone' : phone }).success(function(record){                                            
                if(!record){
                    throw err;
                }
                else{
                    var newUser = record.values;
                    console.log("----New USER----");
                    console.log(newUser);
                    callback(null, {status : true, message : 'Customer created'});
                }            
            });
        }
	});

};

//This method will list all the customer users from db
//Input : req,res,
//Output : Customer list
Customer.prototype.listCustomer = function(req, res, callback) {
	// write operation to delete Customer...
	db.Customer.findAll().complete(function(err, users){
		
		if(!err){
			console.log("Number of Customer : " + users.length);
			callback(null, users);
		}
		else{
			throw new Error("No users found...!");
			callback(err, "No users found...!");
		}

	});
};

//This method will update the customer Data 
//Input : req,res,
//Output : response
Customer.prototype.editCustomer = function(req, res, callback) {
	// body...
	var id = req.params.id;
	console.log("RECEIVED Customer ID :" + id);
	console.log("______++++++++++++___________");
	console.log(req.body);
	db.Customer.find({ where : { "id": id }}).complete(function(err, record){
		if(record != undefined){

			var password;
			password = generateHash(req.body.password);
			record.updateAttributes({"name" : req.body.name, "email" : req.body.email, "password" : password, "storeName" : req.body.storeName, "address": req.body.address, "phone": req.body.phone}).complete(function(err, updated){
				callback(null, updated);
			});

		}
		else{
			throw new Error("Update Record error...!");
			callback(err,"Update Record error...!")
		}
	});

};


//This method will return  customer from the DB by id
//Input : req,res,
//Output : response
Customer.prototype.getCustomerById = function(req, res, callback) {
	var id = req.params.id;
	console.log("ID : "+id);
	db.Customer.find({
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

//This method will delete and Customer from the DB
//Input : req,res,
//Output : response
Customer.prototype.deleteCustomer = function(req, res, callback) {
	// write operation to delete Customer...
	console.log(req.body);
	var id = req.params.id;
	db.Customer.find({
		where:{'id':id}
	}).complete(function(err, record){
		if(record != undefined){
			record.destroy().complete(function(err, destroyed){
				
				if(err) throw new Error(error);
				callback(null, destroyed);

			});
		}
		else{
			throw new Error("No users found to delete...!");
			callback(err, "No users found to delete...!");
		}
	});

};

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

module.exports = Customer;