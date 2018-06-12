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






router.post('/playerInput', function(req, res, next) {

    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function(err, result) {

        teamid = result;

        if(teamid[0].teamID === "isuwbb")
        {
            console.log(req.body.double_select);

            if(!req.body.double_select)
            {
                sql = "SELECT * FROM master.workouts " +
                    "WHERE teamID = '" + teamid[0].teamID + "' " +
                    "AND workoutid = " +
                    "(select max(workoutid) from master.workouts " +
                    "WHERE teamID = '" + teamid[0].teamID + "')  ;";


                var workout = [];
                connection.query(sql, function (err, result) {

                    workout = result;


                    sql = "select * from master.player_workouts where username = '"+req.user+"'" +
                        "and workoutID = '" + workout[0].workoutid + "'; ";
                    connection.query(sql, function (err, result) {
                        if (err) throw err;

                        if(result.length === 0) {

                            sql = "INSERT INTO player_workouts(username, workoutID, player_sRPE, teamID, heartrate, ind_duration) " +
                                "VALUES('" + req.user + "', '" + workout[0].workoutid + "' ,'" + req.body.playerRPE + "', '" + teamid[0].teamID + "', 0, 0)";

                            var double = [];
                            connection.query(sql, function (err, result) {
                                if (err) {
                                    throw err;
                                } else
                                    res.render('playerDashboard', {
                                        username: req.user,
                                        message: 'Submission successful',
                                        double: double
                                    });
                            });

                        }
                        else
                        {
                            sql = "UPDATE master.player_workouts " +
                                "SET player_sRPE = '" + req.body.playerRPE + "' " +
                                "WHERE username = '" + req.user + "' " +
                                "AND id = '"+result[0].id+"' ";
                            double = [];
                            connection.query(sql, function (err, result) {
                                if (err) {
                                    throw err;
                                } else
                                    res.render('playerDashboard', {
                                        username: req.user,
                                        message: 'Update successful',
                                        double: double
                                    });
                            });
                        }


                    });

                });
            }
            else
            {
                sql = "SELECT * FROM master.workouts " +
                    "WHERE teamID = '" + teamid[0].teamID + "' " +
                    "ORDER BY workoutid desc limit 2 ;";

                var double = [];
                connection.query(sql, function (err, result) {
                    if (err) throw err;

                    double = result;


                    connection.query(sql, function (err, result) {

                        workout = result;


                        sql = "select * from master.player_workouts where username = '" + req.user + "'" +
                            "and workoutID = '" + req.body.double_select + "'; ";
                        connection.query(sql, function (err, result) {
                            if (err) throw err;

                            if (result.length === 0) {

                                sql = "INSERT INTO player_workouts(username, workoutID, player_sRPE, teamID, heartrate, ind_duration) " +
                                    "VALUES('" + req.user + "', '" + workout[0].workoutid + "' ,'" + req.body.playerRPE + "', '" + teamid[0].teamID + "', 0, 0)";

                                connection.query(sql, function (err, result) {
                                    if (err) {
                                        throw err;
                                    } else
                                        res.render('playerDashboard', {
                                            username: req.user,
                                            message: 'Submission successful',
                                            double: double
                                        });
                                });

                            }
                            else {
                                sql = "UPDATE master.player_workouts " +
                                    "SET player_sRPE = '" + req.body.playerRPE + "' " +
                                    "WHERE username = '" + req.user + "' " +
                                    "AND id = '" + result[0].id + "' ";

                                connection.query(sql, function (err, result) {
                                    if (err) {
                                        throw err;
                                    } else
                                        res.render('playerDashboard', {
                                            username: req.user,
                                            message: 'Update successful',
                                            double: double
                                        });
                                });
                            }


                        });

                    });
                });
            }


        }
        else
        {
            console.log(req.body.double_select);

            if(!req.body.double_select)
            {
                sql = "SELECT * FROM master.workouts " +
                    "WHERE teamID = '" + teamid[0].teamID + "' " +
                    "AND workoutid = " +
                    "(select max(workoutid) from master.workouts " +
                    "WHERE teamID = '" + teamid[0].teamID + "')  ;";


                var workout = [];
                connection.query(sql, function (err, result) {

                    workout = result;


                    sql = "select * from master.player_workouts where username = '"+req.user+"'" +
                        "and workoutID = '" + workout[0].workoutid + "'; ";
                    connection.query(sql, function (err, result) {
                        if (err) throw err;

                        if(result.length === 0) {

                            sql = "INSERT INTO player_workouts(username, workoutID, player_sRPE, teamID, heartrate, ind_duration) " +
                                "VALUES('" + req.user + "', '" + workout[0].workoutid + "' ,'" + req.body.playerRPE + "', '" + teamid[0].teamID + "', 0, 0)";

                            var double = [];
                            connection.query(sql, function (err, result) {
                                if (err) {
                                    throw err;
                                } else
                                    res.render('playerDashboard', {
                                        username: req.user,
                                        message: 'Submission successful',
                                        double: double
                                    });
                            });

                        }
                        else
                        {
                            sql = "UPDATE master.player_workouts " +
                                "SET player_sRPE = '" + req.body.playerRPE + "' " +
                                "WHERE username = '" + req.user + "' " +
                                "AND id = '"+result[0].id+"' ";
                            double = [];
                            connection.query(sql, function (err, result) {
                                if (err) {
                                    throw err;
                                } else
                                    res.render('playerDashboard', {
                                        username: req.user,
                                        message: 'Update successful',
                                        double: double
                                    });
                            });
                        }


                    });

                });
            }
            else
            {
                sql = "SELECT * FROM master.workouts " +
                    "WHERE teamID = '" + teamid[0].teamID + "' " +
                    "ORDER BY workoutid desc limit 2 ;";

                var double = [];
                connection.query(sql, function (err, result) {
                    if (err) throw err;

                    double = result;


                    connection.query(sql, function (err, result) {

                        workout = result;


                        sql = "select * from master.player_workouts where username = '" + req.user + "'" +
                            "and workoutID = '" + req.body.double_select + "'; ";
                        connection.query(sql, function (err, result) {
                            if (err) throw err;

                            if (result.length === 0) {

                                sql = "INSERT INTO player_workouts(username, workoutID, player_sRPE, teamID, heartrate, ind_duration) " +
                                    "VALUES('" + req.user + "', '" + workout[0].workoutid + "' ,'" + req.body.playerRPE + "', '" + teamid[0].teamID + "', 0, 0)";

                                connection.query(sql, function (err, result) {
                                    if (err) {
                                        throw err;
                                    } else
                                        res.render('playerDashboard', {
                                            username: req.user,
                                            message: 'Submission successful',
                                            double: double
                                        });
                                });

                            }
                            else {
                                sql = "UPDATE master.player_workouts " +
                                    "SET player_sRPE = '" + req.body.playerRPE + "' " +
                                    "WHERE username = '" + req.user + "' " +
                                    "AND id = '" + result[0].id + "' ";

                                connection.query(sql, function (err, result) {
                                    if (err) {
                                        throw err;
                                    } else
                                        res.render('playerDashboard', {
                                            username: req.user,
                                            message: 'Update successful',
                                            double: double
                                        });
                                });
                            }


                        });

                    });
                });
            }


        }





    });


});