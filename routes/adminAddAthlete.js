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

    res.render('adminAddAthlete', {
        username: req.session.user,
        message: 'Post went through'});

});


module.exports = router;