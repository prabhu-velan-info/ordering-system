var adminClass = require("../lib/classes/users/admin.js");
module.exports.controller = function(app, passport) {

	//This action will load the Add Admin page
	//Input : req,res
	//Output : renders creatAdmin page
	app.get('/addAdmin',isLoggedIn,  function(req, res) {
  		res.render('dashboard/admin/addAdmin.ejs', { title: 'Add Admin Page' , message : ''});
	});

	//This action will create an Admin
	//Input : req,res
	//Output : sends created Response
	app.post('/addAdmin', function(req, res) {
		
		var Admin = new adminClass();
		Admin.createAdmin(req, res,function(err, response){
			if(!err){
				res.send({status : response.status, message : response.message});
			}
			else{
				res.send({status : response.status, message : response.message});
			}			
		});  		
  		
	});

	//This action will edit The previous Admin detail
	//Input : req,res
	//Output : renders editAdmin page
	app.get('/editAdmin/:id', isLoggedIn, function(req, res){
		console.log(req.params);
		var Admin = new adminClass();
		Admin.getAdminById(req, res,function(err, response){
			
			if(!err){
				console.log("rendering the edit page...!");
				res.render('dashboard/admin/editAdmin.ejs', { title: 'Edit Admin Page' , data : response, message : ''});
			}
			else{
				res.render('dashboard/admin/editAdmin.ejs', { title: 'Edit Admin Page' , data : "", message : ''});
			}
		
		}); 
	});

	var messageContent = "";
	//This action update the edited fileds of the selected Admin
	//Input : req,res
	//Output : renders listAdmin page
	app.post('/editAdmin/:id', function(req, res){
		console.log(req.params);
		var Admin = new adminClass();
		
		Admin.editAdmin(req, res,function(err, response){
	
			if(!err){
				messageContent = "Admin data Updated!";			
				res.redirect("/listAdmin");	
			}
			else{
				console.log("Error occured : " + err);
			}
	
		}); 
	});
	
	//This action will render list Admin 
	//Input : req,res
	//Output : renders listAdmin page
	app.get('/listAdmin', isLoggedIn, function(req, res) {
		if(messageContent != null){
			var status = messageContent;
			messageContent = "";
		}
  		res.render('dashboard/admin/listAdmin.ejs', { title: 'Admin lists' , message : status});
	});

	//This action will return list of Admin 
	//Input : req,res
	//Output : send listAdmin response
	app.post('/listAdmin', function(req, res) {
		
		var Admin = new adminClass();
		Admin.listAdmin(req, res,function(err, response){
			
			if(!err){
				res.send({"status" : true, "response" : response, message : ""});		
			}
			else{
				res.send({"status" : false, "response" : null, message : response});	
			}
			

		});  	

	});

	//This action will delete an admin based on the result 
	//Input : req,res
	//Output : send listAdmin response
	app.get('/deleteAdmin/:id', isLoggedIn, function(req, res) {
		
		var Admin = new adminClass();
		Admin.deleteAdmin(req, res,function(err, response){			
			
			if(!err){
				messageContent = "Admin data Deleted!";
				res.redirect("/listAdmin");						
			}
			else{
				console.log("Error occured : " + err);
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


