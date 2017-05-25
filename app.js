var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var coachDashboard = require('./routes/coachDashboard');
var users = require('./routes/users');
var login = require('./routes/login');
var workoutManager = require('./routes/workoutManager');
var workoutView = require('./routes/workoutView');
var playerData = require('./routes/playerData');

var session = require('client-sessions');

var app = express();
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'footballdb.cr1jtswtem4i.us-west-2.rds.amazonaws.com',
    user     : 'masterUsername',
    password : 'HNuxJSEjqXUS!auk-eRV6CG8+!^JJAt2M?-Lc4y#+',
    database : 'master'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/login', login);
app.use('/attemptLogin', login);
app.use('/viewWorkout', workoutView);
app.use('/workoutManager', workoutManager);
app.use('/playerData', playerData);



// Starts a session for the user.
app.use(session({
    cookieName: 'session',
    secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    secure: true,
    ephemeral: true
}));

// Checks to see if the user is already in a session. If so, update the req to have that session data and pass it along.
app.use(function(req, res, next) {
    if (req.session && req.session.user) {
        var sql = "SELECT username FROM testUser WHERE username= " + "'" + req.session.user + "'";

        connection.query(sql, function (err, result) {
            if (err) throw err;

            if (result.length !== 0) {
                req.user = result[0].username;
                req.session.user = result[0].username;  //refresh the session value
                res.locals.user = result[0].username;
            }
            next();
        });
    } else {
        next();
    }
});

/* GET home page. */
app.get('/', requireLogin, function(req, res, next) {
    res.render('coachDashboard', { username: req.session.user });
});

/* GET home page. */
app.get('/viewWorkout', function(req, res, next) {
    res.render('workoutView', { title: 'Workout View' });
});

/* Workout Manager page */
app.get('/workoutManager', requireLogin, function(req, res, next) {
    res.render('workoutManager', { username: req.session.user });
});

/* Player Data page */
app.get('/playerData', requireLogin, function(req, res, next) {
    var sql = "SELECT DISTINCT username FROM player_workouts";

    var allPlayerData = [];
    connection.query(sql, function (err, result) {
        if (err) throw err;
        allPlayerData = result;

        res.render('playerData', {
            username: req.session.user,
            allPlayerData: allPlayerData
        });
    });
});

// GET login page //
app.get('/login', function(req, res, next) {
    res.render('login', {message: '' , errormessage: ''});
});

// Attempts to login a user. If successful, sets the session so the user can access the data.
app.post('/attemptLogin', function(req, res) {
    var sql = "SELECT username, password FROM user WHERE username= " + "'" + req.body.username + "'";

    connection.query(sql, function (err, result) {
        if (err) throw err;

        if (result.length !== 0 && result[0].password === req.body.password) {
            req.session.user = req.body.username;
            res.render('coachDashboard', { username: req.session.user});
        } else {
            res.render('login', { message: 'Failed', errormessage: '' });
        }
    });
});

// Forces a user to login before proceeding
function requireLogin (req, res, next) {
    if (!req.user) {
        res.redirect('/login');
    } else {
        next();
    }
}

// logs a user out.
app.get('/logout', function(req, res) {
    req.session.reset();
    res.redirect('/');
});


app.post('/register', function(req,res){


    var phone = "";
    var num = "1234567890";
    for(var i=0; i < req.body.telephone.length; i++){
        if(num.includes(req.body.telephone.charAt(i))){
            phone += req.body.telephone.charAt(i);
        }
    }

    var sql = "INSERT INTO user VALUES('" + req.body.username + "' , '" + req.body.password + "' , '" + req.body.role + "' , '"
        + req.body.firstname + "' , '" + req.body.lastname + "' , '" + phone + "' , '" + req.body.position + "')";


    if (req.body.password !== req.body.confirm_password){
        res.render('login', {message: '', errormessage: 'Passwords do not match.'});
    }


    if (phone.length !== 10){
        res.render('login', {message: '', errormessage: 'Please enter a valid phone number.'});
    }

    if (req.body.role === "Coach" && req.body.access_code !== "ISUcoach"){
        res.render('login', {message: '', errormessage: 'Please enter a valid access code.'});
    }

    if (req.body.role === "Player" && req.body.access_code !== "Cyclone"){
        res.render('login', {message: '', errormessage: 'Please enter a valid access code.'});
    }



    else{
    connection.query(sql, function(err,result){
        if (err) throw err;

        else{

        }
    });}
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
