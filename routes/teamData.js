/**
 * Created by kemptk on 5/31/17.
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
    console.log("Connected! TD");
});

