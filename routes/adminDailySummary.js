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
            "AND u.teamID = '" + teamid[0].teamID + "' " +
            "ORDER BY u.last_name; ";

//query changes ****

        var workout = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;

            workout = result;



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


                 sql = "SELECT notes, duration, sRPE, pre_sRPE FROM workouts WHERE workoutid = '" + req.body.date_select + "'" +
                    "AND teamID = '" + teamid[0].teamID + "';";

                var note = [];
                connection.query(sql, function (err, result) {
                    if (err) throw err;

                    note = result;

                    res.render('adminDailySummary', {
                        username: req.user,
                        workout: workout,
                        recent: recent_dates,
                        note: note,
                        message: ""
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


                    var sql = "SELECT notes, duration, sRPE, pre_sRPE FROM workouts WHERE workoutid = '" + req.body.workout_id + "' " +
                    "AND teamID = '" + teamid[0].teamID + "';";

                    var note = [];
                    connection.query(sql, function (err, result) {
                        if (err) throw err;

                        note = result;

                        res.render('adminDailySummary', {
                            username: req.user,
                            workout: workout,
                            recent: recent_dates,
                            note: note,
                            message: ""
                        });

                    });


                });

            });

        });


    });





});


router.post('/deleteScore', function(req, res, next) {

    var sql="DELETE from master.player_workouts where id = '"+req.body.delete_select+"' "

    connection.query(sql, function (err, result) {
        if (err) throw err;

     sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function(err, result) {

        teamid = result;

//insert query below inserts form data into workouts database with the submitted workout info
        sql = "SELECT * FROM master.player_workouts p " +
            "INNER JOIN master.user u ON u.username = p.username " +
            "WHERE workoutID = '" + req.body.workout_id + "' " +
            "AND p.teamID = '" + teamid[0].teamID + "' " +
            "AND u.teamID = '" + teamid[0].teamID + "' " +
            "ORDER BY u.last_name;";

//query changes ****

        var workout = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;

            workout = result;



            sql = "SELECT * FROM workouts " +
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

                    recent_dates[i].date = recent_dates[i].date + " " + recent_dates[i].time + ", " + recent_dates[i].name;


                }


                sql = "SELECT notes, duration, sRPE, pre_sRPE FROM workouts WHERE workoutid = '" + req.body.workout_id + "'" +
                    "AND teamID = '" + teamid[0].teamID + "';";

                var note = [];
                connection.query(sql, function (err, result) {
                    if (err) throw err;

                    note = result;

                    res.render('adminDailySummary', {
                        username: req.user,
                        workout: workout,
                        recent: recent_dates,
                        note: note,
                        message: ""
                    });

                });

            });

            });

        });


    });


});


router.post('/addScore', function(req, res, next) {

    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function (err, result) {
        if (err) throw err;

        teamid = result;


        sql = "select * from master.user where username = '"+req.body.un+"' and  teamID = '" + teamid[0].teamID + "';";
        connection.query(sql, function(err, result) {
            if(result.length === 0)
            {
                sql = "SELECT * FROM master.player_workouts p " +
                    "INNER JOIN master.user u ON u.username = p.username " +
                    "WHERE workoutID = '" + req.body.workout_id + "' " +
                    "AND p.teamID = '" + teamid[0].teamID + "' " +
                    "AND u.teamID = '" + teamid[0].teamID + "' " +
                    "ORDER BY u.last_name;";


                var workout = [];
                connection.query(sql, function (err, result) {
                    if (err) throw err;

                    workout = result;



                    sql = "SELECT * FROM workouts " +
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

                            recent_dates[i].date = recent_dates[i].date + " " + recent_dates[i].time + ", " + recent_dates[i].name;


                        }


                        sql = "SELECT notes, duration, sRPE, pre_sRPE FROM workouts WHERE workoutid = '" + req.body.workout_id + "'" +
                            "AND teamID = '" + teamid[0].teamID + "';";

                        var note = [];
                        connection.query(sql, function (err, result) {
                            if (err) throw err;

                            note = result;

                            res.render('adminDailySummary', {
                                username: req.user,
                                workout: workout,
                                recent: recent_dates,
                                note: note,
                                message: "Incorrect Username"
                            });

                        });

                    });

                });

            }
            else
            {
                sql = "INSERT INTO master.player_workouts (username, teamID, workoutID, player_sRPE) " +
                    "VALUES( '"+req.body.un+"',  '" + teamid[0].teamID + "', '" + req.body.workout_id + "', " +
                    " '"+req.body.playerRPE+"');";
                connection.query(sql, function (err, result) {
                    if (err) throw err;


                    sql = "SELECT * FROM master.player_workouts p " +
                        "INNER JOIN master.user u ON u.username = p.username " +
                        "WHERE workoutID = '" + req.body.workout_id + "' " +
                        "AND p.teamID = '" + teamid[0].teamID + "' " +
                        "AND u.teamID = '" + teamid[0].teamID + "' " +
                        "ORDER BY u.last_name;";


                    workout = [];
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

                            for (var i = 0; i < recent_dates.length; i++) {

                                var day = recent_dates[i].date;

                                day = day.toISOString().split('T')[0];

                                recent_dates[i].date = day;

                                recent_dates[i].date = recent_dates[i].date + " " + recent_dates[i].time + ", " + recent_dates[i].name;


                            }


                            sql = "SELECT notes, duration, sRPE, pre_sRPE FROM workouts WHERE workoutid = '" + req.body.workout_id + "'" +
                                "AND teamID = '" + teamid[0].teamID + "';";

                            var note = [];
                            connection.query(sql, function (err, result) {
                                if (err) throw err;

                                note = result;

                                res.render('adminDailySummary', {
                                    username: req.user,
                                    workout: workout,
                                    recent: recent_dates,
                                    note: note,
                                    message: "Addition Successful"
                                });

                            });

                        });

                    });

                });

            }



            });







    });


});