initPlayerGraph();

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