/**
 * Created by kemptk on 6/28/17.
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
    console.log("Connected!");
});


router.post('/signin', function(req, res, next) {







    var sql = "SELECT teamID from master.user where username = '" + req.user + "';";

    var teamid = [];
    connection.query(sql, function(err, result) {
        if(err) throw err;

        teamid = result;





            sql = "select MAX(mealID) as max from master.meals where teamID = '" + teamid[0].teamID + "' ;";

            var meal_id = [];
            connection.query(sql, function(err, result) {
                if (err) throw err;

                meal_id = result;

                sql = "select username, first_name from master.user where meal = '"+req.body.player_id+"'  " +
                    "AND teamID  = '" + teamid[0].teamID + "' ;";

                connection.query(sql, function(err, result) {
                    if (err) throw err;

                    if(result.length == 0)
                    {

                        res.render('nutritionSession',
                            {
                                username: req.user,
                                team_id: teamid[0].teamID,
                                meal_id: meal_id[0].max,
                                message: "Incorrect ID"
                            });
                    }
                    else
                    {
                        res.render('nutritionSession',
                            {
                                username: req.user,
                                team_id: teamid[0].teamID,
                                meal_id: meal_id[0].max,
                                message: "Thank you "+result[0].first_name+" "
                            });
                    }




                });


            });

        });




});