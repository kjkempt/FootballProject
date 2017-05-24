/**
 * Created by bskaja on 5/23/17.
 */
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'footballdb.cr1jtswtem4i.us-west-2.rds.amazonaws.com',
    user     : 'masterUsername',
    password : 'HNuxJSEjqXUS!auk-eRV6CG8+!^JJAt2M?-Lc4y#+',
    database : 'master'
});

function updateGraph(username, period) {

    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });

    var sql = "SELECT workoutID, sRPE FROM player_workouts WHERE username= " + "'" + username + "'";
    var data = [];
    connection.query(sql, function (err, result) {
        if (err) throw err;

        for (var i = 0; i < result.length; i++) {
            var sql2 = "SELECT name, date, sRPE FROM workouts WHERE workoutID= " + "'" + result[i].workoutID + "'";

            connection.query(sql2, function (err, result2) {
                if (err) throw err;

                data.append({
                    period: result2[0].date,
                    player: result[i].sRPE,
                    coach_prediction: result2[0].sRPE});
                });
        }
    });

    Morris.Area({
        element: 'morris-area-chart',
        data: data,
        xkey: 'period',
        ykeys: ['player', 'coach_prediction'],
        labels: ['Player', 'Coach Prediction'],
        pointSize: 2,
        hideHover: 'auto',
        resize: true
    });

    connection.disconnect();
}