/**
 * Created by kemptk on 6/11/17.
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


router.post('/coachDailySum', function(req, res, next) {

//insert query below inserts form data into workouts database with the submitted workout info
    sql = "SELECT * FROM master.player_workouts p " +
        "INNER JOIN master.user u ON u.username = p.username " +
        "WHERE workoutID = '"+req.body.date_select+"'; ";

//query changes ****

    var workout = [];
    connection.query(sql, function (err, result) {
        if (err) throw err;

        workout = result;






        var sql = "SELECT * FROM workouts ORDER BY date DESC LIMIT 10;";
        var recent_dates = [];
        connection.query(sql, function(err, result) {
            if (err) throw err;

            recent_dates = result;


            res.render('coachDailySummary', {
                username: req.user,
                workout: workout,
                recent: recent_dates
            });


        });

    });


});