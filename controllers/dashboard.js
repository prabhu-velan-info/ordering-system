var utilsClass = require("../lib/classes/utils/utils.js");
module.exports.controller = function(app, passport) {

	//This action will load the index page
	//Input : req,res
	//Output : renders index page
	app.get('/', isLoggedIn, function(req, res) {
  		res.render('index', { title: 'HOME' , user : req.user, message : ""});
	});

	//This action will load settings page
	//Input : req,res
	//Output : renders settings page
	app.get('/settings',isLoggedIn, function(req, res) {
  		res.render('dashboard/settings/settings.ejs', { title: 'Settings' , message : '', data : req.user});
	});

	//This action will load settings page
	//Input : req,res
	//Output : renders Timezones page
	app.get('/timeZone', isLoggedIn, function(req, res) {
		
		var Utils = new utilsClass();
		Utils.getTimeZone(req, res, function(err, response){			
			if(!err){
				res.render('dashboard/settings/timeZones.ejs', { title: 'Timezones settings' , message : '', data : response});
			}
			else{
				res.render('dashboard/settings/timeZones.ejs', { title: 'Timezones settings' , message : '', data : null});
			}
		
		}); 
  		
	});

	//This action will loads timezone
	//Input : req,res
	//Output : sends current timezone
	app.post('/getTimeZone', function(req, res) {
		
		var Utils = new utilsClass();
		Utils.getTimeZone(req, res, function(err, response){			
			
			if(!err){
				res.send({ data : response});
			}
			else{
				res.send({ data : null });
			}
		
		}); 
  		
	});

	//This action will Save the user timezone
	//Input : req,res
	//Output : sends saved response
	app.post('/saveTimeZone', function(req, res) {

  		var Utils = new utilsClass();

		Utils.saveTimeZone(req, res, function(err, response){
			
			if(!err){
				console.log("rendering the edit page...!");
				res.send({status :true, message : "Timezone Updated!"});
			}
			else{
				res.send({status :false, message : "Timezone updation failed!"});
			}
		
		}); 

	});
	
};

//This action will check user is present in session or not
//Input : req,res
//Output : login page or next();
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
}


