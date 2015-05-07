var db = require('../../../models');

//This method will initialize the Utility class
//Input : none
//Output : initialized
function Utils(){

	console.log("Initialize Utility Class");

};

//This method will save the current timezone received from the user
//Input : req,res, callback
//Output : returns the timezon record for the purticular user
Utils.prototype.saveTimeZone = function(req, res, callback) {
	
	// body...	
	console.log(req.body);
	//getting the data from the passport session
	var userId = req.user.id.toString();
	console.log("SESSION DATA :"+userId);

	db.TimeZone.find({ where : { "userId": userId }}).complete(function(err, record){

		if(record != undefined){

			var password;
			
			record.updateAttributes({"currentTimeZone" : req.body.currentTimeZone, "currenttimeZoneDiff" : req.body.currentTimeZoneDiff}).complete(function(err, updated){
				callback(null, updated);
			});

		}
		else{
			db.TimeZone.create({"currentTimeZone" : req.body.currentTimeZone, "currenttimeZoneDiff" : req.body.currentTimeZoneDiff, "userId" : userId}).complete(function(err, created){
				
				console.log("=====================");
				console.log(err);
				console.log(created.values);
				
				if(!err){
					callback(null, created);
				}
				else{
					throw new Error("Cannot Update the Timezone Record error...!");
					callback(err,"Update Record error...!")					
				}

			});

		}
		
	});

};

//This method will get the user's Timezone by userId
//Input : req,res, callback
//Output : returns the timezon record for the purticular user
Utils.prototype.getTimeZone = function(req, res, callback) {
	// body...
	
	var userId = req.user.id;
	console.log("=====================");
	console.log("userId : "+req.user.id);
	
	db.TimeZone.find({
		where: { 'userId' : userId.toString() }
	}).complete(function(err, searchedRecord){

		if(!err){		
			callback(null, searchedRecord);
		}
		else{
			// throw new Error("User Time zone is empty...!");
			console.log("User Time zone is empty...!");
			callback(null, null);
		}
	});

};

module.exports = Utils;