/**
 * Created by kemptk on 6/6/17.
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

router.post('/selectWeek', function(req, res, next) {

    var sql = "SELECT u.username, u.first_name, u.last_name, u.position, m.date, dayofweek(m.date) as indexday, " +
        "w.player_sRPE, m.duration " +
    "FROM  master.player_workouts w " +
    "INNER JOIN master.user u ON u.username = w.username " +
    "INNER JOIN master.workouts m ON w.workoutID = m.workoutid " +
    "WHERE m.date " +
    "BETWEEN '2017-06-04' AND '2017-06-10' " +
        "   ORDER BY u.username, indexday;"

    var week_data = [];
    connection.query(sql, function(err, result)
    {
        if(err) throw err;


        week_data = result;


        sql = "SELECT u.username, u.first_name, u.last_name, u.position, " +
        "SUM(w.player_sRPE * m.duration) as chronicSum, m.date," +
            "(weekofyear('2017-06-10') - weekofyear(m.date)) as weekcount  " +
        "FROM master.user u, master.player_workouts w, master.workouts m " +
        "WHERE u.username = w.username " +
        "AND w.workoutID = m.workoutid " +
        "AND m.date " +
        "BETWEEN '2017-06-10'- INTERVAL 4 WEEK AND '2017-06-10' " +
        "GROUP BY u.username;";

        var chronic = [];
        connection.query(sql, function(err, result) {
            if (err) throw err;


            chronic = result;


            res.render('weeklySummary', {
                username: req.user,
                week_data: week_data,
                chronic_week: chronic
            });
        });


    })






})