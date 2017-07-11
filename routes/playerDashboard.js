var express = require('express');
var router = express.Router();
var app = require('../app.js');

module.exports = router;

var mysql = require('promise-mysql');



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



router.post('/playerInput', function(req, res, next) {

    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function(err, result) {

        teamid = result;

        var sql = "SELECT * FROM master.workouts " +
        "WHERE teamID = '" + teamid[0].teamID + "' " +
        "AND workoutid = " +
        "(select max(workoutid) from master.workouts " +
        "WHERE teamID = '" + teamid[0].teamID + "')  ;";


        var workout = [];
        connection.query(sql, function (err, result) {

            workout = result;

            sql = "INSERT INTO player_workouts(username, workoutID, player_sRPE, teamID) " +
                "VALUES('" + req.user + "', '" + workout[0].workoutid + "' ,'" + req.body.playerRPE + "', '"+teamid[0].teamID+"')";

            connection.query(sql, function (err, result) {
                if (err) {
                    throw err;
                } else
                    res.render('playerDashboard', {
                        username: req.user,
                        message: 'Submission successful'
                    });
            });

        });

    });


});