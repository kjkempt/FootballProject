/**
 * Created by evanskaja on 5/23/17.
 */
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

var sql = "SELECT DISTINCT playerName FROM testTable";

connection.query(sql, function(err, result) {
    if (err) throw err;

    var select = document.getElementById("playerNameSelect");
    var opt = document.createElement('option');
    opt.appendChild( document.createTextNode("New Option"));
    opt.value = "Evan";
    select.appendChild(opt);

});



