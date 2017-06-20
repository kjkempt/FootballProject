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
var teamData = require('./routes/teamData');
var weeklySummary = require('./routes/weeklySummary');
var updateWorkout = require('./routes/updateWorkout');
var adminHome = require('./routes/adminHome');
var adminDailySummary = require('./routes/adminDailySummary');
var coachDailySummary = require('./routes/coachDailySummary');
var coachHome = require('./routes/coachHome');
var coachRecentData = require('./routes/coachRecentData');
var adminAddAthlete = require('./routes/adminAddAthlete');
var coachWeeklySummary = require('./routes/coachWeeklySummary');
var universeHome = require('./routes/universeHome');




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
app.use('/adminAddAthlete', adminAddAthlete);
app.use('/coachWeeklySummary', coachWeeklySummary);
app.use('/universeHome', universeHome);

//***Universe Pages

app.get('/universeHome', function(req, res, next) {
    res.render('universeHome', { });
});



//END Universe Pages

/* GET home page. */
app.get('/', function(req, res, next) {
    res.render('universeHome', { });
});

//****START COACH PAGES*****

app.get('/coachDailySummary', requireLogin, function(req, res, next) {

    var sql = "SELECT * FROM workouts ORDER BY date DESC LIMIT 10;";

    var recent_dates = [];
    connection.query(sql, function(err, result){
        if (err) throw err;

        recent_dates = result;

        var workout = [];
        var note = [];
        res.render('coachDailySummary', {
            username: req.session.user,
            recent: recent_dates,
            workout: workout,
            note: note
        });

    })


});

app.get('/coachRecentData', requireLogin, function(req, res, next) {
    var sql = "SELECT username, password, privileges FROM user WHERE username= " + "'" + req.body.username + "'";

    connection.query(sql, function (err, result) {
        if (err) throw err;

        sql = "SELECT DATE(DATE_ADD(curdate(), INTERVAL(1-DAYOFWEEK(curdate())) DAY)) as sunday;" ;
        var s = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;



            s = result;
            var date = s[0].sunday;

            date = date.toISOString().split('T')[0];


            //for Chronic load

            sql = "SELECT u.username, u.first_name, u.last_name, u.position, " +
                "SUM(w.player_sRPE * m.duration) as chronicSum, m.date " +
                "FROM master.user u, master.player_workouts w, master.workouts m " +
                "WHERE u.username = w.username " +
                "AND w.workoutID = m.workoutid " +
                "AND m.date " +
                "BETWEEN '"+date+"'- INTERVAL 3 WEEK AND '"+date+"' " +
                " GROUP BY u.username;"
            ;



            var four_week_data = [];
            connection.query(sql, function (err, result) {
                if (err) throw err;



                four_week_data = result;

                //for acute load and weekly Acute mean sum

                sql = "SELECT u.username, SUM(w.player_sRPE * m.duration) as acuteSum, " +
                    "(SUM(w.player_sRPE * m.duration)/dayofweek( CURRENT_DATE() - 1 ) )  as acuteMeanSum " +
                    "FROM master.user u, master.player_workouts w, master.workouts m " +
                    "WHERE u.username = w.username " +
                    "AND w.workoutID = m.workoutid " +
                    "AND yearweek(DATE(m.date), 6) = yearweek(curdate(), 6) " +
                    "GROUP BY u.username; ";


                var one_week_data = [];
                connection.query(sql, function (err, result) {
                    if (err) throw err;
                    if (result.length == 0) {
                    }


                    one_week_data = result;


                    //Holds data for player's RPE scores of current week to calc variance for monotony score

                    sql = "SELECT u.username,u.first_name,w.player_sRPE, m.duration, m.date, " +
                        "(w.player_sRPE * m.duration) as dayLoad " +
                        "FROM master.user u, master.player_workouts w, master.workouts m " +
                        "WHERE u.username = w.username " +
                        "AND w.workoutID = m.workoutid " +
                        "AND yearweek(DATE(m.date), 6) = yearweek(curdate(), 6);";


                    var daily_load = [];
                    connection.query(sql, function (err, result) {
                        if (err) throw err;
                        if (result.length == 0) {
                        }


                        daily_load = result;


                        //Average RPE score of the most recent session

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


                            //rolling three day load query

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


                                //Most recent RPE scores - used for FLAGS and

                                sql = "SELECT * FROM master.player_workouts " +
                                    "WHERE workoutID IN " +
                                    "(SELECT MAX(workoutID) FROM master.player_workouts);";


                                var current_rpe = [];
                                connection.query(sql, function (err, result) {
                                    if (err) throw err;


                                    current_rpe = result;


                                    //next couple queries are for the team database




                                    //Team Chronic RPE Average
                                    sql = "SELECT p.workoutID, w.workoutid, w.duration, w.date, " +
                                        "AVG(p.player_sRPE) as pavg FROM master.player_workouts p " +
                                        "INNER JOIN master.user u ON u.username = p.username " +
                                        "INNER JOIN master.workouts w ON w.workoutid = p.workoutID " +
                                        "WHERE w.date " +
                                        "BETWEEN '"+date+"'-INTERVAL 3 WEEK AND '"+date+"'  " +
                                        "GROUP BY  p.workoutID; ";


                                    var teamChronicRPE = [];
                                    connection.query(sql, function (err, result) {
                                        if (err) throw err;
                                        if (result.length == 0) {
                                        }


                                        teamChronicRPE = result;




                                        //Team Acute RPE Average
                                        sql = "SELECT p.workoutID, w.workoutid, w.duration, w.date, " +
                                            "AVG(p.player_sRPE) as pavg FROM master.player_workouts p " +
                                            "INNER JOIN master.user u ON u.username = p.username " +
                                            "INNER JOIN master.workouts w ON w.workoutid = p.workoutID " +
                                            "WHERE yearweek(DATE(w.date), 6) = yearweek(curdate(), 6) " +
                                            "GROUP BY  p.workoutID; ";
                                        ;


                                        var teamAcuteRPE = [];
                                        connection.query(sql, function (err, result) {
                                            if (err) throw err;
                                            if (result.length == 0) {
                                            }


                                            teamAcuteRPE = result;




                                            sql = "SELECT p.workoutID, w.workoutid, u.position, w.duration, w.date, " +
                                                "AVG(p.player_sRPE) as pavg FROM master.player_workouts p " +
                                                "INNER JOIN master.user u ON u.username = p.username " +
                                                "INNER JOIN master.workouts w ON w.workoutid = p.workoutID " +
                                                "WHERE w.date " +
                                                "BETWEEN '"+date+"'-INTERVAL 3 WEEK AND '"+date+"'  " +
                                                "GROUP BY u.position, p.workoutID; ";


                                            var chronicPosition = [];
                                            connection.query(sql, function (err, result) {
                                                if (err) throw err;
                                                if (result.length == 0) {
                                                }

                                                chronicPosition = result;


                                                sql = "SELECT p.workoutID, w.workoutid, u.position, w.duration, w.date, " +
                                                    "AVG(p.player_sRPE) as pavg FROM master.player_workouts p " +
                                                    "INNER JOIN master.user u ON u.username = p.username " +
                                                    "INNER JOIN master.workouts w ON w.workoutid = p.workoutID " +
                                                    "WHERE yearweek(DATE(w.date), 6) = yearweek(curdate(), 6) " +
                                                    "GROUP BY u.position, p.workoutID; ";


                                                var acutePosition = [];
                                                connection.query(sql, function (err, result) {
                                                    if (err) throw err;
                                                    if (result.length == 0) {
                                                    }

                                                    acutePosition = result;


                                                    sql = "SELECT t1.*, t3.duration " +
                                                        "FROM master.player_workouts t1, master.workouts t3 " +
                                                        "WHERE t1.workoutID = (SELECT MAX(t2.workoutID) " +
                                                        "FROM master.player_workouts t2 " +
                                                        "WHERE t2.username = t1.username) " +
                                                        "AND t3.workoutid = (SELECT MAX(t2.workoutID) " +
                                                        "FROM master.player_workouts t2 " +
                                                        "WHERE t2.username = t1.username); ";


                                                    var recent_rpe = [];
                                                    connection.query(sql, function (err, result) {
                                                        if (err) throw err;
                                                        if (result.length == 0) {
                                                        }

                                                        recent_rpe = result;

                                                        sql = "SELECT u.position " +
                                                            "FROM master.player_workouts p " +
                                                            "INNER JOIN master.user u ON p.username = u.username " +
                                                            "GROUP BY u.position;";

                                                        var position = [];
                                                        connection.query(sql, function (err, result) {
                                                            if (err) throw err;
                                                            if (result.length == 0) {
                                                            }

                                                            position = result;

                                                            res.render('coachRecentData', {
                                                                username: req.session.user,
                                                                player_data: four_week_data,
                                                                one_week_data: one_week_data,
                                                                daily_load: daily_load,
                                                                session: session,
                                                                three_day_load: three_days,
                                                                current_rpe: current_rpe,
                                                                teamChronicRPE: teamChronicRPE,
                                                                teamAcuteRPE: teamAcuteRPE,
                                                                chronicPosition: chronicPosition,
                                                                acutePosition: acutePosition,
                                                                recent_rpe: recent_rpe,
                                                                groupPos: position
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

app.get('/coachWeeklySummary', requireLogin, function(req, res, next) {

    var week_data = [];
    var chronic = [];
    var sql = "SELECT distinct DATE(DATE_ADD(m.date, INTERVAL(1-DAYOFWEEK(m.date)) DAY)) as sunday, " +
        "DATE(DATE_ADD(m.date, INTERVAL(7-DAYOFWEEK(m.date)) DAY)) as saturday " +
        "FROM master.workouts m;";


    var week_set = [];
    connection.query(sql, function(err, result){
        if(err) throw err;

        week_set = result;



        for(var i = 0; i < week_set.length; i++)
        {
            var sun = week_set[i].sunday;

            sun = sun.toISOString().split('T')[0];

            var sat = week_set[i].saturday;

            sat = sat.toISOString().split('T')[0];

            week_set[i].sunday = sun;
            week_set[i].saturday = sat;

        }





        res.render('coachWeeklySummary', {
            username: req.session.user,
            week_data: week_data,
            chronic_week: chronic,
            week_set: week_set
        });



    });


});



//END COACH PAGES*************


//***START ADMIN PAGES**********

//Admin Add Athlete
app.get('/adminAddAthlete', requireLogin, function(req, res, next) {
    res.render('adminAddAthlete', {
        username: req.session.user,
        message: ''});
});

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

    var week_data = [];
    var chronic = [];
    var sql = "SELECT distinct DATE(DATE_ADD(m.date, INTERVAL(1-DAYOFWEEK(m.date)) DAY)) as sunday, " +
    "DATE(DATE_ADD(m.date, INTERVAL(7-DAYOFWEEK(m.date)) DAY)) as saturday " +
    "FROM master.workouts m;";


    var week_set = [];
    connection.query(sql, function(err, result){
        if(err) throw err;

        week_set = result;



        for(var i = 0; i < week_set.length; i++)
        {
            var sun = week_set[i].sunday;

            sun = sun.toISOString().split('T')[0];

            var sat = week_set[i].saturday;

            sat = sat.toISOString().split('T')[0];

            week_set[i].sunday = sun;
            week_set[i].saturday = sat;

        }





        res.render('weeklySummary', {
            username: req.session.user,
            week_data: week_data,
            chronic_week: chronic,
            week_set: week_set
        });



    });


});

//Admin Home Page
app.get('/adminHome', requireLogin, function(req, res, next) {
    res.render('adminHome', {
        username: req.session.user
    });
});

//Admin Daily Summary
app.get('/adminDailySummary', requireLogin, function(req, res, next) {

    var sql = "SELECT * FROM workouts ORDER BY date DESC LIMIT 10;";

    var recent_dates = [];
    connection.query(sql, function(err, result){
        if (err) throw err;

        recent_dates = result;

        var workout = [];
        var note = [];
        res.render('adminDailySummary', {
            username: req.session.user,
            recent: recent_dates,
            workout: workout,
            note: note
        });

    })


});

//Update Workout
app.get('/updateWorkout', requireLogin, function(req, res, next) {



    res.render('updateWorkout', {
        username: req.session.user,
        message: ''
    });
});

//Admin Recent Data Page
app.get('/coachDashboard', requireLogin, function(req, res, next) {
    var sql = "SELECT username, password, privileges FROM user WHERE username= " + "'" + req.body.username + "'";

    connection.query(sql, function (err, result) {
        if (err) throw err;

        sql = "SELECT DATE(DATE_ADD(curdate(), INTERVAL(1-DAYOFWEEK(curdate())) DAY)) as sunday;" ;
        var s = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;



            s = result;
            var date = s[0].sunday;

            date = date.toISOString().split('T')[0];


            //for Chronic load

            sql = "SELECT u.username, u.first_name, u.last_name, u.position, " +
                "SUM(w.player_sRPE * m.duration) as chronicSum, m.date " +
                "FROM master.user u, master.player_workouts w, master.workouts m " +
                "WHERE u.username = w.username " +
                "AND w.workoutID = m.workoutid " +
                "AND m.date " +
                "BETWEEN '"+date+"'- INTERVAL 3 WEEK AND '"+date+"' " +
                " GROUP BY u.username;"
            ;



            var four_week_data = [];
            connection.query(sql, function (err, result) {
                if (err) throw err;



                four_week_data = result;

                //for acute load and weekly Acute mean sum

                sql = "SELECT u.username, SUM(w.player_sRPE * m.duration) as acuteSum, " +
                    "(SUM(w.player_sRPE * m.duration)/dayofweek( CURRENT_DATE() - 1 ) )  as acuteMeanSum " +
                    "FROM master.user u, master.player_workouts w, master.workouts m " +
                    "WHERE u.username = w.username " +
                    "AND w.workoutID = m.workoutid " +
                    "AND yearweek(DATE(m.date), 6) = yearweek(curdate(), 6) " +
                    "GROUP BY u.username; ";


                var one_week_data = [];
                connection.query(sql, function (err, result) {
                    if (err) throw err;
                    if (result.length == 0) {
                    }


                    one_week_data = result;


                    //Holds data for player's RPE scores of current week to calc variance for monotony score

                    sql = "SELECT u.username,u.first_name,w.player_sRPE, m.duration, m.date, " +
                        "(w.player_sRPE * m.duration) as dayLoad " +
                        "FROM master.user u, master.player_workouts w, master.workouts m " +
                        "WHERE u.username = w.username " +
                        "AND w.workoutID = m.workoutid " +
                        "AND yearweek(DATE(m.date), 6) = yearweek(curdate(), 6);";


                    var daily_load = [];
                    connection.query(sql, function (err, result) {
                        if (err) throw err;
                        if (result.length == 0) {
                        }


                        daily_load = result;


                        //Average RPE score of the most recent session

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


                            //rolling three day load query

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


                                //Most recent RPE scores - used for FLAGS and

                                sql = "SELECT * FROM master.player_workouts " +
                                    "WHERE workoutID IN " +
                                    "(SELECT MAX(workoutID) FROM master.player_workouts);";


                                var current_rpe = [];
                                connection.query(sql, function (err, result) {
                                    if (err) throw err;


                                    current_rpe = result;


                                    //next couple queries are for the team database




                                    //Team Chronic RPE Average
                                    sql = "SELECT p.workoutID, w.workoutid, w.duration, w.date, " +
                                    "AVG(p.player_sRPE) as pavg FROM master.player_workouts p " +
                                    "INNER JOIN master.user u ON u.username = p.username " +
                                    "INNER JOIN master.workouts w ON w.workoutid = p.workoutID " +
                                    "WHERE w.date " +
                                    "BETWEEN '"+date+"'-INTERVAL 3 WEEK AND '"+date+"'  " +
                                    "GROUP BY  p.workoutID; ";


                                    var teamChronicRPE = [];
                                    connection.query(sql, function (err, result) {
                                        if (err) throw err;
                                        if (result.length == 0) {
                                        }


                                        teamChronicRPE = result;




                                        //Team Acute RPE Average
                                        sql = "SELECT p.workoutID, w.workoutid, w.duration, w.date, " +
                                        "AVG(p.player_sRPE) as pavg FROM master.player_workouts p " +
                                        "INNER JOIN master.user u ON u.username = p.username " +
                                        "INNER JOIN master.workouts w ON w.workoutid = p.workoutID " +
                                        "WHERE yearweek(DATE(w.date), 6) = yearweek(curdate(), 6) " +
                                        "GROUP BY  p.workoutID; ";
                                        ;


                                        var teamAcuteRPE = [];
                                        connection.query(sql, function (err, result) {
                                            if (err) throw err;
                                            if (result.length == 0) {
                                            }


                                            teamAcuteRPE = result;




                                                    sql = "SELECT p.workoutID, w.workoutid, u.position, w.duration, w.date, " +
                                            "AVG(p.player_sRPE) as pavg FROM master.player_workouts p " +
                                            "INNER JOIN master.user u ON u.username = p.username " +
                                            "INNER JOIN master.workouts w ON w.workoutid = p.workoutID " +
                                            "WHERE w.date " +
                                            "BETWEEN '"+date+"'-INTERVAL 3 WEEK AND '"+date+"'  " +
                                            "GROUP BY u.position, p.workoutID; ";


                                                    var chronicPosition = [];
                                                    connection.query(sql, function (err, result) {
                                                        if (err) throw err;
                                                        if (result.length == 0) {
                                                        }

                                                        chronicPosition = result;


                                                        sql = "SELECT p.workoutID, w.workoutid, u.position, w.duration, w.date, " +
                                                        "AVG(p.player_sRPE) as pavg FROM master.player_workouts p " +
                                                        "INNER JOIN master.user u ON u.username = p.username " +
                                                        "INNER JOIN master.workouts w ON w.workoutid = p.workoutID " +
                                                        "WHERE yearweek(DATE(w.date), 6) = yearweek(curdate(), 6) " +
                                                        "GROUP BY u.position, p.workoutID; ";


                                                        var acutePosition = [];
                                                        connection.query(sql, function (err, result) {
                                                            if (err) throw err;
                                                            if (result.length == 0) {
                                                            }

                                                            acutePosition = result;


                                                            sql = "SELECT t1.*, t3.duration " +
                                                                "FROM master.player_workouts t1, master.workouts t3 " +
                                                                "WHERE t1.workoutID = (SELECT MAX(t2.workoutID) " +
                                                                "FROM master.player_workouts t2 " +
                                                                "WHERE t2.username = t1.username) " +
                                                                "AND t3.workoutid = (SELECT MAX(t2.workoutID) " +
                                                                "FROM master.player_workouts t2 " +
                                                                "WHERE t2.username = t1.username); ";


                                                            var recent_rpe = [];
                                                            connection.query(sql, function (err, result) {
                                                                if (err) throw err;
                                                                if (result.length == 0) {
                                                                }

                                                                recent_rpe = result;

                                                                sql = "SELECT u.position " +
                                                                "FROM master.player_workouts p " +
                                                                "INNER JOIN master.user u ON p.username = u.username " +
                                                                "GROUP BY u.position;";

                                                                var position = [];
                                                                connection.query(sql, function (err, result) {
                                                                    if (err) throw err;
                                                                    if (result.length == 0) {
                                                                    }

                                                                    position = result;

                                                                    res.render('coachDashboard', {
                                                                        username: req.session.user,
                                                                        player_data: four_week_data,
                                                                        one_week_data: one_week_data,
                                                                        daily_load: daily_load,
                                                                        session: session,
                                                                        three_day_load: three_days,
                                                                        current_rpe: current_rpe,
                                                                        teamChronicRPE: teamChronicRPE,
                                                                        teamAcuteRPE: teamAcuteRPE,
                                                                        chronicPosition: chronicPosition,
                                                                        acutePosition: acutePosition,
                                                                        recent_rpe: recent_rpe,
                                                                        groupPos: position
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

//**************END ADMIN PAGES*****









//*****************START PLAYER PAGES*****

/* Player Dashboard page - Handles player data input  */
app.get('/playerDashboard', requireLogin, function(req, res, next) {


        res.render('playerDashboard', {
            username: req.session.user,
            message: ''
        });
});

//***************END PLAYER PAGES*********




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
    res.redirect('/login');
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
