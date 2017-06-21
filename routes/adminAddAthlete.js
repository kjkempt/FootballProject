/**
 * Created by kemptk on 6/9/17.
 */
var express = require('express');
var router = express.Router();

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




router.post('/addPerson', function(req, res, next) {

    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function(err, result) {

        teamid = result;

        sql = "SELECT * FROM master.user where username = '" + req.body.user_name + "';";
        var message = "";


        connection.query(sql, function (err, result) {
            if (result.length > 0) {
                message = "Error. Username already taken";
                res.render('adminAddAthlete', {
                    username: req.session.user,
                    message: message
                });
            }
        });


        if (!req.body.position) {

            sql = "INSERT INTO master.user (username, password, privileges, first_name, last_name, position, teamID) " +
                "VALUES('" + req.body.user_name + "', '" + req.body.password + "', '" + req.body.priv + "', '" + req.body.first_name + "'," +
                " '" + req.body.last_name + "', 'CO', '"+teamid[0].teamID+"');";
        }
        else {
            sql = "INSERT INTO master.user (username, password, privileges, first_name, last_name, position, teamID) " +
                "VALUES('" + req.body.user_name + "', '" + req.body.password + "', '" + req.body.priv + "', '" + req.body.first_name + "'," +
                " '" + req.body.last_name + "', '" + req.body.position + "', '"+teamid[0].teamID+"');";
        }


        connection.query(sql, function (err, result) {
            if (err) throw err;

            res.render('adminAddAthlete', {
                username: req.session.user,
                message: "Addition Successful"
            });
        });


    });








});


module.exports = router;