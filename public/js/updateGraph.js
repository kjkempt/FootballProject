initPlayerGraph();
initLoadGraph();

function buildPlayerGraph(d) {
    new Morris.Line({
        element: 'morris-area-chart',
        data: d,
        xkey: 'period',
        ykeys: ['player', 'coach_prediction', 'average'],
        labels: ['Player', "Coach Prediction", 'Average'],
        xLabels: 'day',
        xLabelFormat: function(date) {
            return (date.getMonth()+1) +'/'+date.getDate()+'/'+date.getFullYear();
        },
        period:'day',
        dateFormat: function(period) {
            d = new Date(period);
            return (d.getMonth()+1) +'/'+d.getDate()+'/'+d.getFullYear();
        }
    });
}

function initPlayerGraph() {
    new Morris.Line({
        element: 'morris-area-chart',
        data: [{}],
        xkey: 'period',
        ykeys: ['player', 'coach_prediction', 'average'],
        labels: ['Player', "Coach Prediction", 'Average'],
        xLabels: 'day',
        xLabelFormat: function(date) {
            return (date.getMonth()+1) +'/'+date.getDate()+'/'+date.getFullYear();
        },
        period:'day',
        dateFormat: function(period) {
            d = new Date(period);
            return (d.getMonth()+1) +'/'+d.getDate()+'/'+d.getFullYear();
        }
    });
}

function buildLoadGraph(d, n, element) {
    var runningTotalPlayer = 0;
    var runningTotalCoach = 0;
    var runningTotalAverage = 0;

    var loadData = [];

    for (var i = 0; i < d.length; i++) {
        if (isDaysOld(n, new Date(d[i].period))) {
            runningTotalPlayer += d[i].player * d[i].duration;
            runningTotalCoach += d[i].coach_prediction * d[i].duration;
            runningTotalAverage += d[i].average * d[i].duration;
            loadData.push({
                period: d[i].period,
                player: runningTotalPlayer,
                coach_prediction: runningTotalCoach,
                average: runningTotalAverage
            })
        }
    }
    
    new Morris.Line({
        element: element,
        data: loadData,
        xkey: 'period',
        ykeys: ['player', 'coach_prediction', 'average'],
        labels: ['Player', "Coach Prediction", 'Average'],
        xLabels: 'day',
        behaveLikeLine: true,
        xLabelFormat: function(date) {
            return (date.getMonth()+1) +'/'+date.getDate()+'/'+date.getFullYear();
        },
        period:'day',
        dateFormat: function(period) {
            d = new Date(period);
            return (d.getMonth()+1) +'/'+d.getDate()+'/'+d.getFullYear();
        }
    });
}

function isDaysOld(n, selectedTimestamp) {
    var timestamp = new Date().getTime() - new Date().getUTCHours() - new Date().getUTCMinutes()
        - new Date().getUTCSeconds() - new Date().getUTCMilliseconds() - (n * 24 * 60 * 60 * 1000);
    s = selectedTimestamp.getTime() - selectedTimestamp.getUTCHours() - selectedTimestamp.getUTCMinutes()
    - selectedTimestamp.getUTCSeconds() - selectedTimestamp.getUTCMilliseconds();
    console.log(timestamp + " " + selectedTimestamp.getUTCHours());
    console.log(s);

    if(timestamp <= s) {  // The selected time is less than n days from now
        console.log('true');
        return true;
    }
    else {
        console.log('false');
        return false;
    }
}

function initLoadGraph() {
    new Morris.Line({
        element: 'morris-chart',
        data: [{}],
        xkey: 'period',
        ykeys: ['player', 'coach_prediction', 'average'],
        labels: ['Player', "Coach Prediction", 'Average'],
        xLabels: 'day',
        xLabelFormat: function(date) {
            return (date.getMonth()+1) +'/'+date.getDate()+'/'+date.getFullYear();
        },
        period:'day',
        dateFormat: function(period) {
            d = new Date(period);
            return (d.getMonth()+1) +'/'+d.getDate()+'/'+d.getFullYear();
        }
    });
}