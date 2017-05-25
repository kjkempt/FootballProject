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

/*
    add workout form names
    coachRPE
    workoutDate
    workoutDuration


    SQL Query Insert

    INSERT INTO workouts(name, date, duration, sRPE)
    VALUES()


    or

    var workName = req.body.name;
    var workRPE = req.body.coachRPE;
    var workDate = req.body.workoutDate;
    var workDuration = req.body.workoutDuration;

    INSERT INTO workouts SET ?, (variable)

    var post = {
    name:  workName,
    date:  workRPE,
    duration:  workDuration,
    sRPE: workDate
    }

    */


router.post('/addWorkout', function(req, res, next) {
    //console.log(req)
    var sql = "INSERT INTO workouts(name, date, duration, sRPE, trainingtype) " +
        "VALUES('"+req.body.workoutName+"', '"+req.body.workoutDate+"', '"+req.body.workoutDuration+"'," +
        " '"+req.body.coachRPE+"', '"+req.body.workoutType+"')";
    /*
    var data = {name: req.body.name};

    //res.send("START");

    function fetchID(data, callback) {
        connection.query(sql, function (err, rows) {
            if (err) {
                callback(err, null);
            } else
                callback(null, rows[0].name);
        });
    };

    var name;
    fetchID(data, function (err, content) {
        if (err) {
            console.log(err);
            res.send(err);
            // Do something with your error...
        } else {
            name = content;
            console.log(name);
            res.send("name is -" + name);
        }

    });

    */

    connection.query(sql, function (err, result) {
        if (err) {
            throw err;
        } else
            res.send("Success");
    });


    //connection.end();
});


module.exports = router;