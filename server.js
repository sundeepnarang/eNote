// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var parseCookie = require('connect').utils.parseCookie;
var fs       = require('fs');
var configDB = require('./config/database.js');
var cookie = require("cookie");
var connect = require("connect");
var lib = require('./javascripts/AppLib.js');   
var routesLib = require('./javascripts/routesLib.js');

var MemoryStore = express.session.MemoryStore,
    sessionStore = new MemoryStore();
// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

app.configure(function() {

	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

	app.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
	app.use(express.session({ store: sessionStore,secret: 'ilovescotchscotchy.scotchscotch' , key: 'express.sid'})); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session

});


// routes ======================================================================
require('./app/routes.js')(app, passport,fs,routesLib); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
server.listen(port);
console.log('The magic happens on port ' + port);

io.configure(function () {
    io.set('authorization', function (data, accept) {
	    if (data.headers.cookie) {
	        data.cookie = cookie.parse(data.headers.cookie);
	        //data.sessionID = data.cookie['express.sid'];
	        // save the session store to the data object 
	        // (as required by the Session constructor)
	        data.sessionStore = sessionStore;
	        
	        data.sessionID = connect.utils.parseSignedCookie(data.cookie['express.sid'],'ilovescotchscotchy.scotchscotch');
	        //console.log(".,sds;ks",connect.utils.parseSignedCookie,'\n',JSON.stringify(data),data,sessionStore.get);
	        sessionStore.get(data.sessionID, function (err, session) {
	        	//console.log(".,sds;ks",err, session);
	        	if(session){
	        		if(session.passport){
		        		if (err || !session.passport.user) {
		                	return accept('No user', false);
				        }
				        else{
				           	return accept(null,true);
				        }
				    }
				    else{
				    	return accept('No passport session.', false);
				    }
	        	}
	        	else{
	        		return accept('No session.', false);
	        	}
	            

	        });
	    }else {
	       return accept('No cookie transmitted.', false);
	    }
	});
});

io.set('log level', 1);
 
io.sockets.on('connection', function(socket) {
	console.log("Connected");
});
