/**
 * Created by kemptk on 6/9/17.
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


router.post('/dailySum', function(req, res, next) {

    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function(err, result) {

        teamid = result;

//insert query below inserts form data into workouts database with the submitted workout info
        sql = "SELECT * FROM master.player_workouts p " +
            "INNER JOIN master.user u ON u.username = p.username " +
            "WHERE workoutID = '" + req.body.date_select + "'" +
            "AND p.teamID = '" + teamid[0].teamID + "' " +
            "AND p.teamID = '" + teamid[0].teamID + "'; ";

//query changes ****

        var workout = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;

            workout = result;


            sql = "SELECT * FROM workouts " +
                "WHERE teamID = '" + teamid[0].teamID + "' " +
                "ORDER BY date DESC LIMIT 10;";
            var recent_dates = [];
            connection.query(sql, function (err, result) {
                if (err) throw err;

                recent_dates = result;


                 sql = "SELECT notes, duration FROM workouts WHERE workoutid = '" + req.body.date_select + "'" +
                    "AND teamID = '" + teamid[0].teamID + "';";

                var note = [];
                connection.query(sql, function (err, result) {
                    if (err) throw err;

                    note = result;

                    res.render('adminDailySummary', {
                        username: req.user,
                        workout: workout,
                        recent: recent_dates,
                        note: note
                    });

                });


            });

        });


    });


});


router.post('/playerNote', function(req, res, next) {

    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function(err, result) {

        teamid = result;


        sql = "UPDATE master.player_workouts " +
            "SET pwnotes = '" + req.body.notes + "' " +
            "WHERE username = '" + req.body.player_note + "' AND workoutID = '" + req.body.workout_id + "' " +
            "AND teamID = '" + teamid[0].teamID + "';";

        connection.query(sql, function (err, result) {
            if (err) throw err;

            sql = "SELECT * FROM master.player_workouts p " +
                "INNER JOIN master.user u ON u.username = p.username " +
                "WHERE workoutID = '" + req.body.workout_id + "' " +
                "AND p.teamID = '" + teamid[0].teamID + "' " +
                "AND u.teamID = '" + teamid[0].teamID + "';";

            //query changes ****

            var workout = [];
            connection.query(sql, function (err, result) {
                if (err) throw err;

                workout = result;


                sql = "SELECT * FROM workouts " +
                    "WHERE teamID = '" + teamid[0].teamID + "' " +
                    "ORDER BY date DESC LIMIT 10;";
                var recent_dates = [];
                connection.query(sql, function (err, result) {
                    if (err) throw err;

                    recent_dates = result;


                    var sql = "SELECT notes, duration FROM workouts WHERE workoutid = '" + req.body.workout_id + "' " +
                    "AND teamID = '" + teamid[0].teamID + "';";

                    var note = [];
                    connection.query(sql, function (err, result) {
                        if (err) throw err;

                        note = result;

                        res.render('adminDailySummary', {
                            username: req.user,
                            workout: workout,
                            recent: recent_dates,
                            note: note
                        });

                    });


                });

            });

        });


    });





});


