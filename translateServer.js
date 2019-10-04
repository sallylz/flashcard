const express = require('express')
const APIrequest = require('request');
const GoogleStrategy = require('passport-google-oauth20');
const passport = require('passport');
const cookieSession = require('cookie-session');
const port = 51066 // you need to put your port number here
const APIkey = "AIzaSyANhTJwNrxidXuCHPCtmGwlBRWGfna-uxs";  // ADD API KEY HERE
const url = "https://translation.googleapis.com/language/translate/v2?key=" + APIkey;
//
const sqlite3 = require("sqlite3").verbose();  // use sqlite
const fs = require("fs"); // file system
const dbFileName = "Flashcards.db";
// makes the object that represents the database in our code
const db = new sqlite3.Database(dbFileName);  // object, not database.
let ch = undefined; // save translated word

// Google login credentials, used when the user contacts
// Google, to tell them where he is trying to login to, and show
// that this domain is registered for this service. 
// Google will respond with a key we can use to retrieve profile
// information, packed into a redirect response that redirects to
// server162.site:[port]/auth/redirect
const googleLoginData = {
    clientID: '516713633727-e4v6lsp2ripl5n6ol4qokg50ju7eq915.apps.googleusercontent.com',
    clientSecret: 'lZCthdRlhYa5dEQmvdstHq8p',
    callbackURL: '/auth/redirect'
};

function queryHandler(req, res, next) {
    //let url = req.url;
    let qObj = req.query;
    if (qObj.str != undefined) {
	console.log("entered");
    	// An object containing the data expressing the query to the
    	// translate API. 
    	// Below, gets stringified and put into the body of an HTTP PUT request.
       let requestObject =
    	   {
              "source": "en",
              "target": "zh-CN",
              "q": [qObj.str]
           };
       console.log("English phrase: ", qObj.str);
       // The call that makes a request to the API
       // Uses the Node request module, which packs up and sends off
       // an HTTP message containing the request to the API server
       APIrequest(
          { // HTTP header stuff
             url: url,
             method: "POST",
             headers: { "content-type": "application/json" },
             // will turn the given object into JSON
             json: requestObject
          },
          // callback function for API request
          APIcallback
       );
       
       // callback function, called when data is received from API
       function APIcallback(err, APIresHead, APIresBody) {

          // gets three objects as input
          if ((err) || (APIresHead.statusCode != 200)) {
             // API is not working
             console.log("Got API error");
             console.log(APIresBody);
          } else {
             if (APIresHead.error) {
                // API worked but is not giving you data
                console.log(APIresHead.error);
             } else {
                ch = APIresBody.data.translations[0].translatedText;
                res.json({ "English" : qObj.str, "Chinese" : APIresBody.data.translations[0].translatedText});
		console.log("In Chinese: ",
                   APIresBody.data.translations[0].translatedText);
                console.log("\n\nJSON was:");
                console.log(JSON.stringify(APIresBody, undefined, 2));
                // print it out as a string, nicely formatted
             }
          }  
       } // end callback function
    } else {
        next();
    }
}
//passport.saveCard((userData, done) => {
    
  //  done(null, userData);
//})
function saveFlashcard(req, res, next) {
    let qObj = req.query;
    if (qObj.str != undefined && ch != undefined) {
        // save into database--------------------------------------------------------------------------------
        let eng = qObj.str;
        console.log("inside saveFlashcard googleID --->>> ", req.user);
        console.log("display array ------------->>>>>>>>>>>>>> ", req.user.array);
        const cmdStr = 'INSERT into Flashcards (user, english, chinese, seen, correct) VALUES (@0, @1, @2, 0, 0)';
        db.run(cmdStr, req.user.googleID, eng, ch, insertCallback);
        function insertCallback(err){
            if(err){
                console.log("Insert error -> ", err);
                res.json("NOT saved - something went wrong.");
            } else {
                console.log("Inserted correctly");
                ch = undefined;
                res.json("Flashcard saved");
            }    	   
        }
    } else {
        next();
    }
}

function getWords(req, res, next) {//ORDER BY seen DESC
    const cmdGetWord = 'SELECT english,chinese FROM Flashcards  WHERE user = "'+ req.user.googleID +'" ORDER BY seen ASC';
    db.all(cmdGetWord , function (err, vocabulary){
	if (err){
		console.log("error!",err);
	}
	else{
		console.log("chinese --->>>>>>>>>>>>>>>>", vocabulary);
		res.json({ "english" :vocabulary[0].english , "chinese" :vocabulary[0].chinese});
		cmdUpdateSeen = 'UPDATE Flashcards SET seen = seen+1 WHERE english =  "'+ vocabulary[0].english+ '" ' ;
		db.all(cmdUpdateSeen,function(err){
			if(err){
				console.log(err);
			}
			else{
				console.log("Run!!");
			}
		});
	}
    })
    //req.user.array 
}
function loadPage(req, res, next) {
	console.log ("load",req.user);
	if (req.user.array === undefined || req.user.array.length == 0){
		res.json({ "username" : req.user.username, "review": 0 });
	} 
	else{
		console.log ("loadvocab");
		res.json({ "username" : req.user.username, "review": 1 });
	}
}



function fileNotFound(req, res) {
    let url = req.url;
    res.type('text/plain');
    res.status(404);
    res.send('Cannot find ' + url);
}


// Strategy configuration. 
// Tell passport we will be using login with Google, and
// give it our data for registering us with Google.
// The gotProfile callback is for the server's HTTPS request
// to Google for the user's profile information.
// It will get used much later in the pipeline. 
passport.use( new GoogleStrategy(googleLoginData, gotProfile) );
// put together the server pipeline
const app = express()
// pipeline stage that just echos url, for debugging
//app.use('/', printURL);

// Check validity of cookies at the beginning of pipeline
// Will get cookies out of request, decrypt and check if 
// session is still going on. 
app.use(cookieSession({
    maxAge: 6 * 60 * 60 * 1000, // Six hours in milliseconds
    // meaningless random string used by encryption
    keys: ['hanger waldo mercy dance']  
}));
// Initializes request object for further handling by passport
app.use(passport.initialize()); 

// If there is a valid cookie, will call deserializeUser()
app.use(passport.session()); 

app.get('/*',express.static('public'));
app.get('/user/translate', queryHandler);   // if not, is it a valid query?
app.get('/user/save', saveFlashcard);
app.get('/user/getWord', getWords);
app.get('/user/loadPage', loadPage );
// app.use(fileNotFound);            // otherwise not found


//  app.use(express.static('public'));  // can I find a static file? 
// next, handler for url that starts login with Google.
// The app (in public/login.html) redirects to here (not an AJAX request!)
// Kicks off login process by telling Browser to redirect to
// Google. The object { scope: ['profile'] } says to ask Google
// for their user profile information.
app.get('/auth/google',
	passport.authenticate('google',{ scope: ['profile'] }) );
// passport.authenticate sends off the 302 response
// with fancy redirect URL containing request for profile, and
// client ID string to identify this app. 

// Google redirects here after user successfully logs in
// This route has three handler functions, one run after the other. 
app.get('/auth/redirect',
	// for educational purposes
	function (req, res, next) {
	    console.log("at auth/redirect");
	    next();
	},
	// This will issue Server's own HTTPS request to Google
	// to access the user's profile information with the 
	// temporary key we got in the request. 
	passport.authenticate('google'),
	// then it will run the "gotProfile" callback function,
	// set up the cookie, call serialize, whose "done" 
	// will come back here to send back the response
	// ...with a cookie in it for the Browser! 
	function (req, res) {
	    console.log('Logged in and using cookies!')
	    res.redirect('/user/translate.html');
	});

// static files in /user are only available after login
app.get('/user/*',
	isAuthenticated, // only pass on to following function if
	// user is logged in 
	// serving files that start with /user from here gets them from ./
	express.static('.') 
       ); 

// next, all queries (like translate or store or get...
app.get('/query', function (req, res) { res.send('HTTP query!') });

// finally, not found...applies to everything
app.use( fileNotFound );

// Pipeline is ready. Start listening!  
//app.listen(port, function (){console.log('Listening...');} );


// middleware functions

// print the url of incoming HTTP request
function printURL (req, res, next) {
    console.log(req.url);
    next();
}

// function to check whether user is logged when trying to access
// personal data
function isAuthenticated(req, res, next) {
    if (req.user) {
	console.log("Req.session:",req.session);
	console.log("Req.user:",req.user);
	next();
    } else {
	res.redirect('/login.html');  // send response telling
	// Browser to go to login page
    }
}


// function for end of server pipeline
//function fileNotFound(req, res) {
    //let url = req.url;
   // res.type('text/plain');
   // res.status(404);
    //res.send('Cannot find '+url);
  //  }

// Some functions Passport calls, that we can use to specialize.
// This is where we get to write our own code, not just boilerplate. 
// The callback "done" at the end of each one resumes Passport's
// internal process. 

// function called during login, the second time passport.authenticate
// is called (in /auth/redirect/),
// once we actually have the profile data from Google. 
function gotProfile(accessToken, refreshToken, profile, done) {
    console.log("Google profile --->>> ",profile);
    console.log("username --->>> ", profile.name.familyName);
    console.log("lastname --->>> ", profile.name.givenName);
    console.log("google id --->>> ", profile.id);
/*
    const checkUser = 'SELECT EXISTS(SELECT * FROM Users WHERE googleID = '+ profile.id +')';
    console.log("checkUser --->>>", checkUser);

    db.run(checkUser, function userCheckCallback(err){
    
        if(err){
            console.log("Check error -> ", err);
        } else {
            console.log("Checked correctly");
        }
});*/
/*
    function userCheckCallback(err,value){
        if(err){
            console.log("Check error -> ", err);
        } else {
            console.log("Checked correctly");
            console.log("value--->>> ", value);
        }
    }*/    	   
    const checkUser = 'SELECT EXISTS (SELECT 1 FROM Users WHERE googleID = "'+ profile.id +'")';
    //const checkUser = 'SELECT 1 FROM Users WHERE googleID = '+ profile.id;
    db.get(checkUser, (err,row) => {
    if(err) {
        return console.error(err.message);    
    } 
    if(row) {
       // console.log("row user exist --->>> ", row.[0]);
       // let userData = {
          //  googleID: profile.id,
        //    username: profile.name.givenName
        //}       
       // console.log("User is already in the table");
       // done(null, userData); 
    //} else {     
        //console.log("row new user--->>> ", row);
        //console.log("NOT in the table - create new use!");
        const insertUser = 'INSERT OR IGNORE INTO Users (`googleID`,`username`, `lastname`) VALUES (@0, @1, @2)';
        db.run(insertUser, profile.id, profile.name.familyName, profile.name.givenName, userInsertCallback);
        function userInsertCallback(err){
            if(err){
                console.log("Insert error -> ", err);
            } else {
                console.log("Inserted correctly");
            }    	   
        }
       const cardSearchCmd = 'SELECT * FROM Flashcards WHERE user = "'+ profile.id +'"';
   	// console.log("db.all-----------------------------------------", cardSearchCmd);
    	db.all(cardSearchCmd, function (err, row){
        console.log("array --->>>>>>>>>>>>>>>>",row);
        let userData = {
            googleID: profile.id,
            username: profile.name.givenName,
            array: row
        }
	done(null, userData); 
    })

        
    }
    });

    /*const insertUser = 'INSERT OR IGNORE INTO Users (`googleID`,`username`, `lastname`) VALUES (@0, @1, @2)';
    db.run(insertUser, profile.id, profile.name.familyName, profile.name.givenName, userInsertCallback);
    function userInsertCallback(err){
        if(err){
            console.log("Insert error -> ", err);
        } else {
            console.log("Inserted correctly");
        }    	   
    }*/


    // here is a good place to check if user is in DB,
    // and to store him in DB if not already there. 
    // Second arg to "done" will be passed into serializeUser,
    // should be key to get user out of database.


  /*  let userData = {
        googleID: profile.id,
        username: profile.name.givenName
    }*/


    // temporary! Should be the real unique
    // key for db Row for this user in DB table.
    // Note: cannot be zero, has to be something that evaluates to
    // True.  

    /*done(null, userData);*/ 
}

// Part of Server's sesssion set-up.  
// The second operand of "done" becomes the input to deserializeUser
// on every subsequent HTTP request with this session's cookie. 
passport.serializeUser((userData, done) => {
    console.log("SerializeUser. Input is",userData);
    //const cardSearchCmd = "SELECT english, chinese FROM Flashcards WHERE '"+userData.googleID+"'";
    const cardSearchCmd = 'SELECT * FROM Flashcards WHERE user = "'+ userData.googleID +'"';
   // console.log("db.all-----------------------------------------", cardSearchCmd);
    db.all(cardSearchCmd, function (err, row){
        console.log("array --->>>>>>>>>>>>>>>>",row);
        userData = {
            googleID: userData.googleID,
            username: userData.username,
            array: row
        }
    })
    done(null, userData);
});

// Called by passport.session pipeline stage on every HTTP request with
// a current session cookie. 
// Where we should lookup user database info. 
// Whatever we pass in the "done" callback becomes req.user
// and can be used by subsequent middleware.
passport.deserializeUser((userData, done) => {



    console.log("deserializeUser. Input is:", userData);
    // here is a good place to look up user data in database using
    // dbRowID. Put whatever you want into an object. It ends up
    // as the property "user" of the "req" object. 
    
    const cardSearchCmd = 'SELECT * FROM Flashcards WHERE user = "'+ userData.googleID +'"';
   // console.log("db.all-----------------------------------------", cardSearchCmd);
    db.all(cardSearchCmd, function (err, row){
        console.log("array --->>>>>>>>>>>>>>>>",row);
        userData = {
            googleID: userData.googleID,
            username: userData.username,
            array: row
        }
    })

    //let userInfo = {userInfo: "data from db row goes here"};
    done(null, userData);
});

app.listen(port, function () { console.log('Listening...'); })
