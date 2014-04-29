module.exports = function(app, passport,fs,lib) {

// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', isLoggedInIndex,function(req, res) {
		fs.readFile('./Public/dashboard.html',function (err, data) {
	      if (err) {
	        res.writeHead(500);
	        return res.end('Error loading index.html');
	      }

	      res.writeHead(200);
	      res.end(data);
		});
	});

	// PROFILE SECTION =========================
	app.get('/home', isLoggedIn, function(req, res) {
		fs.readFile('./public/dashboard.html',function (err, data) {
	      if (err) {
	        res.writeHead(500);
	        return res.end('Error loading index.html');
	      }

	      res.writeHead(200);
	      res.end(data);
		});
	});

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/download', isLoggedIn, function(req,res){
		res.set('Content-Type', 'application/note');
		res.send(JSON.stringify(lib.vars.objects[req.connection.remoteAddress]));
	});

	app.get('/tree',isLoggedIn,function(req,res){
		res.redirect('/treecreator')
	});

	app.get('/treecreator',isLoggedIn,function(req,res){
		fs.readFile('./Public/tree.html',function (err, data) {
	      if (err) {
	        res.writeHead(500);
	        return res.end('Error loading index.html');
	      }

	      res.writeHead(200);
	      res.end(data);
		});
	});

	app.post('/upload', isLoggedIn, function(req,res){
		fs.readFile(req.files.displayImage.path, function (err, data) {
			console.log("1 - ",data.toString('utf8').length," - s");
			if(data.toString('utf8').length){
				lib.vars.objects[req.connection.remoteAddress] = JSON.parse(data.toString('utf8'));
			}
			res.redirect('/home');
		})

	});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// locally --------------------------------
		// LOGIN ===============================
		// show the login form
		app.get('/login', function(req, res) {
			res.render('login.ejs', { message: req.flash('loginMessage') });
		});

		// process the login form
		app.post('/login', passport.authenticate('local-login', {
			successRedirect : '/home', // redirect to the secure profile section
			failureRedirect : '/login', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

		app.get('/signup', function(req, res) {
			res.render('signup.ejs', { message: req.flash('signupMessage') });
		});

		// process the signup form
		app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/home', // redirect to the secure profile section
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));
		
	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

		// handle the callback after facebook has authenticated the user
		app.get('/auth/facebook/callback',
			passport.authenticate('facebook', {
				successRedirect : '/home',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

		// handle the callback after twitter has authenticated the user
		app.get('/auth/twitter/callback',
			passport.authenticate('twitter', {
				successRedirect : '/home',
				failureRedirect : '/login'
			}));


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

		// the callback after google has authenticated the user
		app.get('/auth/google/callback',
			passport.authenticate('google', {
				successRedirect : '/home',
				failureRedirect : '/'
			}));


	// download --------------------------------

		app.get('/Download',isLoggedIn,function(req,res){
			res.download('./Public/tmp/test.txt')
		});



	// load resources ------------------------
	app.all('/JS/*',isLoggedIn,function(req,res) {
	    fs.readFile('./Public/'+ req.url,
		    function (err, data) {
		      if (err) {
		        res.writeHead(500);
		        return res.end('Error loading requested url');
		      }
		      res.writeHead(200);
		      res.end(data);
	    });
	});

	app.all('/img/*',isLoggedIn,function(req,res) {
	    fs.readFile('./Public/'+ req.url,
		    function (err, data) {
		      if (err) {
		        res.writeHead(500);
		        return res.end('Error loading requested url');
		      }
		      res.writeHead(200);
		      res.end(data);
	    });
	});
};



// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}

function isLoggedInIndex(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.render('index.ejs');
}
