/**
 * Created by kemptk on 6/21/17.
 */

var express = require('express');
var router = express.Router();
var app = require('../../app.js');


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



var nodemailer = require('nodemailer');



router.post('/register', function(req, res, next) {


    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'teamexertuservice@gmail.com',
            pass: '7qK-744-z9w-kRY'
        }
    });

    var mailOptions = {
        from: 'teamexertuservice@gmail.com',
        to: 'kyle.kempt@gmail.com',
        subject: 'Welcome to TeamExert U',
        text: '' + req.body.first_name + ', ' +
        'Thank you for signing up and if you have any questions or technical concerns, please ' +
        'use this email to contact our technician. If you have questions regarding customization ' +
        'and would like to set up a meeting with him, contact his email at kyle.kempt@gmail.com. Thank you' +
        'again for signing up with us and we hope to make this experience as benefical and useful to your team' +
        'as possible! ' +
        '' +
        'TeamExert U'
    };




    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.send("Gmail");


    /*

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
                res.render('home/universityRegister', {
                    message: message
                });
            }
        });


    sql = "INSERT INTO master.user (username, password, first_name, last_name, teamID) " +
        "VALUES('" + req.body.user_name + "', '" + req.body.password + "', '" + req.body.first_name + "'," +
        " '" + req.body.last_name + "', '"+ req.body.teamid +"');";



        connection.query(sql, function (err, result) {
            if (err) throw err;

            res.render('home/universeRegister', {
            });
        });




*/






});