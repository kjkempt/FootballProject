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



router.post('/selectWeek', function(req, res, next) {

    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function (err, result) {
        if (err) throw err;

        teamid = result;


        sql = "SELECT u.username, u.first_name, u.last_name, u.position, m.date, m.workoutID, " +
            "w.player_sRPE, m.duration, m.time " +
            "FROM  master.player_workouts w " +
            "INNER JOIN master.user u ON u.username = w.username " +
            "INNER JOIN master.workouts m ON w.workoutID = m.workoutid " +
            "WHERE w.teamID = '" + teamid[0].teamID + "' " +
            "AND u.teamID = '" + teamid[0].teamID + "' " +
            "AND m.teamID = '" + teamid[0].teamID + "' " +
            "AND m.date " +
            "BETWEEN  DATE(DATE_ADD('" + req.body.week_select + "', INTERVAL(1-DAYOFWEEK('" + req.body.week_select + "')) DAY))  AND " +
            " '" + req.body.week_select + "' " +
            "   ORDER BY u.username, m.date,  m.time;";


        var player_week_data = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;


            player_week_data = result;



            sql = "SELECT * " +
                "FROM  master.workouts " +
                "WHERE teamID = '" + teamid[0].teamID + "' " +
                "AND date " +
                "BETWEEN  DATE(DATE_ADD('" + req.body.week_select + "', INTERVAL(1-DAYOFWEEK('" + req.body.week_select + "')) DAY))  AND " +
                " '" + req.body.week_select + "' " +
                " ;";

            var workouts = [];
            connection.query(sql, function (err, result) {
                if (err) throw err;


                workouts = result;



                sql = "SELECT distinct DATE(DATE_ADD(m.date, INTERVAL(1-DAYOFWEEK(m.date)) DAY)) as sunday, " +
                    "DATE(DATE_ADD(m.date, INTERVAL(7-DAYOFWEEK(m.date)) DAY)) as saturday " +
                    "FROM master.workouts m " +
                    "WHERE m.teamID = '" + teamid[0].teamID + "' " +
                    "ORDER BY date desc limit 10;";

                var week_set = [];
                connection.query(sql, function (err, result) {
                    if (err) throw err;

                    week_set = result;


                    //this splits the string to just have the date be in YYYY-MM-DD format for the queries

                    for (var i = 0; i < week_set.length; i++) {
                        var sun = week_set[i].sunday;

                        sun = sun.toISOString().split('T')[0];

                        var sat = week_set[i].saturday;

                        sat = sat.toISOString().split('T')[0];

                        week_set[i].sunday = sun;
                        week_set[i].saturday = sat;

                    }





                    sql = "SELECT DATE_SUB('" + req.body.week_select + "', INTERVAL 7 DAY) as date;";

                    var prev_week = [];
                    connection.query(sql, function (err, result) {
                        if (err) throw err;


                        prev_week = result;




                        //do by workoutID



                        sql = "SELECT u.username, u.first_name, u.last_name, u.position, " +
                            "SUM(w.player_sRPE * m.duration) as chronicSum, m.date," +
                            "(weekofyear('" + req.body.week_select + "') - weekofyear(m.date) + 1) as weekcount  " +
                            "FROM master.user u, master.player_workouts w, master.workouts m " +
                            "WHERE u.username = w.username " +
                            "AND w.teamID = '"+teamid[0].teamID+"' " +
                            "AND u.teamID = '"+teamid[0].teamID+"' " +
                            "AND m.teamID = '"+teamid[0].teamID+"' " +
                            "AND w.workoutID = m.workoutid " +
                            "AND m.date " +
                            "BETWEEN '" + prev_week[0].date + "'- INTERVAL 4 WEEK AND '" + prev_week[0].date + "' " +
                            "GROUP BY u.username;";

                        //Chronic data from 4 weeks priod to selected week

                        var player_chronic = [];
                        connection.query(sql, function (err, result) {
                            if (err) throw err;


                            player_chronic = result;

                            //res.send(player_chronic);





                                                    res.render('isuwsoc/isuwsocWeeklySummary', {
                                                        username: req.user,
                                                        player_week_data: player_week_data,
                                                        workouts: workouts,
                                                        week_set: week_set,
                                                        player_chronic: player_chronic
                                                    });

                        });

                    });


                });

            });


        });

    });




});











