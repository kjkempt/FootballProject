/**
 * Created by kemptk on 7/23/17.
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


router.post('/addWorkout', function(req, res, next) {





    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function(err, result) {

        teamid = result;

            //insert query below inserts form data into workouts database with the submitted workout info
            sql = "INSERT INTO cata_workouts(name, date, teamid) " +
                "VALUES('" + req.body.workoutName + "', '" + req.body.workoutDate + "', '" + teamid[0].teamID + "')";



        connection.query(sql, function (err, result) {
            if (err) {
                throw err;
            } else
                res.render('coachCataCreateWorkout', {
                    username: req.user,
                    message: 'Submission successful'
                });
        });


    });


});