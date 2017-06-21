/**
 * Created by kemptk on 6/21/17.
 */

var express = require('express');
var router = express.Router();
var app = require('../app.js');


/* GET home page. */
/*
 router.get('/', function(req, res, next) {
 res.render('teamData', { title: 'Express' });
 });*/

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



router.post('/register', function(req, res, next) {

    var sql = "SELECT teamID from master.user where teamID = '" + req.body.teamid + "';";

    var teamid = [];
    var message = "";
    connection.query(sql, function(err, result) {

        if (result.length > 0) {
            message = "Error. Team ID already taken";
            res.render('universeRegister', {
                message: message
            });
        }


    });

        sql = "SELECT * FROM master.user where username = '" + req.body.user_name + "';";

        connection.query(sql, function (err, result) {
            if (result.length > 0) {
                message = "Error. Username already taken";
                res.render('universityRegister', {
                    message: message
                });
            }
        });


    sql = "INSERT INTO master.user (username, password, first_name, last_name, teamID) " +
        "VALUES('" + req.body.user_name + "', '" + req.body.password + "', '" + req.body.first_name + "'," +
        " '" + req.body.last_name + "', '"+ req.body.teamid +"');";



        connection.query(sql, function (err, result) {
            if (err) throw err;

            res.render('universeRegister', {
            });
        });











});