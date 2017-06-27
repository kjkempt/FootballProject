/**
 * Created by kemptk on 6/18/17.
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
    if (err) throw err;
    console.log("Connected! CD");
});

router.post('/selectWeek', function(req, res, next) {

    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function(err, result) {

        teamid = result;

        sql = "SELECT u.username, u.first_name, u.last_name, u.position, m.date, dayofweek(m.date) as indexday, " +
            "w.player_sRPE, m.duration, m.time " +
            "FROM  master.player_workouts w " +
            "INNER JOIN master.user u ON u.username = w.username " +
            "INNER JOIN master.workouts m ON w.workoutID = m.workoutid " +
            "WHERE w.teamID = '"+teamid[0].teamID+"' " +
            "AND u.teamID = '"+teamid[0].teamID+"' " +
            "AND m.teamID = '"+teamid[0].teamID+"' " +
            "AND m.date " +
            "BETWEEN  DATE(DATE_ADD('" + req.body.week_select + "', INTERVAL(1-DAYOFWEEK('" + req.body.week_select + "')) DAY))  AND " +
            " '" + req.body.week_select + "' " +
            "   ORDER BY u.username, indexday;";



        var week_data = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;


            week_data = result;


            sql = "SELECT u.username, u.first_name, u.last_name, u.position, " +
                "SUM(w.player_sRPE * m.duration) as chronicSum, m.date," +
                "(weekofyear('" + req.body.week_select + "') - weekofyear(m.date) + 1) as weekcount  " +
                "FROM master.user u, master.player_workouts w, master.workouts m " +
                "WHERE u.username = w.username " +
                "AND w.teamID = '"+teamid[0].teamID+"' " +
                "AND u.teamID = '"+teamid[0].teamID+"' " +
                "AND m.teamID = '"+teamid[0].teamID+"' " +
                "AND w.workoutID = m.workoutid " +
                "AND m.date " +
                "BETWEEN '" + req.body.week_select + "'- INTERVAL 4 WEEK AND '" + req.body.week_select + "' " +
                "GROUP BY u.username;";

            var chronic = [];
            connection.query(sql, function (err, result) {
                if (err) throw err;


                chronic = result;


                sql = "SELECT distinct DATE(DATE_ADD(m.date, INTERVAL(1-DAYOFWEEK(m.date)) DAY)) as sunday, " +
                    "DATE(DATE_ADD(m.date, INTERVAL(7-DAYOFWEEK(m.date)) DAY)) as saturday " +
                    "FROM master.workouts m " +
                    "WHERE m.teamID = '"+teamid[0].teamID+"' ;";


                var week_set = [];
                connection.query(sql, function (err, result) {
                    if (err) throw err;

                    week_set = result;


                    //this splits the string to just have the date be in YYYY-MM-DD format for the queries

                    for (var i = 0; i < week_set.length; i++) {
                        var sun = week_set[i].sunday;

                        sun = sun.toISOString().split('T')[0];

                        var sat = week_set[i].saturday;

                        sat = sat.toISOString().split('T')[0];

                        week_set[i].sunday = sun;
                        week_set[i].saturday = sat;

                    }


                    res.render('coachWeeklySummary', {
                        username: req.user,
                        week_data: week_data,
                        chronic_week: chronic,
                        week_set: week_set
                    });

                });
            });


        });

    });






});