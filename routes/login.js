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
  // Verify if already logged in.
  res.render('login', { title: 'Express' });
});

router.post('/attemptLogin', function(req, res) {

  var sql = "SELECT username, password FROM testUser WHERE username= " + "'" + req.body.username + "'";
    
  connection.query(sql, function (err, result) {
      if (err) throw err;

      if (result.length !== 0 && result[0].password === req.body.password) {
          res.render('index', { title: 'Logged In' });
      } else {
          res.render('login', { title: 'Failed' });
      }
  });
});

module.exports = router;
