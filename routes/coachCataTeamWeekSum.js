/**
 * Created by kemptk on 7/21/17.
 */
var express = require('express');
var router = express.Router();

module.exports = router;

var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'footballdb.cr1jtswtem4i.us-west-2.rds.amazonaws.com',
    user     : 'masterUsername',
    password : 'HNuxJSEjqXUS!auk-eRV6CG8+!^JJAt2M?-Lc4y#+',
    database : 'master'
});


connection.connect(function(err) {
    console.log("Connected! CD");
});


router.post('/selectWeek', function(req, res, next) {

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



            sql = "SELECT u.username, m.date, dayofweek(m.date) as indexday, " +
                "AVG(w.pload) psum, AVG(w.duration) as dsum, count(distinct u.username) as pcount " +
                "FROM  master.cata_player_workouts w " +
                "INNER JOIN master.user u ON u.username = w.username " +
                "INNER JOIN master.cata_workouts m ON w.workout_id = m.id " +
                "WHERE w.teamID = '"+teamid[0].teamID+"' " +
                "AND u.teamID = '"+teamid[0].teamID+"' " +
                "AND m.date " +
                "BETWEEN  DATE(DATE_ADD('"+req.body.week_select+"', INTERVAL(1-DAYOFWEEK('"+req.body.week_select+"')) DAY))  AND " +
                "'"+req.body.week_select+"' " +
                "GROUP BY indexday;";


            var team_day = [];
            connection.query(sql, function (err, result) {
                if (err) throw err;

                team_day = result;

                team_day[0].date = req.body.week_select;








                sql = "SELECT u.username, m.date, dayofweek(m.date) as indexday, " +
                    "AVG(w.pload) psum, AVG(w.duration) as dsum, count(distinct u.username) as pcount " +
                    "FROM  master.cata_player_workouts w " +
                    "INNER JOIN master.user u ON u.username = w.username " +
                    "INNER JOIN master.cata_workouts m ON w.workout_id = m.id " +
                    "WHERE w.teamID = '"+teamid[0].teamID+"' " +
                    "AND u.teamID = '"+teamid[0].teamID+"' " +
                    "AND m.date " +
                    "BETWEEN  DATE(DATE_ADD('"+req.body.week_select+"', INTERVAL(1-DAYOFWEEK('"+req.body.week_select+"')) DAY))  AND " +
                    "'"+req.body.week_select+"' " +
                    "GROUP BY indexday;";


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
                        "BETWEEN '" + req.body.week_select + "'- INTERVAL 5 WEEK AND" +
                        " '" + req.body.week_select + "' - INTERVAL 1 WEEK " +
                        " GROUP BY m.date; " ;


                    var team_chronic = [];
                    connection.query(sql, function (err, result) {
                        if (err) throw err;

                        team_chronic = result;


                        sql = "SELECT u.position, m.date, dayofweek(m.date) as indexday, " +
                            "AVG(w.pload) psum, AVG(w.duration) as dsum, count(distinct u.username) as pcount " +
                            "FROM  master.cata_player_workouts w " +
                            "INNER JOIN master.user u ON u.username = w.username " +
                            "INNER JOIN master.cata_workouts m ON w.workout_id = m.id " +
                            "WHERE w.teamID = '"+teamid[0].teamID+"' " +
                            "AND u.teamID = '"+teamid[0].teamID+"' " +
                            "AND m.date " +
                            "BETWEEN  DATE(DATE_ADD('"+req.body.week_select+"', INTERVAL(1-DAYOFWEEK('"+req.body.week_select+"')) DAY))  AND " +
                            "'"+req.body.week_select+"' " +
                            "GROUP BY u.position, indexday;";


                        var position_day = [];
                        connection.query(sql, function (err, result) {
                            if (err) throw err;

                            position_day = result;


                            sql = "SELECT u.position, m.date, dayofweek(m.date) as indexday, " +
                                "AVG(w.pload) psum, AVG(w.duration) as dsum, count(distinct u.username) as pcount " +
                                "FROM  master.cata_player_workouts w " +
                                "INNER JOIN master.user u ON u.username = w.username " +
                                "INNER JOIN master.cata_workouts m ON w.workout_id = m.id " +
                                "WHERE w.teamID = '"+teamid[0].teamID+"' " +
                                "AND u.teamID = '"+teamid[0].teamID+"' " +
                                "AND m.date " +
                                "BETWEEN  DATE(DATE_ADD('"+req.body.week_select+"', INTERVAL(1-DAYOFWEEK('"+req.body.week_select+"')) DAY))  AND " +
                                "'"+req.body.week_select+"' " +
                                "GROUP BY u.position, indexday;";


                            var position_acute = [];
                            connection.query(sql, function (err, result) {
                                if (err) throw err;

                                position_acute = result;


                                sql = "SELECT u.username, u.position, m.date,  " +
                                    "AVG(w.pload) as chronicSum, count(distinct u.username) as pcount " +
                                    "FROM  master.cata_player_workouts w " +
                                    "INNER JOIN master.user u ON u.username = w.username " +
                                    "INNER JOIN master.cata_workouts m ON w.workout_id = m.id " +
                                    "WHERE w.teamID = '" + teamid[0].teamID + "' " +
                                    "AND u.teamID = '" + teamid[0].teamID + "' " +
                                    "AND m.date " +
                                    "BETWEEN '" + req.body.week_select + "'- INTERVAL 5 WEEK AND" +
                                    " '" + req.body.week_select + "' - INTERVAL 1 WEEK " +
                                    " GROUP BY u.position, m.date; ";


                                var position_chronic = [];
                                connection.query(sql, function (err, result) {
                                    if (err) throw err;

                                    position_chronic = result;




                                    team_chart = [];
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
                    });
                });
            });
        });
    });



});


router.post('/selectPlayer', function(req, res, next) {

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




            sql = "SELECT u.username, m.date, dayofweek(m.date) as indexday, " +
                "AVG(w.pload) psum, AVG(w.duration) as dsum, count(distinct u.username) as pcount " +
                "FROM  master.cata_player_workouts w " +
                "INNER JOIN master.user u ON u.username = w.username " +
                "INNER JOIN master.cata_workouts m ON w.workout_id = m.id " +
                "WHERE w.teamID = '"+teamid[0].teamID+"' " +
                "AND u.teamID = '"+teamid[0].teamID+"' " +
                "AND m.date " +
                "BETWEEN  DATE(DATE_ADD('"+req.body.week_select+"', INTERVAL(1-DAYOFWEEK('"+req.body.week_select+"')) DAY))  AND " +
                "'"+req.body.week_select+"' " +
                "GROUP BY indexday;";


            var team_day = [];
            connection.query(sql, function (err, result) {
                if (err) throw err;

                team_day = result;

                team_day[0].date = req.body.week_select;


                sql = "SELECT u.username, m.date, dayofweek(m.date) as indexday, " +
                    "AVG(w.pload) psum, AVG(w.duration) as dsum, count(distinct u.username) as pcount " +
                    "FROM  master.cata_player_workouts w " +
                    "INNER JOIN master.user u ON u.username = w.username " +
                    "INNER JOIN master.cata_workouts m ON w.workout_id = m.id " +
                    "WHERE w.teamID = '"+teamid[0].teamID+"' " +
                    "AND u.teamID = '"+teamid[0].teamID+"' " +
                    "AND m.date " +
                    "BETWEEN  DATE(DATE_ADD('"+req.body.week_select+"', INTERVAL(1-DAYOFWEEK('"+req.body.week_select+"')) DAY))  AND " +
                    "'"+req.body.week_select+"' " +
                    "GROUP BY indexday;";


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
                        "BETWEEN '" + req.body.week_select + "'- INTERVAL 5 WEEK AND" +
                        " '" + req.body.week_select + "' - INTERVAL 1 WEEK " +
                        " GROUP BY m.date; " ;


                    var team_chronic = [];
                    connection.query(sql, function (err, result) {
                        if (err) throw err;

                        team_chronic = result;


                        sql = "SELECT u.position, m.date, dayofweek(m.date) as indexday, " +
                            "AVG(w.pload) psum, AVG(w.duration) as dsum, count(distinct u.username) as pcount " +
                            "FROM  master.cata_player_workouts w " +
                            "INNER JOIN master.user u ON u.username = w.username " +
                            "INNER JOIN master.cata_workouts m ON w.workout_id = m.id " +
                            "WHERE w.teamID = '"+teamid[0].teamID+"' " +
                            "AND u.teamID = '"+teamid[0].teamID+"' " +
                            "AND m.date " +
                            "BETWEEN  DATE(DATE_ADD('"+req.body.week_select+"', INTERVAL(1-DAYOFWEEK('"+req.body.week_select+"')) DAY))  AND " +
                            "'"+req.body.week_select+"' " +
                            "GROUP BY u.position, indexday;";


                        var position_day = [];
                        connection.query(sql, function (err, result) {
                            if (err) throw err;

                            position_day = result;


                            sql = "SELECT u.position, m.date, dayofweek(m.date) as indexday, " +
                                "AVG(w.pload) psum, AVG(w.duration) as dsum, count(distinct u.username) as pcount " +
                                "FROM  master.cata_player_workouts w " +
                                "INNER JOIN master.user u ON u.username = w.username " +
                                "INNER JOIN master.cata_workouts m ON w.workout_id = m.id " +
                                "WHERE w.teamID = '" + teamid[0].teamID + "' " +
                                "AND u.teamID = '" + teamid[0].teamID + "' " +
                                "AND m.date " +
                                "BETWEEN  DATE(DATE_ADD('" + req.body.week_select + "', INTERVAL(1-DAYOFWEEK('" + req.body.week_select + "')) DAY))  AND " +
                                "'" + req.body.week_select + "' " +
                                "GROUP BY u.position, indexday;";


                            var position_acute = [];
                            connection.query(sql, function (err, result) {
                                if (err) throw err;

                                position_acute = result;


                                sql = "SELECT u.username, u.position, m.date,  " +
                                    "AVG(w.pload) as chronicSum, count(distinct u.username) as pcount " +
                                    "FROM  master.cata_player_workouts w " +
                                    "INNER JOIN master.user u ON u.username = w.username " +
                                    "INNER JOIN master.cata_workouts m ON w.workout_id = m.id " +
                                    "WHERE w.teamID = '" + teamid[0].teamID + "' " +
                                    "AND u.teamID = '" + teamid[0].teamID + "' " +
                                    "AND m.date " +
                                    "BETWEEN '" + req.body.week_select + "'- INTERVAL 5 WEEK AND" +
                                    " '" + req.body.week_select + "' - INTERVAL 1 WEEK " +
                                    " GROUP BY u.position, m.date; ";


                                var position_chronic = [];
                                connection.query(sql, function (err, result) {
                                    if (err) throw err;

                                    position_chronic = result;


                                    if (req.body.player_select === "Team") {

                                        var team_chart = team_day;
                                        team_chart[0].username = "Team";


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

                                    }
                                    else {
                                        sql = "SELECT u.position, m.date, dayofweek(m.date) as indexday, " +
                                            "AVG(w.pload) psum, AVG(w.duration) as dsum, count(distinct u.username) as pcount " +
                                            "FROM  master.cata_player_workouts w " +
                                            "INNER JOIN master.user u ON u.username = w.username " +
                                            "INNER JOIN master.cata_workouts m ON w.workout_id = m.id " +
                                            "WHERE w.teamID = '"+teamid[0].teamID+"' " +
                                            "AND u.teamID = '"+teamid[0].teamID+"' " +
                                            "AND u.position = '"+req.body.player_select+"' " +
                                            "AND m.date " +
                                            "BETWEEN  DATE(DATE_ADD('"+req.body.week_select+"', INTERVAL(1-DAYOFWEEK('"+req.body.week_select+"')) DAY))  AND " +
                                            "'"+req.body.week_select+"' " +
                                            "GROUP BY u.position, indexday;";


                                        var team_chart = [];
                                        connection.query(sql, function (err, result) {
                                            if (err) throw err;

                                            team_chart = result;


                                            team_chart[0].username = req.body.player_select;


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
                                    }

                                });
                            });
                        });
                    });
                });
            });
        });
    });



});