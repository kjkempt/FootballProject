var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');





var coachDashboard = require('./routes/coachDashboard');
var playerDashboard = require('./routes/playerDashboard');
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
var universeRegister = require('./routes/universeRegister');
var universeThanks = require('./routes/universeThanks');
var changePassword = require('./routes/changePassword');
var nutritionHome = require('./routes/nutritionHome');
var nutritionCreateSession = require('./routes/nutritionCreateSession');
var nutritionSession = require('./routes/nutritionSession');
var adminGroupControl = require('./routes/adminGroupControl');
var adminSettings = require('./routes/adminSettings');
var nutritionMealTracker = require('./routes/nutritionMealTracker');
var nutritionCounter = require('./routes/nutritionCounter');
var coachCataDailySum = require('./routes/coachCataDailySum');
var coachCataWeekSum = require('./routes/coachCataWeekSum');
var coachCataRecentData = require('./routes/coachCataRecentData');
var coachCataTeamWeekSum = require('./routes/coachCataTeamWeekSum');




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
app.use('/universeRegister', universeRegister);
app.use('/universeThanks', universeThanks);
app.use('/changePassword', changePassword);
app.use('/nutritionHome', nutritionHome);
app.use('/nutritionCreateSession', nutritionCreateSession);
app.use('/nutritionSession', nutritionSession);
app.use('/adminGroupControl', adminGroupControl);
app.use('/adminSettings', adminSettings);
app.use('/nutritionMealTracker', nutritionMealTracker);
app.use('/nutritionCounter', nutritionCounter);
app.use('/coachCataDailySum', coachCataDailySum);
app.use('/coachCataWeekSum', coachCataWeekSum);
app.use('/coachCataRecentData', coachCataRecentData);
app.use('/coachCataTeamWeekSum', coachCataTeamWeekSum);

//***Universe Pages

app.get('/universeHome', function(req, res, next) {
    res.render('universeHome', { });
});

app.get('/universeRegister', function(req, res, next) {
    res.render('universeRegister', { message: ""});
});

app.get('/universeThanks', function(req, res, next) {
    res.render('universeThanks', { });
});

app.get('/changePassword', requireLogin, function(req, res, next) {
    res.render('changePassword', { username: req.session.user});
});


//END Universe Pages

/* GET home page. */
app.get('/', function(req, res, next) {
    res.render('login', { message: ''});
});


//******START NUTRITION PAGES*******

app.get('/nutritionHome', requireLogin, function(req, res, next) {
    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function (err, result) {
        if (err) throw err;

        teamid = result;

        sql = "select MAX(mealID) as max from master.meals " +
        "where teamID = '"+teamid[0].teamID+"' and status = 'open';";

        connection.query(sql, function (err, result) {
            if (err) throw err;


            if(!result[0].max)
            {
                res.render('nutritionHome', {
                    username: req.session.user,
                    active: "0"
                });
            }
            else
            {
                res.render('nutritionHome', {
                    username: req.session.user,
                    active: "1"
                });
            }



        });

    });
});

app.get('/nutritionCreateSession', requireLogin, function(req, res, next) {
    res.render('nutritionCreateSession', { username: req.session.user});
});

app.get('/nutritionSession', requireLogin, function(req, res, next) {
    res.render('nutritionSession', { username: req.session.user, message: ""});
});

app.get('/nutritionMealTracker', requireLogin, function(req, res, next) {

    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function (err, result) {
        if (err) throw err;

        teamid = result;


        sql = "SELECT * FROM master.meals " +
            "WHERE teamID = '"+teamid[0].teamID+"' " +
            "ORDER BY date DESC LIMIT 10;";

        var recent_dates = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;

            recent_dates = result;

            for (var i = 0; i < recent_dates.length; i++) {

                var day = recent_dates[i].date;

                day = day.toISOString().split('T')[0];

                recent_dates[i].date = day;

                recent_dates[i].date = recent_dates[i].date + ", " + recent_dates[i].name;


            }

            var players = [];
            res.render('nutritionMealTracker', {
                    username: req.session.user,
                    recent_dates: recent_dates,
                    players: players
            });


        });

    });
});

app.get('/nutritionCounter', requireLogin, function(req, res, next) {
    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function (err, result) {
        if (err) throw err;

        teamid = result;

        sql = "select MAX(mealID) as max from master.meals " +
            "where teamID = '"+teamid[0].teamID+"' and status = 'open';";

        connection.query(sql, function (err, result) {
            if (err) throw err;

            if(!result[0].max)
            {

                res.render('nutritionHome', {
                    username: req.session.user,
                    active: "0"
                });
            }
            else
            {
                sql = "select COUNT(*) as c " +
                "from master.user u " +
                "where u.teamID = '"+teamid[0].teamID+"' " +
                "and u.privileges = 'Player' " +
                "and u.username NOT IN( " +
                "select u.username " +
                "from master.user u " +
                "INNER JOIN master.player_meals p ON p.username = u.username " +
                "where u.teamID = '"+teamid[0].teamID+"' " +
                "and u.privileges = 'Player' " +
                "and p.meal_id = (select MAX(mealID) from master.meals " +
                "where teamID = '"+teamid[0].teamID+"')) " +
                "order by u.last_name;";


                var pcount = [];
                connection.query(sql, function (err, result) {
                    if (err) throw err;

                    pcount = result;

                    res.render('nutritionCounter', {
                        username: req.session.user,
                        pcount: pcount
                    });

                });
            }



        });

    });
});







//*******END NUTRITION PAGES*********





//****START COACH PAGES*****

app.get('/coachDailySummary', requireLogin, function(req, res, next) {

    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function (err, result) {
        if (err) throw err;

        teamid = result;




        sql = "SELECT * FROM workouts " +
            "WHERE teamID = '"+teamid[0].teamID+"' " +
            "ORDER BY date DESC LIMIT 10;";

        var recent_dates = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;

            recent_dates = result;

            for(var i = 0; i < recent_dates.length; i++) {

                var day = recent_dates[i].date;

                day = day.toISOString().split('T')[0];

                recent_dates[i].date = day;

                recent_dates[i].date = recent_dates[i].date + " " + recent_dates[i].time + ", " + recent_dates[i].name;




            }








            var workout = [];
            var note = [];


            res.render('coachDailySummary', {
                username: req.session.user,
                recent: recent_dates,
                workout: workout,
                note: note
            });




        });


    });



});

app.get('/coachRecentData', requireLogin, function(req, res, next) {


        var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

        var teamid = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;

            teamid = result;


            sql = "SELECT DATE(DATE_ADD(curdate(), INTERVAL(1-DAYOFWEEK(curdate())) DAY)) as sunday;";
            var s = [];
            connection.query(sql, function (err, result) {
                if (err) throw err;


                s = result;
                var date = s[0].sunday;

                date = date.toISOString().split('T')[0];


                //for Chronic load

                sql = "SELECT u.username, " +
                    "SUM(w.player_sRPE * m.duration) / 4 as chronicSum, m.date " +
                    "FROM master.user u, master.player_workouts w, master.workouts m " +
                    "WHERE u.username = w.username " +
                    "AND w.workoutID = m.workoutid " +
                    "AND w.teamID = '"+teamid[0].teamID+"' " +
                    "AND m.teamID = '"+teamid[0].teamID+"' " +
                    "AND u.teamID = '"+teamid[0].teamID+"' " +
                    "AND m.date " +
                    "BETWEEN '" + date + "'- INTERVAL 4 WEEK AND '" + date + "' " +
                    " GROUP BY u.username;";


                var four_week_data = [];
                connection.query(sql, function (err, result) {
                    if (err) throw err;


                    four_week_data = result;


                    //for acute load and weekly Acute mean sum

                    sql = "SELECT u.username, u.first_name, u.last_name, u.position, " +
                        "SUM(w.player_sRPE * m.duration) as acuteSum, " +
                        "(SUM(w.player_sRPE * m.duration)/dayofweek( CURRENT_DATE() - 1 ) )  as acuteMeanSum " +
                        "FROM master.user u, master.player_workouts w, master.workouts m " +
                        "WHERE u.username = w.username " +
                        "AND w.workoutID = m.workoutid " +
                        "AND w.teamID = '"+teamid[0].teamID+"' " +
                        "AND u.teamID = '"+teamid[0].teamID+"' " +
                        "AND m.teamID = '"+teamid[0].teamID+"' " +
                        "AND yearweek(DATE(m.date), 6) = yearweek(curdate(), 6) " +
                        "GROUP BY u.username; ";


                    var one_week_data = [];
                    connection.query(sql, function (err, result) {
                        if (err) throw err;



                        one_week_data = result;


                        //Holds data for player's RPE scores of current week to calc variance for monotony score

                        sql = "SELECT u.username,u.first_name,w.player_sRPE, m.duration, m.date, " +
                            "(w.player_sRPE * m.duration) as dayLoad " +
                            "FROM master.user u, master.player_workouts w, master.workouts m " +
                            "WHERE u.username = w.username " +
                            "AND w.workoutID = m.workoutid " +
                            "AND w.teamID = '"+teamid[0].teamID+"' " +
                            "AND u.teamID = '"+teamid[0].teamID+"' " +
                            "AND m.teamID = '"+teamid[0].teamID+"' " +
                            "AND yearweek(DATE(m.date), 6) = yearweek(curdate(), 6);";


                        var daily_load = [];
                        connection.query(sql, function (err, result) {
                            if (err) throw err;



                            daily_load = result;


                            //Average RPE score of the most recent session

                            sql = "SELECT p.workoutID, AVG(p.player_sRPE) as sessionRPE, w.duration, " +
                                "(AVG(p.player_sRPE) * w.duration) as sessionLoad " +
                                "FROM master.player_workouts p, master.workouts w " +
                                "WHERE p.workoutID = w.workoutid " +
                                "AND p.teamID = '"+teamid[0].teamID+"' " +
                                "AND w.teamID = '"+teamid[0].teamID+"' " +
                                "GROUP BY workoutID DESC LIMIT 1; ";


                            var session = [];
                            connection.query(sql, function (err, result) {
                                if (err) throw err;



                                session = result;


                                //rolling three day load query

                                sql = "SELECT u.username,u.first_name,w.player_sRPE, m.duration, m.date, " +
                                    "(w.player_sRPE * m.duration) as dayLoad " +
                                    "FROM master.user u, master.player_workouts w, master.workouts m " +
                                    "WHERE u.username = w.username " +
                                    "AND w.workoutID = m.workoutid " +
                                    "AND w.teamID = '"+teamid[0].teamID+"' " +
                                    "AND u.teamID = '"+teamid[0].teamID+"' " +
                                    "AND m.teamID = '"+teamid[0].teamID+"' " +
                                    "AND m.date BETWEEN CURDATE()  - INTERVAL 3 DAY AND CURDATE()  - INTERVAL 1 DAY; ";


                                var three_days = [];
                                connection.query(sql, function (err, result) {
                                    if (err) throw err;
                                    three_days = result;


                                    //Most recent RPE scores - used for FLAGS and

                                    sql = "SELECT * FROM master.player_workouts " +
                                        "WHERE teamID = '"+teamid[0].teamID+"' " +
                                        "AND workoutID IN " +
                                        "(SELECT MAX(workoutID) FROM master.player_workouts);";


                                    var current_rpe = [];
                                    connection.query(sql, function (err, result) {
                                        if (err) throw err;


                                        current_rpe = result;


                                        //next couple queries are for the team database

                                        //Team Chronic Load Sum - t group designation
                                        sql = " SELECT u.username, " +
                                            "SUM(w.player_sRPE * m.duration) as chronicSum, m.date, SUM(m.duration) as duration_sum," +
                                            " COUNT(distinct u.username) as player_count " +
                                            "FROM master.user u, master.player_workouts w, master.workouts m " +
                                            "WHERE u.username = w.username " +
                                            "AND w.workoutID = m.workoutid " +
                                            "AND w.teamID = '"+teamid[0].teamID+"' " +
                                            "AND m.teamID = '"+teamid[0].teamID+"'  " +
                                            "AND u.teamID = '"+teamid[0].teamID+"' " +
                                            "AND u.group_chronic = 't' " +
                                            "AND m.date " +
                                            "BETWEEN '" + date + "'- INTERVAL 4 WEEK AND '" + date + "' " +
                                            "; ";



                                        var teamChronicRPE = [];
                                        connection.query(sql, function (err, result) {
                                            if (err) throw err;



                                            teamChronicRPE = result;




                                            //Team Acute Load with t designation
                                            sql = "SELECT u.username, "+
                                                "SUM(w.player_sRPE * m.duration) as chronicSum, m.date, SUM(m.duration) as duration_sum," +
                                                " COUNT(distinct u.username) as player_count " +
                                                "FROM master.user u, master.player_workouts w, master.workouts m " +
                                                "WHERE u.username = w.username " +
                                                "AND w.workoutID = m.workoutid " +
                                                "AND w.teamID = '"+teamid[0].teamID+"' " +
                                                "AND m.teamID = '"+teamid[0].teamID+"' " +
                                                "AND u.teamID = '"+teamid[0].teamID+"' " +
                                                "AND u.group_chronic = 't' " +
                                                "AND yearweek(DATE(m.date), 6) = yearweek(curdate(), 6) " +
                                                ";";



                                            var teamAcuteRPE = [];
                                            connection.query(sql, function (err, result) {
                                                if (err) throw err;

                                                teamAcuteRPE = result;


                                                sql = "SELECT u.position, "+
                                                    "SUM(w.player_sRPE * m.duration) as chronicSum, m.date, " +
                                                    "COUNT(distinct u.username) as player_count, SUM(m.duration) as duration_sum " +
                                                    "FROM master.user u, master.player_workouts w, master.workouts m " +
                                                    "WHERE u.username = w.username " +
                                                    "AND w.workoutID = m.workoutid " +
                                                    "AND w.teamID = '"+teamid[0].teamID+"' " +
                                                    "AND m.teamID = '"+teamid[0].teamID+"' " +
                                                    "AND u.teamID = '"+teamid[0].teamID+"' " +
                                                    "AND u.group_chronic = 't' " +
                                                    "AND m.date " +
                                                    "BETWEEN '" + date + "'- INTERVAL 4 WEEK AND '" + date + "' " +
                                                    "GROUP BY  u.position;";


                                                var chronicPosition = [];
                                                connection.query(sql, function (err, result) {
                                                    if (err) throw err;


                                                    chronicPosition = result;


                                                    sql = "SELECT u.position, "+
                                                        "SUM(w.player_sRPE * m.duration) as chronicSum, m.date, " +
                                                        "COUNT(distinct u.username) as player_count, SUM(m.duration) as duration_sum " +
                                                        "FROM master.user u, master.player_workouts w, master.workouts m " +
                                                        "WHERE u.username = w.username " +
                                                        "AND w.workoutID = m.workoutid " +
                                                        "AND w.teamID = '"+teamid[0].teamID+"' " +
                                                        "AND m.teamID = '"+teamid[0].teamID+"' " +
                                                        "AND u.teamID = '"+teamid[0].teamID+"' " +
                                                        "AND u.group_chronic = 't' " +
                                                        "AND yearweek(DATE(m.date), 6) = yearweek(curdate(), 6) " +
                                                        "GROUP BY  u.position;";


                                                    var acutePosition = [];
                                                    connection.query(sql, function (err, result) {
                                                        if (err) throw err;


                                                        acutePosition = result;




                                                        sql = "SELECT t1.*, t3.duration " +
                                                            "FROM master.player_workouts t1, master.workouts t3 " +
                                                            "WHERE t1.workoutID = (SELECT MAX(t2.workoutID) " +
                                                            "FROM master.player_workouts t2 " +
                                                            "WHERE t2.username = t1.username) " +
                                                            "AND t3.workoutid = (SELECT MAX(t2.workoutID) " +
                                                            "FROM master.player_workouts t2 " +
                                                            "WHERE t2.username = t1.username)" +
                                                            "AND t1.teamID = '"+teamid[0].teamID+"';";


                                                        var recent_rpe = [];
                                                        connection.query(sql, function (err, result) {
                                                            if (err) throw err;


                                                            recent_rpe = result;

                                                            sql = "SELECT u.position " +
                                                                "FROM master.player_workouts p " +
                                                                "INNER JOIN master.user u ON p.username = u.username " +
                                                                "WHERE p.teamID = '"+teamid[0].teamID+"' " +
                                                                "AND u.teamID = '"+teamid[0].teamID+"' " +
                                                                "GROUP BY u.position;";

                                                            var position = [];
                                                            connection.query(sql, function (err, result) {
                                                                if (err) throw err;


                                                                position = result;



                                                                sql = "SELECT u.username, u.position, "+
                                                                    "SUM(w.player_sRPE * m.duration) as chronicSum, m.date, " +
                                                                    "COUNT(distinct u.username) as player_count, " +
                                                                    "SUM(m.duration) as duration_sum " +
                                                                    "FROM master.user u, master.player_workouts w, master.workouts m " +
                                                                    "WHERE u.username = w.username " +
                                                                    "AND w.workoutID = m.workoutid " +
                                                                    "AND w.teamID = '"+teamid[0].teamID+"' " +
                                                                    "AND m.teamID = '"+teamid[0].teamID+"' " +
                                                                    "AND u.teamID = '"+teamid[0].teamID+"' " +
                                                                    "AND u.group_chronic = 't' " +
                                                                    "AND m.date BETWEEN CURDATE()  - INTERVAL 3 DAY AND CURDATE()  - INTERVAL 1 DAY " +
                                                                    "GROUP by u.position; ";


                                                                var threeDayPosition = [];
                                                                connection.query(sql, function (err, result) {
                                                                    if (err) throw err;


                                                                    threeDayPosition = result;


                                                                    sql = "SELECT u.username, "+
                                                                        "SUM(w.player_sRPE * m.duration) as chronicSum, m.date, " +
                                                                        "COUNT(distinct u.username) as player_count, " +
                                                                        "SUM(m.duration) as duration_sum " +
                                                                        "FROM master.user u, master.player_workouts w, master.workouts m " +
                                                                        "WHERE u.username = w.username " +
                                                                        "AND w.workoutID = m.workoutid " +
                                                                        "AND w.teamID = '"+teamid[0].teamID+"' " +
                                                                        "AND m.teamID = '"+teamid[0].teamID+"' " +
                                                                        "AND u.teamID = '"+teamid[0].teamID+"' " +
                                                                        "AND u.group_chronic = 't' " +
                                                                        "AND m.date BETWEEN CURDATE()  - INTERVAL 3 DAY AND CURDATE()  - INTERVAL 1 DAY; ";

                                                                    var threeDayTeam = [];
                                                                    connection.query(sql, function (err, result) {
                                                                        if (err) throw err;


                                                                        threeDayTeam = result;



                                                                        res.render('coachRecentData', {
                                                                            username: req.session.user,
                                                                            chronicPlayerLoad: four_week_data,
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
                                                                            groupPos: position,
                                                                            threeDayPosition: threeDayPosition,
                                                                            threeDayTeam: threeDayTeam
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


        });


});

app.get('/coachHome', requireLogin, function(req, res, next) {
    res.render('coachHome', {
        username: req.session.user
    });
});

app.get('/coachWeeklySummary', requireLogin, function(req, res, next) {

    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function (err, result) {
        if (err) throw err;

        teamid = result;


        var week_data = [];
        var chronic = [];
        var sql = "SELECT distinct DATE(DATE_ADD(m.date, INTERVAL(1-DAYOFWEEK(m.date)) DAY)) as sunday, " +
            "DATE(DATE_ADD(m.date, INTERVAL(7-DAYOFWEEK(m.date)) DAY)) as saturday " +
            "FROM master.workouts m " +
            "WHERE m.teamID = '"+teamid[0].teamID+"';";


        var week_set = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;

            week_set = result;


            for (var i = 0; i < week_set.length; i++) {
                var sun = week_set[i].sunday;

                sun = sun.toISOString().split('T')[0];

                var sat = week_set[i].saturday;

                sat = sat.toISOString().split('T')[0];

                week_set[i].sunday = sun;
                week_set[i].saturday = sat;

            }

            var team_week_data = [];
            var chronic_position = [];
            var pos_week_data = [];
            var chronic_team = [];
            var acute_position = [];
            var acute_team = [];
            var adg = [];
            var cdg = [];
            var chronic_team_previous = [];
            var chronic_position_previous = [];
            res.render('coachWeeklySummary', {
                username: req.user,
                week_data: week_data,
                chronic_week: chronic,
                week_set: week_set,
                pos_week_data: pos_week_data,
                team_week_data: team_week_data,
                chronic_position: chronic_position,
                chronic_team: chronic_team,
                acute_position: acute_position,
                acute_team: acute_team,
                adg: adg,
                cdg: cdg,
                chronic_team_previous: chronic_team_previous,
                chronic_position_previous: chronic_position_previous
            });


        });


    });


});

app.get('/coachCataDailySum', requireLogin, function(req, res, next) {

    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function (err, result) {
        if (err) throw err;

        teamid = result;




        sql = "SELECT * FROM master.cata_workouts " +
            "WHERE teamid = '"+teamid[0].teamID+"' " +
            "ORDER BY date DESC LIMIT 10;";

        var recent_dates = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;

            recent_dates = result;

            for(var i = 0; i < recent_dates.length; i++) {

                var day = recent_dates[i].date;

                day = day.toISOString().split('T')[0];

                recent_dates[i].date = day;

                recent_dates[i].date = recent_dates[i].date + ", " + recent_dates[i].name;




            }

            var pd = [];
            res.render('coachCataDailySum', {
                username: req.session.user,
                recent: recent_dates,
                pd: pd
            });






        });


    });



});

app.get('/coachCataWeekSum', requireLogin, function(req, res, next) {

    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function (err, result) {
        if (err) throw err;

        teamid = result;


        var sql = "SELECT distinct DATE(DATE_ADD(m.date, INTERVAL(1-DAYOFWEEK(m.date)) DAY)) as sunday, " +
            "DATE(DATE_ADD(m.date, INTERVAL(7-DAYOFWEEK(m.date)) DAY)) as saturday " +
            "FROM master.cata_workouts m " +
            "WHERE m.teamid = '"+teamid[0].teamID+"';";


        var week_set = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;

            week_set = result;


            for (var i = 0; i < week_set.length; i++) {
                var sun = week_set[i].sunday;

                sun = sun.toISOString().split('T')[0];

                var sat = week_set[i].saturday;

                sat = sat.toISOString().split('T')[0];

                week_set[i].sunday = sun;
                week_set[i].saturday = sat;

            }



            var player_day = [];
            var player_acute = [];
            var player_chronic = [];
            res.render('coachCataWeekSum', {
                username: req.user,
                week_set: week_set,
                player_day: player_day,
                player_acute: player_acute,
                player_chronic: player_chronic
            });




        });


    });


});

app.get('/coachCataTeamWeekSum', requireLogin, function(req, res, next) {

    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function (err, result) {
        if (err) throw err;

        teamid = result;


        var sql = "SELECT distinct DATE(DATE_ADD(m.date, INTERVAL(1-DAYOFWEEK(m.date)) DAY)) as sunday, " +
            "DATE(DATE_ADD(m.date, INTERVAL(7-DAYOFWEEK(m.date)) DAY)) as saturday " +
            "FROM master.cata_workouts m " +
            "WHERE m.teamid = '"+teamid[0].teamID+"';";


        var week_set = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;

            week_set = result;


            for (var i = 0; i < week_set.length; i++) {
                var sun = week_set[i].sunday;

                sun = sun.toISOString().split('T')[0];

                var sat = week_set[i].saturday;

                sat = sat.toISOString().split('T')[0];

                week_set[i].sunday = sun;
                week_set[i].saturday = sat;

            }



            var team_day = [];
            var team_acute = [];
            var team_chronic = [];
            var team_chart = [];
            var position_day = [];
            var position_acute = [];
            var position_chronic = [];
            res.render('coachCataTeamWeekSum', {
                username: req.user,
                week_set: week_set,
                team_day: team_day,
                team_acute: team_acute,
                team_chronic: team_chronic,
                team_chart: team_chart,
                position_day: position_day,
                position_acute: position_acute,
                position_chronic: position_chronic
            });




        });


    });


});

app.get('/coachCataRecentData', requireLogin, function(req, res, next) {

    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function (err, result) {
        if (err) throw err;

        teamid = result;


        sql = "SELECT DATE(DATE_ADD(curdate(), INTERVAL(7-DAYOFWEEK(curdate())) DAY)) as saturday;";
        var s = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;


            s = result;
            var date = s[0].saturday;

            date = date.toISOString().split('T')[0];

            sql = "SELECT u.username, u.position, m.date, " +
                "SUM(w.pload) as psum, SUM(w.duration) as dsum " +
                "FROM  master.cata_player_workouts w " +
                "INNER JOIN master.user u ON u.username = w.username " +
                "INNER JOIN master.cata_workouts m ON w.workout_id = m.id " +
                "WHERE w.teamID = '" + teamid[0].teamID + "' " +
                "AND u.teamID = '" + teamid[0].teamID + "' " +
                "AND m.date " +
                "BETWEEN  DATE(DATE_ADD('" + date + "', INTERVAL(1-DAYOFWEEK('" + date + "')) DAY))  AND " +
                "'" + date + "' " +
                "GROUP BY u.username " +
                "ORDER BY u.last_name;";

            var player_acute = [];
            connection.query(sql, function (err, result) {
                if (err) throw err;
                player_acute = result;


                sql  = "SELECT u.username, u.first_name, u.last_name, u.position, m.date,  " +
                    "SUM(w.pload) / 4 as chronicSum " +
                    "FROM  master.cata_player_workouts w " +
                    "INNER JOIN master.user u ON u.username = w.username " +
                    "INNER JOIN master.cata_workouts m ON w.workout_id = m.id " +
                    "WHERE w.teamid = '" + teamid[0].teamID + "' " +
                    "AND u.teamID = '" + teamid[0].teamID + "' " +
                    "AND m.date " +
                    "BETWEEN '" + date + "'- INTERVAL 5 WEEK AND" +
                    " '" + date + "' - INTERVAL 1 WEEK " +
                    "GROUP BY u.username " +
                    "ORDER BY u.username; " ;


                var player_chronic = [];
                connection.query(sql, function (err, result) {
                    if (err) throw err;

                    player_chronic = result;

                    sql = "SELECT username, pload, duration FROM master.cata_player_workouts " +
                        "WHERE teamid = '"+teamid[0].teamID+"' " +
                        "AND workout_id IN " +
                        "(SELECT MAX(workout_id) FROM master.cata_player_workouts " +
                        " WHERE teamid = '"+teamid[0].teamID+"');";


                    var player_recent = [];
                    connection.query(sql, function (err, result) {
                        if (err) throw err;


                        player_recent = result;




                        sql = "SELECT u.username, SUM(w.pload) as psum, m.date " +
                            "FROM master.user u, master.cata_player_workouts w, master.cata_workouts m " +
                            "WHERE u.username = w.username " +
                            "AND w.workout_id = m.id " +
                            "AND w.teamid = '"+teamid[0].teamID+"' " +
                            "AND u.teamID = '"+teamid[0].teamID+"' " +
                            "AND m.teamid = '"+teamid[0].teamID+"' " +
                            "AND m.date BETWEEN CURDATE()  - INTERVAL 3 DAY AND CURDATE()  - INTERVAL 1 DAY " +
                            "GROUP BY u.username; ";


                        var player_three = [];
                        connection.query(sql, function (err, result) {
                            if (err) throw err;
                            player_three = result;



                            //TEAM QUERIES//


                            sql = "SELECT u.username, m.date, " +
                                "AVG(w.pload) psum, AVG(w.duration) as dsum, count(distinct u.username) as pcount " +
                                "FROM  master.cata_player_workouts w " +
                                "INNER JOIN master.user u ON u.username = w.username " +
                                "INNER JOIN master.cata_workouts m ON w.workout_id = m.id " +
                                "WHERE w.teamid = '"+teamid[0].teamID+"' " +
                                "AND u.teamID = '"+teamid[0].teamID+"' " +
                                "AND m.date " +
                                "BETWEEN  DATE(DATE_ADD('" + date + "', INTERVAL(1-DAYOFWEEK('" + date + "')) DAY))  AND " +
                                "'" + date + "' " +
                                "GROUP BY m.date;";


                            var team_acute = [];
                            connection.query(sql, function (err, result) {
                                if (err) throw err;

                                team_acute = result;




                                sql  = "SELECT u.username, u.position, m.date,  " +
                                    "AVG(w.pload) as chronicSum, count(distinct u.username) as pcount " +
                                    "FROM  master.cata_player_workouts w " +
                                    "INNER JOIN master.user u ON u.username = w.username " +
                                    "INNER JOIN master.cata_workouts m ON w.workout_id = m.id " +
                                    "WHERE w.teamID = '" + teamid[0].teamID + "' " +
                                    "AND u.teamID = '" + teamid[0].teamID + "' " +
                                    "AND m.date " +
                                    "BETWEEN '" + date + "'- INTERVAL 5 WEEK AND" +
                                    " '" + date + "' - INTERVAL 1 WEEK " +
                                    " GROUP BY m.date; " ;


                                var team_chronic = [];
                                connection.query(sql, function (err, result) {
                                    if (err) throw err;

                                    team_chronic = result;




                                    sql = "SELECT u.username, AVG(w.pload) as psum, m.date " +
                                        "FROM master.user u, master.cata_player_workouts w, master.cata_workouts m " +
                                        "WHERE u.username = w.username " +
                                        "AND w.workout_id = m.id " +
                                        "AND w.teamid = '" + teamid[0].teamID + "' " +
                                        "AND u.teamID = '" + teamid[0].teamID + "' " +
                                        "AND m.teamid = '" + teamid[0].teamID + "' " +
                                        "AND m.date BETWEEN CURDATE()  - INTERVAL 3 DAY AND CURDATE()  - INTERVAL 1 DAY " +
                                        "GROUP BY m.date; ";


                                    var team_three = [];
                                    connection.query(sql, function (err, result) {
                                        if (err) throw err;
                                        team_three = result;


                                        //POSITION QUERIES//


                                        sql = "SELECT u.position, m.date, " +
                                            "AVG(w.pload) psum, AVG(w.duration) as dsum, count(distinct u.username) as pcount " +
                                            "FROM  master.cata_player_workouts w " +
                                            "INNER JOIN master.user u ON u.username = w.username " +
                                            "INNER JOIN master.cata_workouts m ON w.workout_id = m.id " +
                                            "WHERE w.teamid = '"+teamid[0].teamID+"' " +
                                            "AND u.teamID = '"+teamid[0].teamID+"' " +
                                            "AND m.date " +
                                            "BETWEEN  DATE(DATE_ADD('" + date + "', INTERVAL(1-DAYOFWEEK('" + date + "')) DAY))  AND " +
                                            "'" + date + "' " +
                                            "GROUP BY u.position, m.date;";


                                        var position_acute = [];
                                        connection.query(sql, function (err, result) {
                                            if (err) throw err;

                                            position_acute = result;




                                            sql = "SELECT  u.position, m.date,  " +
                                                "AVG(w.pload) as chronicSum, count(distinct u.username) as pcount " +
                                                "FROM  master.cata_player_workouts w " +
                                                "INNER JOIN master.user u ON u.username = w.username " +
                                                "INNER JOIN master.cata_workouts m ON w.workout_id = m.id " +
                                                "WHERE w.teamID = '" + teamid[0].teamID + "' " +
                                                "AND u.teamID = '" + teamid[0].teamID + "' " +
                                                "AND m.date " +
                                                "BETWEEN '" + date + "'- INTERVAL 5 WEEK AND" +
                                                " '" + date + "' - INTERVAL 1 WEEK " +
                                                " GROUP BY u.position, m.date; ";


                                            var position_chronic = [];
                                            connection.query(sql, function (err, result) {
                                                if (err) throw err;

                                                position_chronic = result;




                                                sql = "SELECT u.position, AVG(w.pload) as psum, m.date " +
                                                    "FROM master.user u, master.cata_player_workouts w, master.cata_workouts m " +
                                                    "WHERE u.username = w.username " +
                                                    "AND w.workout_id = m.id " +
                                                    "AND w.teamid = '" + teamid[0].teamID + "' " +
                                                    "AND u.teamID = '" + teamid[0].teamID + "' " +
                                                    "AND m.teamid = '" + teamid[0].teamID + "' " +
                                                    "AND m.date BETWEEN CURDATE()  - INTERVAL 5 DAY AND CURDATE()  - INTERVAL 1 DAY " +
                                                    "GROUP BY u.position, m.date; ";


                                                var position_three = [];
                                                connection.query(sql, function (err, result) {
                                                    if (err) throw err;
                                                    position_three = result;



                                                    res.render('coachCataRecentData', {
                                                        username: req.session.user,
                                                        player_acute: player_acute,
                                                        player_chronic: player_chronic,
                                                        player_recent: player_recent,
                                                        player_three: player_three,
                                                        team_acute: team_acute,
                                                        team_chronic: team_chronic,
                                                        team_three: team_three,
                                                        position_acute: position_acute,
                                                        position_chronic: position_chronic,
                                                        position_three: position_three
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

    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function (err, result) {
        if (err) throw err;

        teamid = result;


        var week_data = [];
        var chronic = [];
        var sql = "SELECT distinct DATE(DATE_ADD(m.date, INTERVAL(1-DAYOFWEEK(m.date)) DAY)) as sunday, " +
            "DATE(DATE_ADD(m.date, INTERVAL(7-DAYOFWEEK(m.date)) DAY)) as saturday " +
            "FROM master.workouts m " +
            "WHERE m.teamID = '"+teamid[0].teamID+"';";


        var week_set = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;

            week_set = result;


            for (var i = 0; i < week_set.length; i++) {
                var sun = week_set[i].sunday;

                sun = sun.toISOString().split('T')[0];

                var sat = week_set[i].saturday;

                sat = sat.toISOString().split('T')[0];

                week_set[i].sunday = sun;
                week_set[i].saturday = sat;

            }

            var team_week_data = [];
            var chronic_position = [];
            var pos_week_data = [];
            var chronic_team = [];
            var acute_position = [];
            var acute_team = [];
            var adg = [];
            var cdg = [];
            var chronic_team_previous = [];
            var chronic_position_previous = [];
            res.render('weeklySummary', {
                username: req.user,
                week_data: week_data,
                chronic_week: chronic,
                week_set: week_set,
                pos_week_data: pos_week_data,
                team_week_data: team_week_data,
                chronic_position: chronic_position,
                chronic_team: chronic_team,
                acute_position: acute_position,
                acute_team: acute_team,
                adg: adg,
                cdg: cdg,
                chronic_team_previous: chronic_team_previous,
                chronic_position_previous: chronic_position_previous
            });


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

    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function (err, result) {
        if (err) throw err;

        teamid = result;




        sql = "SELECT * FROM workouts " +
            "WHERE teamID = '"+teamid[0].teamID+"' " +
            "ORDER BY date DESC LIMIT 10;";

        var recent_dates = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;

            recent_dates = result;

            for(var i = 0; i < recent_dates.length; i++) {

                var day = recent_dates[i].date;

                day = day.toISOString().split('T')[0];

                recent_dates[i].date = day;

                recent_dates[i].date = recent_dates[i].date + " " + recent_dates[i].time + ", " + recent_dates[i].name;


            }








            var workout = [];
            var note = [];


            res.render('adminDailySummary', {
                username: req.session.user,
                recent: recent_dates,
                workout: workout,
                note: note,
                message: ""
            });




        });


    });


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

        var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

        var teamid = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;

            teamid = result;


            sql = "SELECT DATE(DATE_ADD(curdate(), INTERVAL(1-DAYOFWEEK(curdate())) DAY)) as sunday;";
            var s = [];
            connection.query(sql, function (err, result) {
                if (err) throw err;


                s = result;
                var date = s[0].sunday;

                date = date.toISOString().split('T')[0];


                //for Chronic load

                sql = "SELECT u.username, " +
                    "SUM(w.player_sRPE * m.duration) / 4 as chronicSum, m.date " +
                    "FROM master.user u, master.player_workouts w, master.workouts m " +
                    "WHERE u.username = w.username " +
                    "AND w.workoutID = m.workoutid " +
                    "AND w.teamID = '"+teamid[0].teamID+"' " +
                    "AND m.teamID = '"+teamid[0].teamID+"' " +
                    "AND u.teamID = '"+teamid[0].teamID+"' " +
                    "AND m.date " +
                    "BETWEEN '" + date + "'- INTERVAL 4 WEEK AND '" + date + "' " +
                    " GROUP BY u.username;";


                var four_week_data = [];
                connection.query(sql, function (err, result) {
                    if (err) throw err;


                    four_week_data = result;


                    //for acute load and weekly Acute mean sum

                    sql = "SELECT u.username, u.first_name, u.last_name, u.position, " +
                        "SUM(w.player_sRPE * m.duration) as acuteSum, " +
                        "(SUM(w.player_sRPE * m.duration)/dayofweek( CURRENT_DATE() - 1 ) )  as acuteMeanSum " +
                        "FROM master.user u, master.player_workouts w, master.workouts m " +
                        "WHERE u.username = w.username " +
                        "AND w.workoutID = m.workoutid " +
                        "AND w.teamID = '"+teamid[0].teamID+"' " +
                        "AND u.teamID = '"+teamid[0].teamID+"' " +
                        "AND m.teamID = '"+teamid[0].teamID+"' " +
                        "AND yearweek(DATE(m.date), 6) = yearweek(curdate(), 6) " +
                        "GROUP BY u.username; ";


                    var one_week_data = [];
                    connection.query(sql, function (err, result) {
                        if (err) throw err;



                        one_week_data = result;


                        //Holds data for player's RPE scores of current week to calc variance for monotony score

                        sql = "SELECT u.username,u.first_name,w.player_sRPE, m.duration, m.date, " +
                            "(w.player_sRPE * m.duration) as dayLoad " +
                            "FROM master.user u, master.player_workouts w, master.workouts m " +
                            "WHERE u.username = w.username " +
                            "AND w.workoutID = m.workoutid " +
                            "AND w.teamID = '"+teamid[0].teamID+"' " +
                            "AND u.teamID = '"+teamid[0].teamID+"' " +
                            "AND m.teamID = '"+teamid[0].teamID+"' " +
                            "AND yearweek(DATE(m.date), 6) = yearweek(curdate(), 6);";


                        var daily_load = [];
                        connection.query(sql, function (err, result) {
                            if (err) throw err;



                            daily_load = result;


                            //Average RPE score of the most recent session

                            sql = "SELECT p.workoutID, AVG(p.player_sRPE) as sessionRPE, w.duration, " +
                                "(AVG(p.player_sRPE) * w.duration) as sessionLoad " +
                                "FROM master.player_workouts p, master.workouts w " +
                                "WHERE p.workoutID = w.workoutid " +
                                "AND p.teamID = '"+teamid[0].teamID+"' " +
                                "AND w.teamID = '"+teamid[0].teamID+"' " +
                                "GROUP BY workoutID DESC LIMIT 1; ";


                            var session = [];
                            connection.query(sql, function (err, result) {
                                if (err) throw err;



                                session = result;


                                //rolling three day load query

                                sql = "SELECT u.username,u.first_name,w.player_sRPE, m.duration, m.date, " +
                                    "(w.player_sRPE * m.duration) as dayLoad " +
                                    "FROM master.user u, master.player_workouts w, master.workouts m " +
                                    "WHERE u.username = w.username " +
                                    "AND w.workoutID = m.workoutid " +
                                    "AND w.teamID = '"+teamid[0].teamID+"' " +
                                    "AND u.teamID = '"+teamid[0].teamID+"' " +
                                    "AND m.teamID = '"+teamid[0].teamID+"' " +
                                    "AND m.date BETWEEN CURDATE()  - INTERVAL 3 DAY AND CURDATE()  - INTERVAL 1 DAY; ";


                                var three_days = [];
                                connection.query(sql, function (err, result) {
                                    if (err) throw err;



                                    three_days = result;


                                    //Most recent RPE scores - used for FLAGS and

                                    sql = "SELECT * FROM master.player_workouts " +
                                        "WHERE teamID = '"+teamid[0].teamID+"' " +
                                        "AND workoutID IN " +
                                        "(SELECT MAX(workoutID) FROM master.player_workouts);";


                                    var current_rpe = [];
                                    connection.query(sql, function (err, result) {
                                        if (err) throw err;


                                        current_rpe = result;


                                        //next couple queries are for the team database

                                        //Team Chronic Load Sum - t group designation
                                        sql = " SELECT u.username, " +
                                        "SUM(w.player_sRPE * m.duration) as chronicSum, m.date, SUM(m.duration) as duration_sum," +
                                            " COUNT(distinct u.username) as player_count " +
                                        "FROM master.user u, master.player_workouts w, master.workouts m " +
                                        "WHERE u.username = w.username " +
                                        "AND w.workoutID = m.workoutid " +
                                        "AND w.teamID = '"+teamid[0].teamID+"' " +
                                        "AND m.teamID = '"+teamid[0].teamID+"'  " +
                                        "AND u.teamID = '"+teamid[0].teamID+"' " +
                                        "AND u.group_chronic = 't' " +
                                        "AND m.date " +
                                        "BETWEEN '" + date + "'- INTERVAL 4 WEEK AND '" + date + "' " +
                                        "; ";



                                        var teamChronicRPE = [];
                                        connection.query(sql, function (err, result) {
                                            if (err) throw err;



                                            teamChronicRPE = result;




                                            //Team Acute Load with t designation
                                            sql = "SELECT u.username, "+
                                            "SUM(w.player_sRPE * m.duration) as chronicSum, m.date, SUM(m.duration) as duration_sum," +
                                            " COUNT(distinct u.username) as player_count " +
                                            "FROM master.user u, master.player_workouts w, master.workouts m " +
                                            "WHERE u.username = w.username " +
                                            "AND w.workoutID = m.workoutid " +
                                            "AND w.teamID = '"+teamid[0].teamID+"' " +
                                            "AND m.teamID = '"+teamid[0].teamID+"' " +
                                            "AND u.teamID = '"+teamid[0].teamID+"' " +
                                            "AND u.group_chronic = 't' " +
                                            "AND yearweek(DATE(m.date), 6) = yearweek(curdate(), 6) " +
                                            ";";



                                            var teamAcuteRPE = [];
                                            connection.query(sql, function (err, result) {
                                                if (err) throw err;

                                                teamAcuteRPE = result;


                                                sql = "SELECT u.position, "+
                                                    "SUM(w.player_sRPE * m.duration) as chronicSum, m.date, " +
                                                    "COUNT(distinct u.username) as player_count, SUM(m.duration) as duration_sum " +
                                                    "FROM master.user u, master.player_workouts w, master.workouts m " +
                                                    "WHERE u.username = w.username " +
                                                    "AND w.workoutID = m.workoutid " +
                                                    "AND w.teamID = '"+teamid[0].teamID+"' " +
                                                    "AND m.teamID = '"+teamid[0].teamID+"' " +
                                                    "AND u.teamID = '"+teamid[0].teamID+"' " +
                                                    "AND u.group_chronic = 't' " +
                                                    "AND m.date " +
                                                    "BETWEEN '" + date + "'- INTERVAL 4 WEEK AND '" + date + "' " +
                                                    "GROUP BY  u.position;";


                                                var chronicPosition = [];
                                                connection.query(sql, function (err, result) {
                                                    if (err) throw err;


                                                    chronicPosition = result;


                                                    sql = "SELECT u.position, "+
                                                        "SUM(w.player_sRPE * m.duration) as chronicSum, m.date, " +
                                                        "COUNT(distinct u.username) as player_count, SUM(m.duration) as duration_sum " +
                                                        "FROM master.user u, master.player_workouts w, master.workouts m " +
                                                        "WHERE u.username = w.username " +
                                                        "AND w.workoutID = m.workoutid " +
                                                        "AND w.teamID = '"+teamid[0].teamID+"' " +
                                                        "AND m.teamID = '"+teamid[0].teamID+"' " +
                                                        "AND u.teamID = '"+teamid[0].teamID+"' " +
                                                        "AND u.group_chronic = 't' " +
                                                        "AND yearweek(DATE(m.date), 6) = yearweek(curdate(), 6) " +
                                                        "GROUP BY  u.position;";


                                                    var acutePosition = [];
                                                    connection.query(sql, function (err, result) {
                                                        if (err) throw err;


                                                        acutePosition = result;




                                                        sql = "SELECT t1.*, t3.duration " +
                                                            "FROM master.player_workouts t1, master.workouts t3 " +
                                                            "WHERE t1.workoutID = (SELECT MAX(t2.workoutID) " +
                                                            "FROM master.player_workouts t2 " +
                                                            "WHERE t2.username = t1.username) " +
                                                            "AND t3.workoutid = (SELECT MAX(t2.workoutID) " +
                                                            "FROM master.player_workouts t2 " +
                                                            "WHERE t2.username = t1.username)" +
                                                            "AND t1.teamID = '"+teamid[0].teamID+"';";


                                                        var recent_rpe = [];
                                                        connection.query(sql, function (err, result) {
                                                            if (err) throw err;


                                                            recent_rpe = result;

                                                            sql = "SELECT u.position " +
                                                                "FROM master.player_workouts p " +
                                                                "INNER JOIN master.user u ON p.username = u.username " +
                                                                "WHERE p.teamID = '"+teamid[0].teamID+"' " +
                                                                "AND u.teamID = '"+teamid[0].teamID+"' " +
                                                                "GROUP BY u.position;";

                                                            var position = [];
                                                            connection.query(sql, function (err, result) {
                                                                if (err) throw err;


                                                                position = result;



                                                                sql = "SELECT u.username, u.position, "+
                                                                    "SUM(w.player_sRPE * m.duration) as chronicSum, m.date, " +
                                                                    "COUNT(distinct u.username) as player_count, " +
                                                                    "SUM(m.duration) as duration_sum " +
                                                                    "FROM master.user u, master.player_workouts w, master.workouts m " +
                                                                    "WHERE u.username = w.username " +
                                                                    "AND w.workoutID = m.workoutid " +
                                                                    "AND w.teamID = '"+teamid[0].teamID+"' " +
                                                                    "AND m.teamID = '"+teamid[0].teamID+"' " +
                                                                    "AND u.teamID = '"+teamid[0].teamID+"' " +
                                                                    "AND u.group_chronic = 't' " +
                                                                    "AND m.date BETWEEN CURDATE()  - INTERVAL 3 DAY AND CURDATE()  - INTERVAL 1 DAY " +
                                                                    "GROUP by u.position; ";


                                                                var threeDayPosition = [];
                                                                connection.query(sql, function (err, result) {
                                                                    if (err) throw err;


                                                                    threeDayPosition = result;


                                                                    sql = "SELECT u.username, "+
                                                                        "SUM(w.player_sRPE * m.duration) as chronicSum, m.date, " +
                                                                        "COUNT(distinct u.username) as player_count, " +
                                                                        "SUM(m.duration) as duration_sum " +
                                                                        "FROM master.user u, master.player_workouts w, master.workouts m " +
                                                                        "WHERE u.username = w.username " +
                                                                        "AND w.workoutID = m.workoutid " +
                                                                        "AND w.teamID = '"+teamid[0].teamID+"' " +
                                                                        "AND m.teamID = '"+teamid[0].teamID+"' " +
                                                                        "AND u.teamID = '"+teamid[0].teamID+"' " +
                                                                        "AND u.group_chronic = 't' " +
                                                                        "AND m.date BETWEEN CURDATE()  - INTERVAL 3 DAY AND CURDATE()  - INTERVAL 1 DAY; ";

                                                                    var threeDayTeam = [];
                                                                    connection.query(sql, function (err, result) {
                                                                        if (err) throw err;


                                                                        threeDayTeam = result;



                                                                       res.render('coachDashboard', {
                                                                            username: req.session.user,
                                                                            chronicPlayerLoad: four_week_data,
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
                                                                            groupPos: position,
                                                                            threeDayPosition: threeDayPosition,
                                                                            threeDayTeam: threeDayTeam
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


        });

    });



});

//Admin Group Control
app.get('/adminGroupControl', requireLogin, function(req, res, next) {

    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function (err, result) {
        if (err) throw err;

        teamid = result;


        sql = "SELECT * from master.user " +
            "where teamID = '"+teamid[0].teamID+"' " +
            "and privileges = 'Player'" +
            "ORDER BY last_name;";

        var players = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;

            players = result;


            sql = "select * from master.group_designation;";

            var groups = [];
            connection.query(sql, function(err, result) {
                groups = result;


                res.render('adminGroupControl', {
                    username: req.session.user,
                    players: players,
                    groups: groups
                });

            });
        });

    });
});

//Admin Settings
app.get('/adminSettings', requireLogin, function(req, res, next) {

    var sql = "select * from master.group_designation;";

    var groups = [];
    connection.query(sql, function(err, result) {
        groups = result;

        res.render('adminSettings', {
            username: req.session.user,
            message_add: "",
            groups: groups,
            message_delete: ""
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
            if (result[0].privileges === "Admin") {


                res.render('adminHome', {
                    username: req.session.user
                });

            }

            else if(result[0].privileges === "Coach")
            {
                res.render('coachHome', {
                    username: req.session.user
                });
            }

            else if(result[0].privileges === "Nutrition")
            {
                sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

                var teamid = [];
                connection.query(sql, function (err, result) {
                    if (err) throw err;

                    teamid = result;

                    sql = "select MAX(mealID) as max from master.meals " +
                        "where teamID = '"+teamid[0].teamID+"' and status = 'open';";

                    connection.query(sql, function (err, result) {
                        if (err) throw err;

                        if(!result[0].max)
                        {
                            res.render('nutritionHome', {
                                username: req.session.user,
                                active: "0"
                            });
                        }
                        else
                        {
                            res.render('nutritionHome', {
                                username: req.session.user,
                                active: "1"
                            });
                        }



                    });

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
