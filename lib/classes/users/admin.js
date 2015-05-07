var bcrypt = require('bcrypt-nodejs');
var db = require('../../../models');

//This method will initialize the User class
//Input : none
//Output : initialized
function Admin(){

	console.log("Initialize Admin Class");

};

//This method will create a admin user
//Input : req,res, callback
//Output : created response
Admin.prototype.createAdmin = function(req, res, callback) {
	
	console.log(req.body);
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	db.Admin.find({
	        where: { 'email': email }
	      }).complete(function(err, user) {

        if (err)
           callback(err);
       
        if (user) {      
        	console.log("Previous Record");
	    	console.log(user.values);
	    	response = {status : false, message : 'That email is already taken.'};
        	callback(null, response);
        } else {

            db.Admin.create({'name' : name, 'email' : email, 'password': generateHash(password)}).success(function(record){                                            
                if(!record){
                    throw err;
                }
                else{
                    var newUser = record.values;
                    console.log("----New USER----");
                    console.log(newUser);
                    response = {status : true, message : 'Admin created'};
                    callback(null, response);
                }            
            });
        }
	});

};

//This method will update the admin Data 
//Input : req,res,
//Output : response
Admin.prototype.editAdmin = function(req, res, callback) {
	// body...
	var id = req.params.id;
	console.log("RECEIVED ADMIN ID :" + id);

	db.Admin.find({ where : { "id": id }}).complete(function(err, record){
		if(record != undefined){

			var password;
			password = generateHash(req.body.password);
			record.updateAttributes({"name" : req.body.name, "email" : req.body.email, "password" : password}).complete(function(err, updated){
				callback(null, updated);
			});

		}
		else{
			throw new Error("Update Record error...!");
			callback(err,"Update Record error...!")
		}
	});

};

//This method will delete and admin from the DB
//Input : req,res,
//Output : response
Admin.prototype.deleteAdmin = function(req, res, callback) {
	// write operation to delete Admin...
	console.log(req.body);
	var id = req.params.id;
	db.Admin.find({
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

//This method will return admin by id
//Input : req,res,
//Output : response
Admin.prototype.getAdminById = function(req, res, callback) {
	var id = req.params.id;
	console.log("ID : "+id);
	db.Admin.find({
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


//This method will list all the admin users from db
//Input : req,res,
//Output : admin list
Admin.prototype.listAdmin = function(req, res, callback) {
	// write operation to delete Admin...
	db.Admin.findAll().complete(function(err, users){
		
		if(!err){
			console.log("Number of Admins : " + users.length);
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

module.exports = Admin;