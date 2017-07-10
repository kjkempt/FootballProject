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



        var week_data = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;


            week_data = result;


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
                "BETWEEN '" + req.body.week_select + "'- INTERVAL 4 WEEK AND '" + req.body.week_select + "' " +
                "GROUP BY u.username;";

            var chronic = [];
            connection.query(sql, function (err, result) {
                if (err) throw err;


                chronic = result;


                sql = "SELECT u.position, m.date, dayofweek(m.date) as indexday, " +
                    "AVG(w.player_sRPE) as pavg, m.duration, m.time " +
                    "FROM  master.player_workouts w " +
                    "INNER JOIN master.user u ON u.username = w.username " +
                    "INNER JOIN master.workouts m ON w.workoutID = m.workoutid " +
                    "WHERE w.teamID = '" + teamid[0].teamID + "' " +
                    "AND u.teamID = '" + teamid[0].teamID + "' " +
                    "AND m.teamID = '" + teamid[0].teamID + "' " +
                    "AND m.date " +
                    "BETWEEN  DATE(DATE_ADD('" + req.body.week_select + "', INTERVAL(1-DAYOFWEEK('" + req.body.week_select + "')) DAY))  AND " +
                    " '" + req.body.week_select + "' " +
                    "group by u.position, indexday, m.time " +
                    "ORDER BY u.position, indexday, m.time; ";


                var pos_week_data = [];
                connection.query(sql, function (err, result) {
                    if (err) throw err;

                    pos_week_data = result;


                    sql = "SELECT u.position, m.date, dayofweek(m.date) as indexday, " +
                        "AVG(w.player_sRPE) as pavg, m.duration, m.time " +
                        "FROM  master.player_workouts w " +
                        "INNER JOIN master.user u ON u.username = w.username " +
                        "INNER JOIN master.workouts m ON w.workoutID = m.workoutid " +
                        "WHERE w.teamID = '" + teamid[0].teamID + "' " +
                        "AND u.teamID = '" + teamid[0].teamID + "' " +
                        "AND m.teamID = '" + teamid[0].teamID + "' " +
                        "AND NOT (u.group_chronic = 'f') " +
                        "AND m.date " +
                        "BETWEEN  DATE(DATE_ADD('" + req.body.week_select + "', INTERVAL(1-DAYOFWEEK('" + req.body.week_select + "')) DAY))  AND " +
                        " '" + req.body.week_select + "' " +
                        "group by m.date, indexday, m.time " +
                        "ORDER BY m.date, indexday, m.time; ";


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
                            "AND NOT (u.group_chronic = 'f') " +
                            "AND m.date " +
                            "BETWEEN '" + req.body.week_select + "'- INTERVAL 4 WEEK AND '" + req.body.week_select + "' " +
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
                                "AND NOT (u.group_chronic = 'f') " +
                                "AND m.date " +
                                "BETWEEN '" + req.body.week_select + "'- INTERVAL 4 WEEK AND '" + req.body.week_select + "' " +
                                "GROUP BY u.username " +
                                "ORDER BY u.username; " ;

                            var chronic_team = [];
                            connection.query(sql, function (err, result) {
                                if (err) throw err;

                                chronic_team = result;










                                sql  = "SELECT u.username, u.position, m.date, m.time, u.group_chronic, " +
                                    "SUM(w.player_sRPE * m.duration) as chronicSum " +
                                    "FROM master.user u, master.player_workouts w, master.workouts m " +
                                    "WHERE u.username = w.username " +
                                    "AND w.teamID = '" + teamid[0].teamID + "' " +
                                    "AND u.teamID = '" + teamid[0].teamID + "' " +
                                    "AND m.teamID = '" + teamid[0].teamID + "' " +
                                    "AND w.workoutID = m.workoutid " +
                                    "AND NOT (u.group_chronic = 'f') " +
                                    "AND m.date " +
                                    "BETWEEN '" + req.body.week_select + "'- INTERVAL 1 WEEK AND '" + req.body.week_select + "' " +
                                    "GROUP BY u.username " +
                                    "ORDER BY u.position; " ;



                                var acute_position = [];
                                connection.query(sql, function (err, result) {
                                    if (err) throw err;

                                    acute_position = result;


                                    sql = "SELECT u.username , m.date, m.time, u.group_chronic, " +
                                        "SUM(w.player_sRPE * m.duration)  as chronicSum " +
                                        "FROM master.user u, master.player_workouts w, master.workouts m " +
                                        "WHERE u.username = w.username " +
                                        "AND w.teamID = '" + teamid[0].teamID + "' " +
                                        "AND u.teamID = '" + teamid[0].teamID + "' " +
                                        "AND m.teamID = '" + teamid[0].teamID + "' " +
                                        "AND w.workoutID = m.workoutid " +
                                        "AND NOT (u.group_chronic = 'f') " +
                                        "AND m.date " +
                                        "BETWEEN '" + req.body.week_select + "'- INTERVAL 1 WEEK AND '" + req.body.week_select + "' " +
                                        "GROUP BY u.username " +
                                        "ORDER BY u.username; " ;

                                    var acute_team = [];
                                    connection.query(sql, function (err, result) {
                                        if (err) throw err;

                                        acute_team = result;









                                        sql = "SELECT distinct DATE(DATE_ADD(m.date, INTERVAL(1-DAYOFWEEK(m.date)) DAY)) as sunday, " +
                                            "DATE(DATE_ADD(m.date, INTERVAL(7-DAYOFWEEK(m.date)) DAY)) as saturday " +
                                            "FROM master.workouts m " +
                                            "WHERE m.teamID = '" + teamid[0].teamID + "' ;";


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


                                            res.render('weeklySummary', {
                                                username: req.user,
                                                week_data: week_data,
                                                chronic_week: chronic,
                                                week_set: week_set,
                                                pos_week_data: pos_week_data,
                                                team_week_data: team_week_data,
                                                chronic_position: chronic_position,
                                                chronic_team: chronic_team,
                                                acute_position: acute_position,
                                                acute_team: acute_team
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