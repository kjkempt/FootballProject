var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



var coachDashboard = require('./routes/coachDashboard');
var playerDashboard = require('./routes/playerDashboard');
var users = require('./routes/users');
var login = require('./routes/login');
var workoutManager = require('./routes/workoutManager');
var playerData = require('./routes/playerData');
var playerDashboard = require('./routes/playerDashboard');
var teamData = require('./routes/teamData');
var weeklySummary = require('./routes/weeklySummary');
var updateWorkout = require('./routes/updateWorkout');
var adminHome = require('./routes/adminHome');
var adminDailySummary = require('./routes/adminDailySummary');
var coachDailySummary = require('./routes/coachDailySummary');
var coachHome = require('./routes/coachHome');
var coachRecentData = require('./routes/coachRecentData');




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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

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
        var sql = "SELECT username FROM user WHERE username= " + "'" + req.session.user + "'";

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

app.use('/login', login);
app.use('/attemptLogin', login);
app.use('/workoutManager', workoutManager);
app.use('/coachDashboard', coachDashboard);
app.use('/playerDashboard', playerDashboard);
app.use('/playerData', playerData);
app.use('/workoutManager', workoutManager);
app.use('/playerInput', playerDashboard);
app.use('/teamData', teamData);
app.use('/weeklySummary', weeklySummary);
app.use('/updateWorkout', updateWorkout);
app.use('/update', updateWorkout);
app.use('/adminHome', adminHome);
app.use('/adminDailySummary', adminDailySummary);
app.use('/coachDailySummary', coachDailySummary);
app.use('/coachHome', coachHome);
app.use('/coachRecentData', coachRecentData);

/* GET home page. */
app.get('/', requireLogin, function(req, res, next) {
    res.render('coachDashboard', { username: req.session.user });
});

//****START COACH PAGES*****

app.get('/coachDailySummary', requireLogin, function(req, res, next) {

    var sql = "SELECT * FROM workouts ORDER BY date DESC LIMIT 10;";

    var recent_dates = [];
    connection.query(sql, function(err, result){
        if (err) throw err;

        recent_dates = result;

        var workout = [];
        res.render('coachDailySummary', {
            username: req.session.user,
            recent: recent_dates,
            workout: workout
        });

    })


});

app.get('/coachRecentData', requireLogin, function(req, res, next) {
    var sql = "SELECT username, password, privileges FROM user WHERE username= " + "'" + req.body.username + "'";

    connection.query(sql, function (err, result) {
        if (err) throw err;


        sql = "SELECT u.username, u.first_name, u.last_name, u.position, " +
            "SUM(w.player_sRPE * m.duration) as chronicSum, m.date " +
            "FROM master.user u, master.player_workouts w, master.workouts m " +
            "WHERE u.username = w.username " +
            "AND w.workoutID = m.workoutid " +
            "AND m.date " +
            "BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 4 WEEK) AND CURRENT_DATE() " +
            " GROUP BY u.username;"
        ;


        var four_week_data = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
            }


            four_week_data = result;

            sql = "SELECT u.username, SUM(w.player_sRPE * m.duration) as acuteSum, m.date, " +
                " (SUM(w.player_sRPE * m.duration)/7) as acuteMeanSum " +
                "FROM master.user u, master.player_workouts w, master.workouts m " +
                "WHERE u.username = w.username " +
                "AND w.workoutID = m.workoutid " +
                "AND m.date " +
                "BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 1 WEEK) AND CURRENT_DATE() " +
                " GROUP BY u.username;"
            ;


            var one_week_data = [];
            connection.query(sql, function (err, result) {
                if (err) throw err;
                if (result.length == 0) {
                }


                one_week_data = result;


                sql = "SELECT u.username,u.first_name,w.player_sRPE, m.duration, m.date, (w.player_sRPE * m.duration) as dayLoad " +
                    "FROM master.user u, master.player_workouts w, master.workouts m " +
                    "WHERE u.username = w.username " +
                    "AND w.workoutID = m.workoutid " +
                    "AND m.date " +
                    "BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 1 WEEK) AND CURRENT_DATE();"
                ;


                var daily_load = [];
                connection.query(sql, function (err, result) {
                    if (err) throw err;
                    if (result.length == 0) {
                    }


                    daily_load = result;




                    sql = "SELECT p.workoutID, AVG(p.player_sRPE) as sessionRPE, w.duration, " +
                        "(AVG(p.player_sRPE) * w.duration) as sessionLoad " +
                        "FROM master.player_workouts p, master.workouts w " +
                        "WHERE p.workoutID = w.workoutid " +
                        "GROUP BY workoutID DESC LIMIT 1; ";


                    var session = [];
                    connection.query(sql, function (err, result) {
                        if (err) throw err;
                        if (result.length == 0) {
                        }


                        session = result;




                        sql = "SELECT u.username,u.first_name,w.player_sRPE, m.duration, m.date, " +
                            "(w.player_sRPE * m.duration) as dayLoad " +
                            "FROM master.user u, master.player_workouts w, master.workouts m " +
                            "WHERE u.username = w.username " +
                            "AND w.workoutID = m.workoutid " +
                            "AND m.date " +
                            "BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY) AND CURRENT_DATE(); ";


                        var three_days = [];
                        connection.query(sql, function (err, result) {
                            if (err) throw err;
                            if (result.length == 0) {
                            }


                            three_days = result;




                            sql = "SELECT * FROM master.player_workouts " +
                                "WHERE workoutID IN " +
                                "(SELECT MAX(workoutID) FROM master.player_workouts);" ;


                            var current_rpe = [];
                            connection.query(sql, function (err, result) {
                                if (err) throw err;
                                if (result.length == 0) {
                                }


                                current_rpe = result;


                                connection.query(sql, function (err, result) {
                                    if (err) throw err;

                                    sql = "SELECT AVG(w.player_sRPE) as rpeAVG, m.date " +
                                        "FROM master.user u, master.player_workouts w, master.workouts m " +
                                        "WHERE u.username = w.username " +
                                        "AND w.workoutID = m.workoutid " +
                                        "AND m.date " +
                                        "BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 4 WEEK) AND CURRENT_DATE(); "
                                    ;

                                    var rpe_four = [];
                                    connection.query(sql, function (err, result) {
                                        if (err) throw err;
                                        if (result.length == 0) {
                                        }


                                        rpe_four = result;

                                        sql = "SELECT AVG(w.player_sRPE) as rpeAVG, m.date " +
                                            "FROM master.user u, master.player_workouts w, master.workouts m " +
                                            "WHERE u.username = w.username " +
                                            "AND w.workoutID = m.workoutid " +
                                            "AND m.date " +
                                            "BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 1 WEEK) AND CURRENT_DATE(); "
                                        ;



                                        var rpe_one = [];
                                        connection.query(sql, function (err, result) {
                                            if (err) throw err;
                                            if (result.length == 0) {
                                            }


                                            rpe_one = result;


                                            sql = "SELECT m.duration, m.date " +
                                                "FROM master.workouts m " +
                                                "WHERE m.date " +
                                                "BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 4 WEEK) AND CURRENT_DATE(); ";

                                            var four_week_duration = [];
                                            connection.query(sql, function (err, result) {
                                                if (err) throw err;


                                                four_week_duration = result;



                                                sql = "SELECT m.duration,m.date " +
                                                    "FROM master.workouts m " +
                                                    "WHERE m.date " +
                                                    "BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 1 WEEK) AND CURRENT_DATE(); ";



                                                var one_week_duration = [];
                                                connection.query(sql, function (err, result) {
                                                    if (err) throw err;
                                                    if (result.length == 0) {
                                                    }

                                                    one_week_duration = result;




                                                    sql = "SELECT u.position, AVG(w.player_sRPE) as rpeAVG, m.date " +
                                                        "FROM master.user u, master.player_workouts w, master.workouts m " +
                                                        "WHERE u.username = w.username " +
                                                        "AND w.workoutID = m.workoutid " +
                                                        "AND m.date " +
                                                        "BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 4 WEEK) AND CURRENT_DATE() " +
                                                        "GROUP BY u.position;";


                                                    var chronicPosition = [];
                                                    connection.query(sql, function (err, result) {
                                                        if (err) throw err;
                                                        if (result.length == 0) {
                                                        }

                                                        chronicPosition = result;


                                                        sql = "SELECT u.position, AVG(w.player_sRPE) as rpeAVG, m.date " +
                                                            "FROM master.user u, master.player_workouts w, master.workouts m " +
                                                            "WHERE u.username = w.username " +
                                                            "AND w.workoutID = m.workoutid " +
                                                            "AND m.date " +
                                                            "BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 1 WEEK) AND CURRENT_DATE() " +
                                                            "GROUP BY u.position;";


                                                        var acutePosition = [];
                                                        connection.query(sql, function (err, result) {
                                                            if (err) throw err;
                                                            if (result.length == 0) {
                                                            }

                                                            acutePosition = result;



                                                            res.render('coachRecentData', {
                                                                username: req.session.user,
                                                                player_data: four_week_data,
                                                                one_week_data: one_week_data,
                                                                daily_load: daily_load,
                                                                session: session,
                                                                three_day_load: three_days,
                                                                current_rpe: current_rpe,
                                                                rpe_fourweek: rpe_four,
                                                                rpe_oneweek: rpe_one,
                                                                one_week_duration: one_week_duration,
                                                                four_week_duration: four_week_duration,
                                                                chronicPosition: chronicPosition,
                                                                acutePosition: acutePosition
                                                            });




                                                        });


                                                    });
                                                });

                                            });


                                        });











                                    });

                                });



                            });


                        });

                    });



                });







            });

        });


    });
});

app.get('/coachHome', requireLogin, function(req, res, next) {
    res.render('coachHome', {
        username: req.session.user
    });
});


//END COACH PAGES*************


//***START ADMIN PAGES**********

/* Workout Manager page */
app.get('/workoutManager', requireLogin, function(req, res, next) {
    res.render('workoutManager', {
        username: req.session.user,
        message: ''});
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

/* Team Data page */
app.get('/teamData', requireLogin, function(req, res, next) {
    var sql = "SELECT username, password, privileges FROM user WHERE username= " + "'" + req.body.username + "'";

    connection.query(sql, function (err, result) {
        if (err) throw err;

        sql = "SELECT AVG(w.player_sRPE) as rpeAVG, m.date " +
            "FROM master.user u, master.player_workouts w, master.workouts m " +
            "WHERE u.username = w.username " +
            "AND w.workoutID = m.workoutid " +
            "AND m.date " +
            "BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 4 WEEK) AND CURRENT_DATE(); "
        ;
        
        var rpe_four = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
            }


            rpe_four = result;

            sql = "SELECT AVG(w.player_sRPE) as rpeAVG, m.date " +
                "FROM master.user u, master.player_workouts w, master.workouts m " +
                "WHERE u.username = w.username " +
                "AND w.workoutID = m.workoutid " +
                "AND m.date " +
                "BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 1 WEEK) AND CURRENT_DATE(); "
            ;



            var rpe_one = [];
            connection.query(sql, function (err, result) {
                if (err) throw err;
                if (result.length == 0) {
                }


                rpe_one = result;


                sql = "SELECT m.duration, m.date " +
                "FROM master.workouts m " +
                "WHERE m.date " +
                "BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 4 WEEK) AND CURRENT_DATE(); ";

                var four_week_duration = [];
                connection.query(sql, function (err, result) {
                    if (err) throw err;


                    four_week_duration = result;



                    sql = "SELECT m.duration,m.date " +
                        "FROM master.workouts m " +
                        "WHERE m.date " +
                        "BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 1 WEEK) AND CURRENT_DATE(); ";



                        var one_week_duration = [];
                        connection.query(sql, function (err, result) {
                            if (err) throw err;
                            if (result.length == 0) {
                            }

                            one_week_duration = result;




                            sql = "SELECT u.position, AVG(w.player_sRPE) as rpeAVG, m.date " +
                            "FROM master.user u, master.player_workouts w, master.workouts m " +
                            "WHERE u.username = w.username " +
                            "AND w.workoutID = m.workoutid " +
                            "AND m.date " +
                            "BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 4 WEEK) AND CURRENT_DATE() " +
                            "GROUP BY u.position;";


                            var chronicPosition = [];
                            connection.query(sql, function (err, result) {
                                if (err) throw err;
                                if (result.length == 0) {
                                }

                                chronicPosition = result;


                                sql = "SELECT u.position, AVG(w.player_sRPE) as rpeAVG, m.date " +
                                    "FROM master.user u, master.player_workouts w, master.workouts m " +
                                    "WHERE u.username = w.username " +
                                    "AND w.workoutID = m.workoutid " +
                                    "AND m.date " +
                                    "BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 1 WEEK) AND CURRENT_DATE() " +
                                    "GROUP BY u.position;";


                                var acutePosition = [];
                                connection.query(sql, function (err, result) {
                                    if (err) throw err;
                                    if (result.length == 0) {
                                    }

                                    acutePosition = result;





                                    res.render('teamData', {
                                        username: req.session.user,
                                        rpe_fourweek: rpe_four,
                                        rpe_oneweek: rpe_one,
                                        one_week_duration: one_week_duration,
                                        four_week_duration: four_week_duration,
                                        chronicPosition: chronicPosition,
                                        acutePosition: acutePosition
                                    });





                                });


                            });
                        });

                    });


                });











        });

    });
});


//Weekly Summary Page
app.get('/weeklySummary', requireLogin, function(req, res, next) {



    res.render('weeklySummary', {
        username: req.session.user
    });
});


//Admin Home Page
app.get('/adminHome', requireLogin, function(req, res, next) {
    res.render('adminHome', {
        username: req.session.user
    });
});

//Admin Home Page
app.get('/adminDailySummary', requireLogin, function(req, res, next) {

    var sql = "SELECT * FROM workouts ORDER BY date DESC LIMIT 10;";

    var recent_dates = [];
    connection.query(sql, function(err, result){
        if (err) throw err;

        recent_dates = result;

        var workout = [];
        res.render('adminDailySummary', {
            username: req.session.user,
            recent: recent_dates,
            workout: workout
        });

    })


});

app.get('/updateWorkout', requireLogin, function(req, res, next) {



    res.render('updateWorkout', {
        username: req.session.user,
        message: ''
    });
});



app.get('/coachDashboard', requireLogin, function(req, res, next) {
    var sql = "SELECT username, password, privileges FROM user WHERE username= " + "'" + req.body.username + "'";

    connection.query(sql, function (err, result) {
        if (err) throw err;


        sql = "SELECT u.username, u.first_name, u.last_name, u.position, " +
            "SUM(w.player_sRPE * m.duration) as chronicSum, m.date " +
            "FROM master.user u, master.player_workouts w, master.workouts m " +
            "WHERE u.username = w.username " +
            "AND w.workoutID = m.workoutid " +
            "AND m.date " +
            "BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 4 WEEK) AND CURRENT_DATE() " +
            " GROUP BY u.username;"
        ;


        var four_week_data = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
            }


            four_week_data = result;

            sql = "SELECT u.username, SUM(w.player_sRPE * m.duration) as acuteSum, m.date, " +
                " (SUM(w.player_sRPE * m.duration)/7) as acuteMeanSum " +
                "FROM master.user u, master.player_workouts w, master.workouts m " +
                "WHERE u.username = w.username " +
                "AND w.workoutID = m.workoutid " +
                "AND m.date " +
                "BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 1 WEEK) AND CURRENT_DATE() " +
                " GROUP BY u.username;"
            ;


            var one_week_data = [];
            connection.query(sql, function (err, result) {
                if (err) throw err;
                if (result.length == 0) {
                }


                one_week_data = result;


                sql = "SELECT u.username,u.first_name,w.player_sRPE, m.duration, m.date, (w.player_sRPE * m.duration) as dayLoad " +
                    "FROM master.user u, master.player_workouts w, master.workouts m " +
                    "WHERE u.username = w.username " +
                    "AND w.workoutID = m.workoutid " +
                    "AND m.date " +
                    "BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 1 WEEK) AND CURRENT_DATE();"
                ;


                var daily_load = [];
                connection.query(sql, function (err, result) {
                    if (err) throw err;
                    if (result.length == 0) {
                    }


                    daily_load = result;




                    sql = "SELECT p.workoutID, AVG(p.player_sRPE) as sessionRPE, w.duration, " +
                        "(AVG(p.player_sRPE) * w.duration) as sessionLoad " +
                        "FROM master.player_workouts p, master.workouts w " +
                        "WHERE p.workoutID = w.workoutid " +
                        "GROUP BY workoutID DESC LIMIT 1; ";


                    var session = [];
                    connection.query(sql, function (err, result) {
                        if (err) throw err;
                        if (result.length == 0) {
                        }


                        session = result;




                        sql = "SELECT u.username,u.first_name,w.player_sRPE, m.duration, m.date, " +
                            "(w.player_sRPE * m.duration) as dayLoad " +
                            "FROM master.user u, master.player_workouts w, master.workouts m " +
                            "WHERE u.username = w.username " +
                            "AND w.workoutID = m.workoutid " +
                            "AND m.date " +
                            "BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY) AND CURRENT_DATE(); ";


                        var three_days = [];
                        connection.query(sql, function (err, result) {
                            if (err) throw err;
                            if (result.length == 0) {
                            }


                            three_days = result;




                            sql = "SELECT * FROM master.player_workouts " +
                                "WHERE workoutID IN " +
                                "(SELECT MAX(workoutID) FROM master.player_workouts);" ;


                            var current_rpe = [];
                            connection.query(sql, function (err, result) {
                                if (err) throw err;
                                if (result.length == 0) {
                                }


                                current_rpe = result;


                                connection.query(sql, function (err, result) {
                                    if (err) throw err;

                                    sql = "SELECT AVG(w.player_sRPE) as rpeAVG, m.date " +
                                        "FROM master.user u, master.player_workouts w, master.workouts m " +
                                        "WHERE u.username = w.username " +
                                        "AND w.workoutID = m.workoutid " +
                                        "AND m.date " +
                                        "BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 4 WEEK) AND CURRENT_DATE(); "
                                    ;

                                    var rpe_four = [];
                                    connection.query(sql, function (err, result) {
                                        if (err) throw err;
                                        if (result.length == 0) {
                                        }


                                        rpe_four = result;

                                        sql = "SELECT AVG(w.player_sRPE) as rpeAVG, m.date " +
                                            "FROM master.user u, master.player_workouts w, master.workouts m " +
                                            "WHERE u.username = w.username " +
                                            "AND w.workoutID = m.workoutid " +
                                            "AND m.date " +
                                            "BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 1 WEEK) AND CURRENT_DATE(); "
                                        ;



                                        var rpe_one = [];
                                        connection.query(sql, function (err, result) {
                                            if (err) throw err;
                                            if (result.length == 0) {
                                            }


                                            rpe_one = result;


                                            sql = "SELECT m.duration, m.date " +
                                                "FROM master.workouts m " +
                                                "WHERE m.date " +
                                                "BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 4 WEEK) AND CURRENT_DATE(); ";

                                            var four_week_duration = [];
                                            connection.query(sql, function (err, result) {
                                                if (err) throw err;


                                                four_week_duration = result;



                                                sql = "SELECT m.duration,m.date " +
                                                    "FROM master.workouts m " +
                                                    "WHERE m.date " +
                                                    "BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 1 WEEK) AND CURRENT_DATE(); ";



                                                var one_week_duration = [];
                                                connection.query(sql, function (err, result) {
                                                    if (err) throw err;
                                                    if (result.length == 0) {
                                                    }

                                                    one_week_duration = result;




                                                    sql = "SELECT u.position, AVG(w.player_sRPE) as rpeAVG, m.date " +
                                                        "FROM master.user u, master.player_workouts w, master.workouts m " +
                                                        "WHERE u.username = w.username " +
                                                        "AND w.workoutID = m.workoutid " +
                                                        "AND m.date " +
                                                        "BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 4 WEEK) AND CURRENT_DATE() " +
                                                        "GROUP BY u.position;";


                                                    var chronicPosition = [];
                                                    connection.query(sql, function (err, result) {
                                                        if (err) throw err;
                                                        if (result.length == 0) {
                                                        }

                                                        chronicPosition = result;


                                                        sql = "SELECT u.position, AVG(w.player_sRPE) as rpeAVG, m.date " +
                                                            "FROM master.user u, master.player_workouts w, master.workouts m " +
                                                            "WHERE u.username = w.username " +
                                                            "AND w.workoutID = m.workoutid " +
                                                            "AND m.date " +
                                                            "BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 1 WEEK) AND CURRENT_DATE() " +
                                                            "GROUP BY u.position;";


                                                        var acutePosition = [];
                                                        connection.query(sql, function (err, result) {
                                                            if (err) throw err;
                                                            if (result.length == 0) {
                                                            }

                                                            acutePosition = result;



                                                            res.render('coachDashboard', {
                                                                username: req.session.user,
                                                                player_data: four_week_data,
                                                                one_week_data: one_week_data,
                                                                daily_load: daily_load,
                                                                session: session,
                                                                three_day_load: three_days,
                                                                current_rpe: current_rpe,
                                                                rpe_fourweek: rpe_four,
                                                                rpe_oneweek: rpe_one,
                                                                one_week_duration: one_week_duration,
                                                                four_week_duration: four_week_duration,
                                                                chronicPosition: chronicPosition,
                                                                acutePosition: acutePosition
                                                            });




                                                        });


                                                    });
                                                });

                                            });


                                        });











                                    });

                                });



                            });


                        });

                    });



                });







            });

        });


    });
});



//END ADMIN PAGES*****


//START PLAYER PAGES*****


/* Player Dashboard page - Handles player data input  */
app.get('/playerDashboard', requireLogin, function(req, res, next) {


        res.render('playerDashboard', {
            username: req.session.user,
            message: ''
        });
});

//END PLAYER PAGES*********




// GET login page //
app.get('/login', function(req, res, next) {
    res.render('login', {message: '' });
});


// Attempts to login a user. If successful, sets the session so the user can access the data.
app.post('/attemptLogin', function(req, res) {
    var sql = "SELECT username, password, privileges FROM user WHERE username= " + "'" + req.body.username + "'";

    connection.query(sql, function (err, result) {
        if (err) throw err;

        if (result.length !== 0 && result[0].password === req.body.password) {
            req.session.user = req.body.username;
            if (result[0].privileges == "Admin") {


                res.render('adminHome', {
                    username: req.session.user
                });

            }

            else if(result[0].privileges == "Coach")
            {
                res.render('coachHome', {
                    username: req.session.user
                });
            }


            else {

                    res.render('playerDashboard', {
                        username: req.session.user,
                        message: ''
                    });
            }
        } else {
            res.render('login', { message: 'Failed' });
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
