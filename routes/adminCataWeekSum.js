/**
 * Created by kemptk on 7/24/17.
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



            sql = "SELECT u.username, u.first_name, u.last_name, u.position, m.date, dayofweek(m.date) as indexday, " +
                "w.pload, w.duration " +
                "FROM  master.cata_player_workouts w " +
                "INNER JOIN master.user u ON u.username = w.username " +
                "INNER JOIN master.cata_workouts m ON w.workout_id = m.id " +
                "WHERE w.teamID = '"+teamid[0].teamID+"' " +
                "AND u.teamID = '"+teamid[0].teamID+"' " +
                "AND m.date " +
                "BETWEEN  DATE(DATE_ADD('"+req.body.week_select+"', INTERVAL(1-DAYOFWEEK('"+req.body.week_select+"')) DAY))  AND " +
                "'"+req.body.week_select+"' " +
                "ORDER BY u.last_name, indexday;";


            var player_day = [];
            connection.query(sql, function (err, result) {
                if (err) throw err;

                player_day = result;

                player_day[0].date = req.body.week_select;






                sql = "SELECT u.username, u.first_name, u.last_name, u.position, m.date, " +
                    "SUM(w.pload) as psum, SUM(w.duration) as dsum " +
                    "FROM  master.cata_player_workouts w " +
                    "INNER JOIN master.user u ON u.username = w.username " +
                    "INNER JOIN master.cata_workouts m ON w.workout_id = m.id " +
                    "WHERE w.teamID = '" + teamid[0].teamID + "' " +
                    "AND u.teamID = '" + teamid[0].teamID + "' " +
                    "AND m.date " +
                    "BETWEEN  DATE(DATE_ADD('" + req.body.week_select + "', INTERVAL(1-DAYOFWEEK('" + req.body.week_select + "')) DAY))  AND " +
                    "'" + req.body.week_select + "' " +
                    "GROUP BY u.username " +
                    "ORDER BY u.last_name;";


                var player_acute = [];
                connection.query(sql, function (err, result) {
                    if (err) throw err;

                    player_acute = result;


                    sql  = "SELECT u.username, u.position, m.date,  " +
                        "SUM(w.pload) / 4 as chronicSum " +
                        "FROM  master.cata_player_workouts w " +
                        "INNER JOIN master.user u ON u.username = w.username " +
                        "INNER JOIN master.cata_workouts m ON w.workout_id = m.id " +
                        "WHERE w.teamID = '" + teamid[0].teamID + "' " +
                        "AND u.teamID = '" + teamid[0].teamID + "' " +
                        "AND m.date " +
                        "BETWEEN '" + req.body.week_select + "'- INTERVAL 5 WEEK AND" +
                        " '" + req.body.week_select + "' - INTERVAL 1 WEEK " +
                        "GROUP BY u.username " +
                        "ORDER BY u.username; " ;


                    var player_chronic = [];
                    connection.query(sql, function (err, result) {
                        if (err) throw err;

                        player_chronic = result;



                        player_chart = [];
                        res.render('adminCataWeekSum', {
                            username: req.user,
                            week_set: week_set,
                            player_day: player_day,
                            player_acute: player_acute,
                            player_chronic: player_chronic,
                            player_chart: player_chart
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



            sql = "SELECT u.username, u.first_name, u.last_name, u.position, m.date, dayofweek(m.date) as indexday, " +
                "w.pload, w.duration " +
                "FROM  master.cata_player_workouts w " +
                "INNER JOIN master.user u ON u.username = w.username " +
                "INNER JOIN master.cata_workouts m ON w.workout_id = m.id " +
                "WHERE w.teamID = '"+teamid[0].teamID+"' " +
                "AND u.teamID = '"+teamid[0].teamID+"' " +
                "AND m.date " +
                "BETWEEN  DATE(DATE_ADD('"+req.body.week_select+"', INTERVAL(1-DAYOFWEEK('"+req.body.week_select+"')) DAY))  AND " +
                "'"+req.body.week_select+"' " +
                "ORDER BY u.last_name, indexday;";


            var player_day = [];
            connection.query(sql, function (err, result) {
                if (err) throw err;

                player_day = result;
                player_day[0].date = req.body.week_select;





                sql = "SELECT u.username, u.first_name, u.last_name, u.position, m.date, " +
                    "SUM(w.pload) as psum, SUM(w.duration) as dsum " +
                    "FROM  master.cata_player_workouts w " +
                    "INNER JOIN master.user u ON u.username = w.username " +
                    "INNER JOIN master.cata_workouts m ON w.workout_id = m.id " +
                    "WHERE w.teamID = '" + teamid[0].teamID + "' " +
                    "AND u.teamID = '" + teamid[0].teamID + "' " +
                    "AND m.date " +
                    "BETWEEN  DATE(DATE_ADD('" + req.body.week_select + "', INTERVAL(1-DAYOFWEEK('" + req.body.week_select + "')) DAY))  AND " +
                    "'" + req.body.week_select + "' " +
                    "GROUP BY u.username " +
                    "ORDER BY u.last_name;";


                var player_acute = [];
                connection.query(sql, function (err, result) {
                    if (err) throw err;

                    player_acute = result;


                    sql  = "SELECT u.username, u.position, m.date,  " +
                        "SUM(w.pload) / 4 as chronicSum " +
                        "FROM  master.cata_player_workouts w " +
                        "INNER JOIN master.user u ON u.username = w.username " +
                        "INNER JOIN master.cata_workouts m ON w.workout_id = m.id " +
                        "WHERE w.teamID = '" + teamid[0].teamID + "' " +
                        "AND u.teamID = '" + teamid[0].teamID + "' " +
                        "AND m.date " +
                        "BETWEEN '" + req.body.week_select + "'- INTERVAL 5 WEEK AND" +
                        " '" + req.body.week_select + "' - INTERVAL 1 WEEK " +
                        "GROUP BY u.username " +
                        "ORDER BY u.username; " ;


                    var player_chronic = [];
                    connection.query(sql, function (err, result) {
                        if (err) throw err;

                        player_chronic = result;



                        sql = "SELECT u.username, u.first_name, u.last_name, u.position, m.date, dayofweek(m.date) as indexday, " +
                            "w.pload, w.duration " +
                            "FROM  master.cata_player_workouts w " +
                            "INNER JOIN master.user u ON u.username = w.username " +
                            "INNER JOIN master.cata_workouts m ON w.workout_id = m.id " +
                            "WHERE w.teamID = '"+teamid[0].teamID+"' " +
                            "AND u.teamID = '"+teamid[0].teamID+"' " +
                            "AND u.username = '"+req.body.player_select+"' " +
                            "AND m.date " +
                            "BETWEEN  DATE(DATE_ADD('"+req.body.week_select+"', INTERVAL(1-DAYOFWEEK('"+req.body.week_select+"')) DAY))  AND " +
                            "'"+req.body.week_select+"' " +
                            "ORDER BY u.last_name, indexday;";


                        var player_chart = [];
                        connection.query(sql, function (err, result) {
                            if (err) throw err;

                            player_chart = result;




                            res.render('adminCataWeekSum', {
                                username: req.user,
                                week_set: week_set,
                                player_day: player_day,
                                player_acute: player_acute,
                                player_chronic: player_chronic,
                                player_chart: player_chart
                            });



                        });



                    });


                });


            });




        });


    });



});