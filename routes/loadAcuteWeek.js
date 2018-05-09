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







router.post('/loadData', function(req, res, next) {




console.log(req.body.players.length);

    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function(err, result) {

        teamid = result;
        if(!req.body.time)
        {
            sql = "INSERT INTO workouts(name, date, duration, sRPE, pre_sRPE, trainingtype, notes, teamID, time) " +
                "VALUES('" + req.body.workoutName + "', '" + req.body.workoutDate + "', '" + req.body.workoutDuration + "'," +
                " '" + req.body.rpe + "','" + req.body.coachRPE + "' , '" + req.body.workoutType + "', '" + req.body.notes + "'," +
                " '" + teamid[0].teamID + "', 'PM')";
        }
        else {
            //insert query below inserts form data into workouts database with the submitted workout info
            sql = "INSERT INTO workouts(name, date, duration, sRPE, pre_sRPE, trainingtype, notes, teamID, time) " +
                "VALUES('" + req.body.workoutName + "', '" + req.body.workoutDate + "', '" + req.body.workoutDuration + "'," +
                " '" + req.body.rpe + "','" + req.body.coachRPE + "' , '" + req.body.workoutType + "', '" + req.body.notes + "'," +
                " '" + teamid[0].teamID + "', '" + req.body.time + "')";
        }


        connection.query(sql, function (err, result) {
            if (err) {
                throw err;
            } else


                sql = "SELECT * FROM master.workouts " +
                    "WHERE teamID = '" + teamid[0].teamID + "' " +
                    "AND workoutid = " +
                    "(select max(workoutid) from master.workouts " +
                    "WHERE teamID = '" + teamid[0].teamID + "')  ;";


            var workout = [];
            connection.query(sql, function (err, result) {

                workout = result;

                //res.send(workout);



                for(var i = 0; i < req.body.players.length; i++) {
                    console.log(req.body.players[i]);

                    sql = "INSERT INTO player_workouts(username, workoutID, player_sRPE, teamID, heartrate) " +
                        "VALUES('" + req.body.players[i] + "', '" + workout[0].workoutid + "' ,'" + req.body.rpe + "', '" + teamid[0].teamID + "', 0)";

                    connection.query(sql, function (err, result) {

                    });

                }

                res.render('workoutManager', {
                    username: req.user,
                    message: 'Submission successful'
                });

            });
        });


    });


});