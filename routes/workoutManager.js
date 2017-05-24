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



/* GET home page. Template for if you need to add an custom routers for this.*/
router.get('/', function(req, res, next) {
    res.render('workoutManager', { title: 'Express' });
});



router.post('/addWorkout', function(req, res, next) {
    console.log(req)
    var sql = "SELECT name FROM workouts";

    connection.query(sql, function (err, result) {
        if (err) throw err;
    console.log(results.name[0]);
    console.log(results.name[1]);



    });
});


module.exports = router;
