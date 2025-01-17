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

    // res.send(req.body.d);

    sql = "SELECT DATE(DATE_ADD('"+req.body.d+"', INTERVAL(7-DAYOFWEEK('"+req.body.d+"')) DAY)) as saturday;";
    var s = [];
    connection.query(sql, function (err, result) {
        if (err) throw err;


        s = result;
        var date = s[0].saturday;

        date = date.toISOString().split('T')[0];
        console.log(date);
        //res.send(date);




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
                "BETWEEN  DATE(DATE_ADD('" + date + "', INTERVAL(1-DAYOFWEEK('" + date + "')) DAY))  AND " +
                " '" + date + "' " +
                "   ORDER BY u.username, indexday,  m.time;";



            var player_week_data = [];
            connection.query(sql, function (err, result) {
                if (err) throw err;


                player_week_data = result;

                sql = "SELECT DATE_SUB('" + date + "', INTERVAL 7 DAY) as date;";

                var prev_week = [];
                connection.query(sql, function (err, result) {
                    if (err) throw err;


                    prev_week = result;




                    //do by workoutID



                    sql = "SELECT u.username, u.first_name, u.last_name, u.position, " +
                        "SUM(w.player_sRPE * m.duration) as chronicSum, m.date," +
                        "(weekofyear('" + date + "') - weekofyear(m.date) + 1) as weekcount  " +
                        "FROM master.user u, master.player_workouts w, master.workouts m " +
                        "WHERE u.username = w.username " +
                        "AND w.teamID = '"+teamid[0].teamID+"' " +
                        "AND u.teamID = '"+teamid[0].teamID+"' " +
                        "AND m.teamID = '"+teamid[0].teamID+"' " +
                        "AND w.workoutID = m.workoutid " +
                        "AND m.date " +
                        "BETWEEN '" + prev_week[0].date + "'- INTERVAL 4 WEEK AND '" + prev_week[0].date + "' " +
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
                            "BETWEEN  DATE(DATE_ADD('" + date + "', INTERVAL(1-DAYOFWEEK('" + date + "')) DAY))  AND " +
                            " '" + date + "' " +
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
                                "AND u.group_chronic = 't' " +
                                "AND m.date " +
                                "BETWEEN  DATE(DATE_ADD('" + date + "', INTERVAL(1-DAYOFWEEK('" + date + "')) DAY))  AND " +
                                " '" + date + "' " +
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
                                    "AND u.group_chronic = 't' " +
                                    "AND m.date " +
                                    "BETWEEN '" + date + "'- INTERVAL 4 WEEK AND '" + date + "' " +
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
                                        "BETWEEN '" + date + "'- INTERVAL 4 WEEK AND '" + date + "' " +
                                        "GROUP BY u.username " +
                                        "ORDER BY u.username; " ;

                                    var chronic_team = [];
                                    connection.query(sql, function (err, result) {
                                        if (err) throw err;

                                        chronic_team = result;

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
                                            "BETWEEN '" + date + "'- INTERVAL 5 WEEK AND" +
                                            " '" + date + "' - INTERVAL 1 WEEK " +
                                            "GROUP BY u.username " +
                                            "ORDER BY u.position; " ;

                                        var chronic_position_previous = [];
                                        connection.query(sql, function (err, result) {
                                            if (err) throw err;

                                            chronic_position_previous = result;



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
                                                "BETWEEN '" + date + "'- INTERVAL 5 WEEK AND " +
                                                " '" + date + "' - INTERVAL 1 WEEK " +
                                                "GROUP BY u.username " +
                                                "ORDER BY u.username; " ;

                                            var chronic_team_previous = [];
                                            connection.query(sql, function (err, result) {
                                                if (err) throw err;

                                                chronic_team_previous = result;












                                                sql  = "SELECT u.username, u.position, m.date, m.time, u.group_chronic, " +
                                                    "SUM(w.player_sRPE * m.duration) as chronicSum " +
                                                    "FROM master.user u, master.player_workouts w, master.workouts m " +
                                                    "WHERE u.username = w.username " +
                                                    "AND w.teamID = '" + teamid[0].teamID + "' " +
                                                    "AND u.teamID = '" + teamid[0].teamID + "' " +
                                                    "AND m.teamID = '" + teamid[0].teamID + "' " +
                                                    "AND w.workoutID = m.workoutid " +
                                                    "AND u.group_chronic = 't' " +
                                                    "AND m.date " +
                                                    "BETWEEN  DATE(DATE_ADD('" + date + "', INTERVAL(1-DAYOFWEEK('" + date + "')) DAY))  AND " +
                                                    " '" + date + "' " +
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
                                                        "AND u.group_chronic = 't' " +
                                                        "AND m.date " +
                                                        "BETWEEN  DATE(DATE_ADD('" + date + "', INTERVAL(1-DAYOFWEEK('" + date + "')) DAY))  AND " +
                                                        " '" +date + "' " +
                                                        "GROUP BY u.username " +
                                                        "ORDER BY u.username; " ;

                                                    var acute_team = [];
                                                    connection.query(sql, function (err, result) {
                                                        if (err) throw err;

                                                        acute_team = result;



                                                        sql = "SELECT u.username , m.date, m.time, u.group_chronic, " +
                                                            "SUM(w.player_sRPE * m.duration) / 4 as chronicSum,  count(distinct u.username) as playerCount " +
                                                            "FROM master.user u, master.player_workouts w, master.workouts m " +
                                                            "WHERE u.username = w.username " +
                                                            "AND w.teamID = '" + teamid[0].teamID + "' " +
                                                            "AND u.teamID = '" + teamid[0].teamID + "' " +
                                                            "AND m.teamID = '" + teamid[0].teamID + "' " +
                                                            "AND w.workoutID = m.workoutid " +
                                                            "AND NOT (u.group_chronic = 't') " +
                                                            "AND m.date " +
                                                            "BETWEEN '" +date + "'- INTERVAL 4 WEEK AND '" + date + "' " +
                                                            "GROUP BY u.group_chronic " +
                                                            "ORDER BY u.group_chronic; ";

                                                        var cdg = [];
                                                        connection.query(sql, function (err, result) {
                                                            if (err) throw err;

                                                            cdg = result;


                                                            sql = "SELECT u.username , m.date, m.time, u.group_chronic, " +
                                                                "SUM(w.player_sRPE * m.duration)  as chronicSum, count(distinct u.username) as playerCount " +
                                                                "FROM master.user u, master.player_workouts w, master.workouts m " +
                                                                "WHERE u.username = w.username " +
                                                                "AND w.teamID = '" + teamid[0].teamID + "' " +
                                                                "AND u.teamID = '" + teamid[0].teamID + "' " +
                                                                "AND m.teamID = '" + teamid[0].teamID + "' " +
                                                                "AND w.workoutID = m.workoutid " +
                                                                "AND NOT (u.group_chronic = 't') " +
                                                                "AND m.date " +
                                                                "BETWEEN  DATE(DATE_ADD('" + date + "', INTERVAL(1-DAYOFWEEK('" + date + "')) DAY))  AND " +
                                                                " '" + date + "' " +
                                                                "GROUP BY u.group_chronic " +
                                                                "ORDER BY u.group_chronic; ";

                                                            var adg = [];
                                                            connection.query(sql, function (err, result) {
                                                                if (err) throw err;

                                                                adg = result;






                                                                    sql = "SELECT * " +
                                                                        "FROM  master.workouts " +
                                                                        "WHERE teamID = '" + teamid[0].teamID + "' " +
                                                                        "AND date " +
                                                                        "BETWEEN  DATE(DATE_ADD('" + date + "', INTERVAL(1-DAYOFWEEK('" + date + "')) DAY))  AND " +
                                                                        " '" + date + "' " +
                                                                        " ;";

                                                                    var workouts = [];
                                                                    connection.query(sql, function (err, result) {
                                                                        if (err) throw err;


                                                                        workouts = result;


                                                                        res.render('archives', {
                                                                            username: req.user,
                                                                            player_week_data: player_week_data,
                                                                            player_chronic: player_chronic,
                                                                            workouts: workouts,
                                                                            pos_week_data: pos_week_data,
                                                                            team_week_data: team_week_data,
                                                                            chronic_position: chronic_position,
                                                                            chronic_team: chronic_team,
                                                                            acute_position: acute_position,
                                                                            acute_team: acute_team,
                                                                            cdg: cdg,
                                                                            adg: adg,
                                                                            chronic_position_previous: chronic_position_previous,
                                                                            chronic_team_previous: chronic_team_previous
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












