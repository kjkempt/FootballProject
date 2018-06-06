var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'footballdb.cr1jtswtem4i.us-west-2.rds.amazonaws.com',
    user     : 'masterUsername',
    password : 'HNuxJSEjqXUS!auk-eRV6CG8+!^JJAt2M?-Lc4y#+',
    database : 'master'
});





router.post('/update', function(req, res, next) {

    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function(err, result) {

        teamid = result;



        var sql = "select id from master.player_workouts where teamID = '" + teamid[0].teamID + "' " +
        "and username = '" + req.body.player + "' " +
        "and workoutID = '"+ req.body.date_select +"'; ";

        var updateWork = [];
        connection.query(sql, function(err, result) {

            updateWork = result;




        sql = "UPDATE master.player_workouts " +
            "SET duration = " + req.body.minutes + ", " +
            "heartrate = " + req.body.heartrate + " " +
            "WHERE id = '"+ updateWork[0].id +"'; ";


        connection.query(sql, function (err, result) {
            if (err) throw err;


            sql = "SELECT * FROM workouts " +
                "WHERE teamID = '" + teamid[0].teamID + "' " +
                "ORDER BY date DESC LIMIT 1;";

            var recent_dates = [];
            connection.query(sql, function (err, result) {
                if (err) throw err;

                recent_dates = result;

                for (var i = 0; i < recent_dates.length; i++) {

                    var day = recent_dates[i].date;

                    day = day.toISOString().split('T')[0];

                    recent_dates[i].date = day;

                    recent_dates[i].date = recent_dates[i].date + " " + recent_dates[i].time + ", " + recent_dates[i].name;


                }


                sql = "SELECT * FROM master.workouts " +
                    "WHERE teamID = '" + teamid[0].teamID + "' " +
                    "AND workoutid = " +
                    "(select max(workoutid) from master.workouts " +
                    "WHERE teamID = '" + teamid[0].teamID + "')  ;";


                var workoutid = [];
                connection.query(sql, function (err, result) {

                    workoutid = result;

                    sql = "SELECT u.first_name, u.last_name, u.username " +
                        "FROM master.player_workouts p, master.user u " +
                        "where p.workoutID = '" + workoutid[0].workoutid + "' AND " +
                        "u.username = p.username;";


                    var players = [];
                    connection.query(sql, function (err, result) {

                        players = result;


                        res.render('isuwbb/isuwbbUpdatePlayerData', {
                            username: req.session.user,
                            recent: recent_dates,
                            message: "Success",
                            players: players
                        });

                    });


                });


            });


        });

        });



    });


});


module.exports = router;