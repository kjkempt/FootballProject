/**
 * Created by kemptk on 7/13/17.
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




router.post('/addgroup', function(req, res, next) {

    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function (err, result) {
        if (err) throw err;

        teamid = result;


        sql = "select * from master.group_designation " +
            "where teamID = '" + teamid[0].teamID + "' " +
            "and dgroup <> 'Team' ;";


        var groups = [];
        connection.query(sql, function (err, result) {
            groups = result;

            sql = "select * from master.group_designation where dgroup = '" + req.body.add_group + "' " +
                "and teamID = '" + teamid[0].teamID + "' ;";


            connection.query(sql, function (err, result) {
                if (err) throw err;


                if (result.length > 0) {
                    res.render('adminSettings', {
                        username: req.session.user,
                        message_add: "Group already exists",
                        groups: groups,
                        message_delete: ""
                    });
                }
                if (result.length === 0) {
                    sql = "INSERT INTO master.group_designation (dgroup, teamID) " +
                        "VALUES ('" + req.body.add_group + "', '" + teamid[0].teamID + "'); ";

                    connection.query(sql, function (err, result) {
                        if (err) throw err;


                        sql = "select * from master.group_designation " +
                            "where teamID = '" + teamid[0].teamID + "' " +
                            "and dgroup <> 'Team' ;";


                        groups = [];
                        connection.query(sql, function (err, result) {
                            groups = result;

                            res.render('adminSettings', {
                                username: req.session.user,
                                message_add: "Group added",
                                groups: groups,
                                message_delete: ""
                            });

                        });


                    });
                }

            });


        });

    });




});



router.post('/deletegroup', function(req, res, next) {

    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function (err, result) {
        if (err) throw err;

        teamid = result;

        sql = "Delete from master.group_designation where dgroup = '" + req.body.delete_group + "' " +
            "AND teamID = '" + teamid[0].teamID + "';";

        connection.query(sql, function (err, result) {
            if (err) throw err;


            sql = "select * from master.group_designation " +
                "where teamID = '" + teamid[0].teamID + "' " +
                "and dgroup <> 'Team' ;";


            var groups = [];
            connection.query(sql, function (err, result) {
                groups = result;


                res.render('adminSettings', {
                    username: req.session.user,
                    message_add: "",
                    groups: groups,
                    message_delete: "Group deleted"
                });


            });


        });


    });


});


router.post('/doubleSelect', function(req, res, next){

    var sql = "SELECT teamID from master.user where username = '" + req.session.user + "';";

    var teamid = [];
    connection.query(sql, function (err, result) {
        if (err) throw err;

        teamid = result;


        sql = "select * from master.group_designation " +
            "where teamID = '" + teamid[0].teamID + "' " +
            "and dgroup <> 'Team' ;";


        var groups = [];
        connection.query(sql, function (err, result) {
            groups = result;

            sql = "update master.user set group_chronic = '" + req.body.switch + "' " +
                "where username = '" + req.session.user + "';";
            connection.query(sql, function (err, result) {
                if (err) throw err;

                res.render('adminSettings', {
                    username: req.session.user,
                    message_add: "",
                    groups: groups,
                    message_delete: ""
                });
            });
        });
    });
});

