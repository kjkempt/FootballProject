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


router.post('/entry', function(req, res, next) {

    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function(err, result) {

        teamid = result;

        sql = "SELECT username, first_name, last_name FROM master.user " +
            "where privileges = 'Player' " +
            "and teamID = '" + teamid[0].teamID + "' " +
            "and group_cata = 'yes' " +
            "order by last_name;";

        var player = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;

            player = result;

            var sql = "SELECT * FROM master.cata_workouts " +
                "WHERE teamid = '" + teamid[0].teamID + "' " +
                "AND id = " +
                "(select max(id) from master.cata_workouts " +
                "WHERE teamid = '" + teamid[0].teamID + "')  ;";


            var workout = [];
            connection.query(sql, function (err, result) {

                workout = result;


                sql = "select * from master.cata_player_workouts where username = '" + req.body.player + "'" +
                    "and workout_id = '" + workout[0].id + "'; ";
                connection.query(sql, function (err, result) {
                    if (err) throw err;

                    if (result.length === 0) {

                        sql = "INSERT INTO cata_player_workouts(username, workout_id, pload, duration, teamid) " +
                            "VALUES('" + req.body.player + "', '" + workout[0].id + "' ,'" + req.body.workoutLoad + "', " +
                            " '" + req.body.workoutDuration + "', '" + teamid[0].teamID + "')";

                        connection.query(sql, function (err, result) {
                            if (err) {
                                throw err;
                            } else
                                res.render('coachCataInput', {
                                    username: req.user,
                                    message: 'Submission successful',
                                    player: player
                                });
                        });

                    }
                    else {
                        sql = "UPDATE master.cata_player_workouts " +
                            "SET pload = '" + req.body.workoutLoad + "' AND duration = '" + req.body.workoutDuration + "' " +
                            "WHERE username = '" + req.user + "' " +
                            "AND id = '" + result[0].id + "' ";

                        connection.query(sql, function (err, result) {
                            if (err) {
                                throw err;
                            } else
                                res.render('coachCataInput', {
                                    username: req.user,
                                    message: 'Update successful',
                                    player: player
                                });
                        });
                    }


                });

            });

        });
    });


});