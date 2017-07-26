/**
 * Created by kemptk on 7/14/17.
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





router.post('/selectMeal', function(req, res, next){

    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function (err, result) {
        if (err) throw err;

        teamid = result;


        sql = "SELECT * FROM master.meals " +
            "WHERE teamID = '"+teamid[0].teamID+"' " +
            "ORDER BY date DESC LIMIT 10;";

        var recent_dates = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;

            recent_dates = result;

            for (var i = 0; i < recent_dates.length; i++) {

                var day = recent_dates[i].date;

                day = day.toISOString().split('T')[0];

                recent_dates[i].date = day;

                recent_dates[i].date = recent_dates[i].date + ", " + recent_dates[i].name;


            }


            sql = "select * " +
                "from master.user u " +
                "where u.teamID = '" + teamid[0].teamID + "' " +
                "and u.privileges = 'Player' " +
                "and u.username NOT IN( " +
                "select u.username " +
                "from master.user u " +
                "INNER JOIN master.player_meals p ON p.username = u.username " +
                "where u.teamID = '" + teamid[0].teamID + "' " +
                "and u.privileges = 'Player' " +
                "and p.meal_id = '"+req.body.meal_select+"') " +
                "order by u.last_name; ";

            var players = [];
            connection.query(sql, function (err, result) {
                if (err) throw err;

                players = result;

                res.render('nutritionMealTracker', {
                    username: req.session.user,
                    recent_dates: recent_dates,
                    players: players
                });




            });




        });


    });
});