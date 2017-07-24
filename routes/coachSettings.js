/**
 * Created by kemptk on 7/23/17.
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

router.post('/addPlayer', function(req, res, next) {



    var sql = "update master.user set group_cata = 'yes' where username = '"+req.body.player+"';";


    connection.query(sql, function(err , result)
    {
        if(err) throw err;

         sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

        var teamid = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;

            teamid = result;

            sql = "SELECT username, first_name, last_name FROM master.user " +
                "where privileges = 'Player' " +
                "and teamID = '" + teamid[0].teamID + "' " +
                "and username NOT IN( " +
                "SELECT username FROM master.user " +
                "where privileges = 'Player' " +
                "and teamID = '" + teamid[0].teamID + "' " +
                "and group_cata = 'yes') " +
                "order by last_name;";

            var add_player = [];
            connection.query(sql, function (err, result) {
                if (err) throw err;

                add_player = result;

                sql = "SELECT username, first_name, last_name FROM master.user " +
                    "where privileges = 'Player' " +
                    "and teamID = '" + teamid[0].teamID + "' " +
                    "and group_cata = 'yes' " +
                    "order by last_name;";

                var delete_player = [];
                connection.query(sql, function (err, result) {
                    if (err) throw err;

                    delete_player = result;

                    res.render('coachSettings', {
                        username: req.session.user,
                        add_player: add_player,
                        message_add: "Addition successful",
                        delete_player: delete_player,
                        message_delete: ""
                    });
                });
            });
        });

    });



});

router.post('/deletePlayer', function(req, res, next) {



    var sql = "update master.user set group_cata = 'no' where username = '"+req.body.player+"';";


    connection.query(sql, function(err , result)
    {
        if(err) throw err;

        sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

        var teamid = [];
        connection.query(sql, function (err, result) {
            if (err) throw err;

            teamid = result;

            sql = "SELECT username, first_name, last_name FROM master.user " +
                "where privileges = 'Player' " +
                "and teamID = '" + teamid[0].teamID + "' " +
                "and username NOT IN( " +
                "SELECT username FROM master.user " +
                "where privileges = 'Player' " +
                "and teamID = '" + teamid[0].teamID + "' " +
                "and group_cata = 'yes') " +
                "order by last_name;";

            var add_player = [];
            connection.query(sql, function (err, result) {
                if (err) throw err;

                add_player = result;

                sql = "SELECT username, first_name, last_name FROM master.user " +
                    "where privileges = 'Player' " +
                    "and teamID = '" + teamid[0].teamID + "' " +
                    "and group_cata = 'yes' " +
                    "order by last_name;";

                var delete_player = [];
                connection.query(sql, function (err, result) {
                    if (err) throw err;

                    delete_player = result;

                    res.render('coachSettings', {
                        username: req.session.user,
                        add_player: add_player,
                        message_add: "",
                        delete_player: delete_player,
                        message_delete: "Deletion successful"
                    });
                });
            });
        });

    });



});