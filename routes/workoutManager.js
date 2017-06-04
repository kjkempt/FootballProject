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
    if (err) throw err;
    console.log("Connected! WM");
});




router.post('/addWorkout', function(req, res, next) {

    //insert query below inserts form data into workouts database with the submitted workout info
    var sql = "INSERT INTO workouts(name, date, duration, sRPE, trainingtype) " +
        "VALUES('"+req.body.workoutName+"', '"+req.body.workoutDate+"', '"+req.body.workoutDuration+"'," +
        " '"+req.body.coachRPE+"', '"+req.body.workoutType+"')";


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


module.exports = router;