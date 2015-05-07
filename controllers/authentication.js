module.exports.controller = function(app, passport) {
	
	//This action will opens the login form
	//Input : req,res
	//Output : renders login page
	app.get('/login', function(req, res) {
		res.render('users/login.ejs', { title: 'Internal Application' , message: req.flash('loginMessage') });
	});

	//This action will handle admin authentication
	//Input : req,res
	//Output : dashboard or login page
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	//This action will opens signup page
	//Input : req,res
	//Output : signup page
	app.get('/signup', function(req, res) {
		res.render('users/signup.ejs', { message: req.flash('signupMessage') });
	});

	//This action will handle signup action
	//Input : req,res
	//Output : profile or signup page
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	//This action will opens the profile page
	//Input : req,res
	//Output : profile
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('users/profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	//This action perform logout event
	//Input : req,res
	//Output : login page
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/login');
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


