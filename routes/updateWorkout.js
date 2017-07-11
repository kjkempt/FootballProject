/**
 * Created by kemptk on 6/6/17.
 */
var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'footballdb.cr1jtswtem4i.us-west-2.rds.amazonaws.com',
    user     : 'masterUsername',
    password : 'HNuxJSEjqXUS!auk-eRV6CG8+!^JJAt2M?-Lc4y#+',
    database : 'master'
});


connection.connect(function(err) {
    console.log("Connected! WM");
});




router.post('/update', function(req, res, next) {

    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function(err, result) {

        teamid = result;

        var sql = "SELECT date, workoutid FROM workouts " +
            "WHERE teamID = '"+teamid[0].teamID+"' " +
            "ORDER BY date DESC LIMIT 1;";
        var workout = [];
        connection.query(sql, function (err, result) {

            workout = result;

            if (req.body.coachRPE != 'rpeDefault' && req.body.workoutDuration != '' && req.body.notes != '') {
                sql = "UPDATE workouts " +
                    " SET sRPE = " + req.body.coachRPE + " , duration = " + req.body.workoutDuration + ", " +
                    "notes = CONCAT(notes,  ' \n" + req.body.notes + "' )" +
                    " WHERE workoutid = " + workout[0].workoutid + ";";
            }
            else if (req.body.coachRPE != 'rpeDefault' && req.body.workoutDuration != '' && req.body.notes == '') {
                sql = "UPDATE workouts " +
                    " SET sRPE = " + req.body.coachRPE + " , duration = " + req.body.workoutDuration + " " +
                    " WHERE workoutid = " + workout[0].workoutid + ";";
            }
            else if (req.body.coachRPE == 'rpeDefault' && req.body.workoutDuration != '' && req.body.notes == '') {
                sql = "UPDATE workouts " +
                    " SET duration = " + req.body.workoutDuration + " " +
                    " WHERE workoutid = " + workout[0].workoutid + ";";
            }
            else if (req.body.coachRPE != 'rpeDefault' && req.body.workoutDuration == '' && req.body.notes == '') {
                sql = "UPDATE workouts " +
                    " SET sRPE = " + req.body.coachRPE + " " +
                    " WHERE workoutid = " + workout[0].workoutid + ";";
            }
            else if (req.body.coachRPE != 'rpeDefault' && req.body.workoutDuration == '' && req.body.notes != '') {
                sql = "UPDATE workouts " +
                    " SET sRPE = " + req.body.coachRPE + " , " +
                    "notes = CONCAT(notes,  ' \n" + req.body.notes + "' )" +
                    " WHERE workoutid = " + workout[0].workoutid + ";";
            }
            else if (req.body.coachRPE == 'rpeDefault' && req.body.workoutDuration != '' && req.body.notes != '') {
                sql = "UPDATE workouts " +
                    " SET duration = " + req.body.workoutDuration + " ," +
                    "notes = CONCAT(notes,  ' \n" + req.body.notes + "' ) " +
                    " WHERE workoutid = " + workout[0].workoutid + ";";
            }
            else if (req.body.coachRPE == 'rpeDefault' && req.body.workoutDuration == '' && req.body.notes != '') {
                sql = "UPDATE workouts " +
                    "SET notes = CONCAT(notes,  ' \n" + req.body.notes + "' ) " +
                    " WHERE workoutid = " + workout[0].workoutid + ";";
            }
            else if (req.body.coachRPE == 'rpeDefault' && req.body.workoutDuration == '' && req.body.notes == '') {
                res.render('updateWorkout', {
                    username: req.user,
                    message: 'Error - Both forms left empty'
                });
            }


            connection.query(sql, function (err, result) {


                if (err) {
                    throw err;
                } else
                    res.render('updateWorkout', {
                        username: req.user,
                        message: 'Update successful'
                    });
            });


        });


    });


});


module.exports = router;