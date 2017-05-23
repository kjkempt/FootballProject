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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

function validateLogin(username, password) {
    console.log(username);
    console.log(password);
    var sql = "SELECT username, password FROM testUser WHERE username= " + "'" + username + "'";

    return connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        if (result.length == 0) {
            return false;
        }

        return true;
    });
}

router.post('/login', function(req, res) {
  console.log(req.body);
  if (validateLogin(req.body.username, req.body.password)) {
      res.render('index', { title: 'Logged In' });
  } else {
      res.render('index', { title: 'Failed' });
  }
});

module.exports = router;
