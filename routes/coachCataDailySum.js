/**
 * Created by kemptk on 7/19/17.
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



router.post('/select', function(req, res, next){
    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function (err, result) {
        if (err) throw err;

        teamid = result;




        sql = "SELECT * FROM master.cata_workouts " +
            "WHERE teamid = '"+teamid[0].teamID+"' " +
            "ORDER BY date DESC LIMIT 10;";

        var recent_dates = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;

            recent_dates = result;

            for(var i = 0; i < recent_dates.length; i++) {

                var day = recent_dates[i].date;

                day = day.toISOString().split('T')[0];

                recent_dates[i].date = day;

                recent_dates[i].date = recent_dates[i].date + ", " + recent_dates[i].name;




            }

            sql = "select * from master.cata_player_workouts p " +
            "INNER JOIN master.cata_workouts w ON w.id = p.workout_id " +
                "INNER JOIN master.user u ON p.username = u.username " +
            "WHERE w.id = '"+req.body.date_select+"' " +
                "AND p.teamid = '"+teamid[0].teamID+"';";

            var pd = [];
            connection.query(sql, function (err, result) {
                if (err) throw err;

                pd = result;



                res.render('coachCataDailySum', {
                    username: req.session.user,
                    recent: recent_dates,
                    pd: pd
                });

            });






        });


    });

});