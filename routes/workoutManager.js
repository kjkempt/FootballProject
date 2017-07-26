var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'footballdb.cr1jtswtem4i.us-west-2.rds.amazonaws.com',
    user     : 'masterUsername',
    password : 'HNuxJSEjqXUS!auk-eRV6CG8+!^JJAt2M?-Lc4y#+',
    database : 'master'
});






router.post('/addWorkout', function(req, res, next) {





    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function(err, result) {

    teamid = result;
        if(!req.body.time)
        {
            sql = "INSERT INTO workouts(name, date, duration, sRPE, pre_sRPE, trainingtype, notes, teamID, time) " +
                "VALUES('" + req.body.workoutName + "', '" + req.body.workoutDate + "', '" + req.body.workoutDuration + "'," +
                " '" + req.body.coachRPE + "','" + req.body.coachRPE + "' , '" + req.body.workoutType + "', '" + req.body.notes + "'," +
                " '" + teamid[0].teamID + "', 'PM')";
        }
        else {
            //insert query below inserts form data into workouts database with the submitted workout info
            sql = "INSERT INTO workouts(name, date, duration, sRPE, pre_sRPE, trainingtype, notes, teamID, time) " +
                "VALUES('" + req.body.workoutName + "', '" + req.body.workoutDate + "', '" + req.body.workoutDuration + "'," +
                " '" + req.body.coachRPE + "','" + req.body.coachRPE + "' , '" + req.body.workoutType + "', '" + req.body.notes + "'," +
                " '" + teamid[0].teamID + "', '" + req.body.time + "')";
        }


        connection.query(sql, function (err, result) {
            if (err) {
                throw err;
            } else
                res.render('workoutManager', {
                    username: req.user,
                    message: 'Submission successful'
                });
        });


    });


});


module.exports = router;