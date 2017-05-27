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
    console.log("Connected! WM");
});



router.post('/playerInput', function(req, res, next) {
    //var name = req.username;

    var sql = "INSERT INTO player_workouts(username, workoutID, player_sRPE) " +
        "VALUES('"+req.body.playerName+"', '1' ,'"+req.body.playerRPE+"')";

    connection.query(sql, function (err, result) {
        if (err) {
            throw err;
        } else
            res.send("Success");
    });


});