/**
 * Created by kemptk on 6/26/17.
 */
var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'footballdb.cr1jtswtem4i.us-west-2.rds.amazonaws.com',
    user     : 'masterUsername',
    password : 'HNuxJSEjqXUS!auk-eRV6CG8+!^JJAt2M?-Lc4y#+',
    database : 'master',
    acquireTimeout: 1000000
});




module.exports = router;


router.post('/changepw', function(req, res, next) {




    var sql = "SELECT password from master.user where password = '" + req.body.old_pass + "' and " +
    "username = '"+ req.user +"';";

    connection.query(sql, function(err, result) {






        if(result.length == 0)
        {
            res.render('login', { message: 'Unsuccessful password change, please log in and try again.'});
        }
        else {
            //insert query below inserts form data into workouts database with the submitted workout info

            sql = "update master.user " +
            "set password = '"+ req.body.new_pass +"' " +
            "where username = '"+ req.user +"';";
            connection.query(sql, function (err, result) {
                if (err) {
                    throw err;
                } else
                    res.render('login', {
                        message: 'Successful password change'
                    });
            });

        }





    });


});
