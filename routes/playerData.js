/**
 * Created by bskaja on 5/24/17.
 */
var express = require('express');
var router = express.Router();

var mysql = require('promise-mysql');

module.exports = router;

/* GET home page. */
router.post('/updateGraph', function(req, res, next) {
    var connection;

    mysql.createConnection({
        host: 'footballdb.cr1jtswtem4i.us-west-2.rds.amazonaws.com',
        user: 'masterUsername',
        password: 'HNuxJSEjqXUS!auk-eRV6CG8+!^JJAt2M?-Lc4y#+',
        database: 'master'
    }).then(function (conn) {
        connection = conn;
        var data = connection.query("SELECT player_workouts.username, workouts.name, player_workouts.player_sRPE, workouts.sRPE, workouts.date " +
            "FROM player_workouts " +
            "INNER JOIN workouts ON player_workouts.workoutID = workouts.workoutid " +
            "WHERE username = '" + req.body.username + "'");
        return data;
    }).then(function (rows) {
        // Logs out a list of hobbits
        console.log(rows);
        return rows;
    }).then(function (rows) {
        var data = [];
        for (var i = 0; i < rows.length; i++) {
            data.push({
                period: rows[i].date,
                player: rows[i].player_sRPE,
                coach_prediction: rows[i].sRPE
            });
        }

        res.send(data);
    });
});


