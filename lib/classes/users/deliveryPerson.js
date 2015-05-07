var bcrypt = require('bcrypt-nodejs');
var db = require('../../../models');

//This method will initialize the DeliveryPerson class
//Input : none
//Output : initialized
function DeliveryPerson(){

	console.log("Initialize DeliveryPerson Class");

};

//This method will create a Delivery Person 
//Input : req,res, callback
//Output : created response
DeliveryPerson.prototype.createDeliveryPerson = function(req, res, callback) {
	
	console.log(req.body);
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var phone = req.body.phone;
	db.DeliveryPerson.find({
	        where: { 'email': email }
	      }).complete(function(err, user) {

        if (err)
           callback(err);
       
        if (user) {      
        	console.log("Previous Record");
	    	console.log(user.values);
        	callback(null, {status : false, message : 'That email is already taken.'});
        } else {

            db.DeliveryPerson.create({'name' : name, 'email' : email, 'password': generateHash(password), 'phone' : phone}).success(function(record){                                            
                if(!record){
                    throw err;
                }
                else{
                    var newUser = record.values;
                    console.log("----New USER----");
                    console.log(newUser);
                    callback(null, {status : true, message : 'Delivery Person created'});
                }            
            });
        }
	});

};

//This method will update the Delivery Person Data 
//Input : req,res,
//Output : response
DeliveryPerson.prototype.editDeliveryPerson = function(req, res, callback) {
	// body...
	console.log(req.body);
	var id = req.params.id;
	console.log("RECEIVED DeliveryPerson ID :" + id);
	db.DeliveryPerson.find({ where : { "id": id }}).complete(function(err, record){
		if(record != undefined){

			var password;			
			password = generateHash(req.body.password);			
			record.updateAttributes({"name" : req.body.name, "email" : req.body.email, "password" : password, "phone" : req.body.phone}).complete(function(err, updated){
				callback(null, updated);
			});

		}
		else{
			throw new Error("Update Record error...!");
			callback(err,"Update Record error...!")
		}
	});

};

//This method will delete and Delivery Person from the DB
//Input : req,res,
//Output : response
DeliveryPerson.prototype.deleteDeliveryPerson = function(req, res, callback) {
	// write operation to delete Delivery Person...
	console.log(req.body);
	var id = req.params.id;
	db.DeliveryPerson.find({
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

//This method will get Delivery Person from the DB by id
//Input : req,res,
//Output : response
DeliveryPerson.prototype.getDeliveryPersonById = function(req, res, callback) {
	var id = req.params.id;
	console.log("ID : "+id);
	db.DeliveryPerson.find({
		where: { 'id' : id }
	}).complete(function(err, searchedRecord){
		if(!err){		
			console.log("Searched Record");
			console.log(searchedRecord.values);	
			callback(null, searchedRecord);
		}
		else{
			throw new Error("No users found to edit...!");
			callback(err, "No users found to edit...!");
		}
	});

};

//This method will list all the search delivery person from db
//Input : req,res,
//Output : delivery person list
DeliveryPerson.prototype.searchDeliveryPerson = function(req, res, callback) {
	
	// write operation to delete DeliveryPerson...
	console.log("+++++++++++++++++")
	console.log(req.params);
	var searchText = req.params.search;

	var search = '%'+searchText+'%';
	db.DeliveryPerson.findAll({
		where : {"name" : { ilike : search}},
		attributes: ['id' , 'name'],
		limit: 6
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



//This method will list all the DeliveryPerson users from db
//Input : req,res,
//Output : DeliveryPerson list
DeliveryPerson.prototype.listDeliveryPerson = function(req, res, callback) {
	// write operation to delete DeliveryPerson...
	db.DeliveryPerson.findAll().complete(function(err, users){
		
		if(!err){
			console.log("Number of Delivery Person : " + users.length);
			callback(null, users);
		}
		else{
			throw new Error("No users found...!");
			callback(err, "No users found...!");
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

module.exports = DeliveryPerson;