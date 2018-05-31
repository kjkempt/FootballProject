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
    connection.query(sql, function(err, result) {

        teamid = result;

        sql = "SELECT u.username, u.first_name, u.last_name, u.position, m.date, dayofweek(m.date) as indexday, " +
            "w.player_sRPE, m.duration, m.time " +
            "FROM  master.player_workouts w " +
            "INNER JOIN master.user u ON u.username = w.username " +
            "INNER JOIN master.workouts m ON w.workoutID = m.workoutid " +
            "WHERE w.teamID = '"+teamid[0].teamID+"' " +
            "AND u.teamID = '"+teamid[0].teamID+"' " +
            "AND m.teamID = '"+teamid[0].teamID+"' " +
            "AND m.date " +
            "BETWEEN  DATE(DATE_ADD('" + req.body.week_select + "', INTERVAL(1-DAYOFWEEK('" + req.body.week_select + "')) DAY))  AND " +
            " '" + req.body.week_select + "' " +
            "   ORDER BY u.username, indexday,  m.time;";



        var player_week_data = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;


            player_week_data = result;

            sql = "SELECT DATE_SUB('" + req.body.week_select + "', INTERVAL 7 DAY) as date;";

            var prev_week = [];
            connection.query(sql, function (err, result) {
                if (err) throw err;


                prev_week = result;




                //do by workoutID



                sql = "SELECT u.username, u.first_name, u.last_name, u.position, " +
                    "SUM(w.player_sRPE * m.duration) as chronicSum, m.date " +
                    "FROM master.user u, master.player_workouts w, master.workouts m " +
                    "WHERE u.username = w.username " +
                    "AND w.teamID = '"+teamid[0].teamID+"' " +
                    "AND u.teamID = '"+teamid[0].teamID+"' " +
                    "AND m.teamID = '"+teamid[0].teamID+"' " +
                    "AND w.workoutID = m.workoutid " +
                    "AND m.date " +
                    "BETWEEN DATE_ADD('" + prev_week[0].date + "', INTERVAL 1 DAY)- INTERVAL 4 WEEK AND '" + prev_week[0].date + "' " +
                    "GROUP BY u.username;";


                var player_chronic = [];
                connection.query(sql, function (err, result) {
                    if (err) throw err;


                    player_chronic = result;


                    sql = "SELECT u.position, m.date, dayofweek(m.date) as indexday, " +
                        "AVG(w.player_sRPE) as pavg, m.duration, m.time " +
                        "FROM  master.player_workouts w " +
                        "INNER JOIN master.user u ON u.username = w.username " +
                        "INNER JOIN master.workouts m ON w.workoutID = m.workoutid " +
                        "WHERE w.teamID = '" + teamid[0].teamID + "' " +
                        "AND u.teamID = '" + teamid[0].teamID + "' " +
                        "AND m.teamID = '" + teamid[0].teamID + "' " +
                        "AND u.group_chronic = 't' " +
                        "AND m.date " +
                        "BETWEEN  DATE(DATE_ADD('" + req.body.week_select + "', INTERVAL(1-DAYOFWEEK('" + req.body.week_select + "')) DAY))  AND " +
                        " '" + req.body.week_select + "' " +
                        "group by u.position, m.date, m.time " +
                        "ORDER BY u.position, m.date, m.time; ";


                    var pos_week_data = [];
                    connection.query(sql, function (err, result) {
                        if (err) throw err;

                        pos_week_data = result;

                        //res.send(pos_week_data);

                        sql = "SELECT u.position, m.date, " +
                            "AVG(w.player_sRPE) as pavg, m.duration, m.time " +
                            "FROM  master.player_workouts w " +
                            "INNER JOIN master.user u ON u.username = w.username " +
                            "INNER JOIN master.workouts m ON w.workoutID = m.workoutid " +
                            "WHERE w.teamID = '" + teamid[0].teamID + "' " +
                            "AND u.teamID = '" + teamid[0].teamID + "' " +
                            "AND m.teamID = '" + teamid[0].teamID + "' " +
                            "AND u.group_chronic = 't' " +
                            "AND m.date " +
                            "BETWEEN  DATE(DATE_ADD('" + req.body.week_select + "', INTERVAL(1-DAYOFWEEK('" + req.body.week_select + "')) DAY))  AND " +
                            " '" + req.body.week_select + "' " +
                            "group by m.date, m.time " +
                            "ORDER BY m.date, m.time; ";


                        //All workouts of the week (averages for team)

                        var team_week_data = [];
                        connection.query(sql, function (err, result) {
                            if (err) throw err;

                            team_week_data = result;




                            sql  = "SELECT u.username, u.position, m.date, m.time, u.group_chronic, " +
                                "SUM(w.player_sRPE * m.duration) / 4 as chronicSum " +
                                "FROM master.user u, master.player_workouts w, master.workouts m " +
                                "WHERE u.username = w.username " +
                                "AND w.teamID = '" + teamid[0].teamID + "' " +
                                "AND u.teamID = '" + teamid[0].teamID + "' " +
                                "AND m.teamID = '" + teamid[0].teamID + "' " +
                                "AND w.workoutID = m.workoutid " +
                                "AND u.group_chronic = 't' " +
                                "AND m.date " +
                                "BETWEEN DATE_ADD('" + prev_week[0].date + "', INTERVAL 1 DAY)- INTERVAL 4 WEEK AND '" + prev_week[0].date + "' " +
                                "GROUP BY u.username " +
                                "ORDER BY u.position; " ;

                            var chronic_position = [];
                            connection.query(sql, function (err, result) {
                                if (err) throw err;

                                chronic_position = result;


                                sql = "SELECT u.username , m.date, m.time, u.group_chronic, " +
                                    "SUM(w.player_sRPE * m.duration) / 4 as chronicSum " +
                                    "FROM master.user u, master.player_workouts w, master.workouts m " +
                                    "WHERE u.username = w.username " +
                                    "AND w.teamID = '" + teamid[0].teamID + "' " +
                                    "AND u.teamID = '" + teamid[0].teamID + "' " +
                                    "AND m.teamID = '" + teamid[0].teamID + "' " +
                                    "AND w.workoutID = m.workoutid " +
                                    "AND u.group_chronic = 't' " +
                                    "AND m.date " +
                                    "BETWEEN DATE_ADD('" + prev_week[0].date + "', INTERVAL 1 DAY)- INTERVAL 4 WEEK AND '" + prev_week[0].date + "' " +
                                    "GROUP BY u.username " +
                                    "ORDER BY u.username; " ;

                                var chronic_team = [];
                                connection.query(sql, function (err, result) {
                                    if (err) throw err;

                                    chronic_team = result;
                                    //res.send(chronic_team);















                                            sql  = "SELECT COUNT(distinct u.username) as c, u.position, u.group_chronic, " +
                                                "SUM(w.player_sRPE * m.duration) as acuteSum, SUM(m.duration) as acuteDuration " +
                                                "FROM master.user u, master.player_workouts w, master.workouts m " +
                                                "WHERE u.username = w.username " +
                                                "AND w.teamID = '" + teamid[0].teamID + "' " +
                                                "AND u.teamID = '" + teamid[0].teamID + "' " +
                                                "AND m.teamID = '" + teamid[0].teamID + "' " +
                                                "AND w.workoutID = m.workoutid " +
                                                "AND u.group_chronic = 't' " +
                                                "AND m.date " +
                                                "BETWEEN  DATE(DATE_ADD('" + req.body.week_select + "', INTERVAL(1-DAYOFWEEK('" + req.body.week_select + "')) DAY))  AND " +
                                                " '" + req.body.week_select + "' " +
                                                "GROUP BY u.position " +
                                                "ORDER BY u.position; " ;



                                            var acute_position = [];
                                            connection.query(sql, function (err, result) {
                                                if (err) throw err;

                                                acute_position = result;



                                                sql = "SELECT u.username , m.date, m.time, u.group_chronic, " +
                                                    "SUM(w.player_sRPE * m.duration)  as chronicSum, SUM(m.duration) as durationSum " +
                                                    "FROM master.user u, master.player_workouts w, master.workouts m " +
                                                    "WHERE u.username = w.username " +
                                                    "AND w.teamID = '" + teamid[0].teamID + "' " +
                                                    "AND u.teamID = '" + teamid[0].teamID + "' " +
                                                    "AND m.teamID = '" + teamid[0].teamID + "' " +
                                                    "AND w.workoutID = m.workoutid " +
                                                    "AND u.group_chronic = 't' " +
                                                    "AND m.date " +
                                                    "BETWEEN  DATE(DATE_ADD('" + req.body.week_select + "', INTERVAL(1-DAYOFWEEK('" + req.body.week_select + "')) DAY))  AND " +
                                                    " '" + req.body.week_select + "' " +
                                                    "GROUP BY u.username " +
                                                    "ORDER BY u.username; " ;

                                                var acute_team = [];
                                                connection.query(sql, function (err, result) {
                                                    if (err) throw err;

                                                    acute_team = result;

                                                    sql = "SELECT u.username , m.date, m.time, u.group_chronic, " +
                                                        "SUM(w.player_sRPE * m.duration) / 4 as chronicSum,  count(distinct u.username) as c " +
                                                        "FROM master.user u, master.player_workouts w, master.workouts m " +
                                                        "WHERE u.username = w.username " +
                                                        "AND w.teamID = '" + teamid[0].teamID + "' " +
                                                        "AND u.teamID = '" + teamid[0].teamID + "' " +
                                                        "AND m.teamID = '" + teamid[0].teamID + "' " +
                                                        "AND w.workoutID = m.workoutid " +
                                                        "AND NOT (u.group_chronic = 't') " +
                                                        "AND m.date " +
                                                        "BETWEEN DATE_ADD('" + prev_week[0].date + "', INTERVAL 1 DAY)- INTERVAL 4 WEEK AND '" + prev_week[0].date + "' " +
                                                        "GROUP BY u.group_chronic " +
                                                        "ORDER BY u.group_chronic; ";

                                                    var chronic_group = [];
                                                    connection.query(sql, function (err, result) {
                                                        if (err) throw err;

                                                        chronic_group = result;


                                                        sql = "SELECT u.username , m.date, m.time, u.group_chronic, " +
                                                            "SUM(w.player_sRPE * m.duration)  as acuteSum, SUM(m.duration) as acuteDuration, count(distinct u.username) as c " +
                                                            "FROM master.user u, master.player_workouts w, master.workouts m " +
                                                            "WHERE u.username = w.username " +
                                                            "AND w.teamID = '" + teamid[0].teamID + "' " +
                                                            "AND u.teamID = '" + teamid[0].teamID + "' " +
                                                            "AND m.teamID = '" + teamid[0].teamID + "' " +
                                                            "AND w.workoutID = m.workoutid " +
                                                            "AND NOT (u.group_chronic = 't') " +
                                                            "AND m.date " +
                                                            "BETWEEN  DATE(DATE_ADD('" + req.body.week_select + "', INTERVAL(1-DAYOFWEEK('" + req.body.week_select + "')) DAY))  AND " +
                                                            " '" + req.body.week_select + "' " +
                                                            "GROUP BY u.group_chronic " +
                                                            "ORDER BY u.group_chronic; ";

                                                        var acute_group = [];
                                                        connection.query(sql, function (err, result) {
                                                            if (err) throw err;

                                                            acute_group = result;




                                                            sql = "SELECT u.group_chronic, m.date, dayofweek(m.date) as indexday, " +
                                                                "AVG(w.player_sRPE) as pavg, m.duration, m.time " +
                                                                "FROM  master.player_workouts w " +
                                                                "INNER JOIN master.user u ON u.username = w.username " +
                                                                "INNER JOIN master.workouts m ON w.workoutID = m.workoutid " +
                                                                "WHERE w.teamID = '" + teamid[0].teamID + "' " +
                                                                "AND u.teamID = '" + teamid[0].teamID + "' " +
                                                                "AND m.teamID = '" + teamid[0].teamID + "' " +
                                                                "AND NOT (u.group_chronic = 't') " +
                                                                "AND m.date " +
                                                                "BETWEEN  DATE(DATE_ADD('" + req.body.week_select + "', INTERVAL(1-DAYOFWEEK('" + req.body.week_select + "')) DAY))  AND " +
                                                                " '" + req.body.week_select + "' " +
                                                                "group by u.group_chronic, m.date, m.time " +
                                                                "ORDER BY u.group_chronic, m.date, m.time; ";


                                                            var group_week_data = [];
                                                            connection.query(sql, function (err, result) {
                                                                if (err) throw err;

                                                                group_week_data = result;






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


                                                                    sql = "SELECT u.username , m.date, m.time, u.group_chronic, " +
                                                                        "SUM(w.player_sRPE * m.duration)  as chronicSum " +
                                                                        "FROM master.user u, master.player_workouts w, master.workouts m " +
                                                                        "WHERE u.username = w.username " +
                                                                        "AND w.teamID = '" + teamid[0].teamID + "' " +
                                                                        "AND u.teamID = '" + teamid[0].teamID + "' " +
                                                                        "AND m.teamID = '" + teamid[0].teamID + "' " +
                                                                        "AND w.workoutID = m.workoutid " +
                                                                        "AND u.group_chronic = 't' " +
                                                                        "AND m.date " +
                                                                        "BETWEEN DATE_ADD('" + prev_week[0].date + "', INTERVAL 1 DAY)- INTERVAL 3 WEEK AND '" + prev_week[0].date + "' " +
                                                                        "GROUP BY u.username " +
                                                                        "ORDER BY u.username; " ;

                                                                    var total_chronic = [];
                                                                    connection.query(sql, function (err, result) {
                                                                        if (err) throw err;

                                                                        total_chronic = result;


                                                                        res.render('weeklySummary', {
                                                                            username: req.user,
                                                                            player_week_data: player_week_data,
                                                                            player_chronic: player_chronic,
                                                                            workouts: workouts,
                                                                            week_set: week_set,
                                                                            pos_week_data: pos_week_data,
                                                                            team_week_data: team_week_data,
                                                                            chronic_position: chronic_position,
                                                                            chronic_team: chronic_team,
                                                                            acute_position: acute_position,
                                                                            acute_team: acute_team,
                                                                            chronic_group: chronic_group,
                                                                            acute_group: acute_group,
                                                                            group_week_data: group_week_data,
                                                                            total_chronic: total_chronic
                                                                        });


                                                                    });

                                                                });


                                                            });



                                                    });
                                                });

                                            });

                                        });

                                    });

                                });
                            });
                        });
                    });
                });

            });


        });

    });






});












