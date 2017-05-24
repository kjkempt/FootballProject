var express = require('express');
var router = express.Router();

/* GET home page. Template for if you need to add an custom routers for this.*/
router.get('/', function(req, res, next) {
    res.render('workoutManager', { title: 'Express' });
});

module.exports = router;
