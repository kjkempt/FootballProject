/**
 * Created by kemptk on 6/9/17.
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


router.post('/delete', function(req, res, next) {




    var sql = "delete from master.user where username = '"+req.body.player+"';";

    connection.query(sql, function(err , result)
    {
        if(err) throw err;

        var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

        var teamid = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;

            teamid = result;


            sql = "SELECT * from master.user " +
                "where teamID = '"+teamid[0].teamID+"' " +
                "and privileges = 'Player'" +
                "ORDER BY last_name;";

            var players = [];
            connection.query(sql, function (err, result) {
                if (err) throw err;

                players = result;

                res.render('adminDeleteAthlete', {
                    username: req.session.user,
                    players: players
                });
            });

        });

    });



});





