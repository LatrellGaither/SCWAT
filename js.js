// Create the chart
var data = []

// load data and represent it in highmaps
$(document).ready ( function () {
  init();

  $.ajax({
    type: "GET",
    url: "state_count.csv",
    dataType: "text",
    success: function(data) {processData(data);}
 });
});

// initialize the data set in order for highmaps
// to recognize it.
function init() {
  data = [
      ['us-ma', 0],
      ['us-wa', 0],
      ['us-ca', 0],
      ['us-or', 0],
      ['us-wi', 0],
      ['us-me', 0],
      ['us-mi', 0],
      ['us-nv', 0],
      ['us-nm', 0],
      ['us-co', 0],
      ['us-wy', 0],
      ['us-ks', 0],
      ['us-ne', 0],
      ['us-ok', 0],
      ['us-mo', 0],
      ['us-il', 0],
      ['us-in', 0],
      ['us-vt', 0],
      ['us-ar', 0],
      ['us-tx', 0],
      ['us-ri', 0],
      ['us-al', 0],
      ['us-ms', 0],
      ['us-nc', 0],
      ['us-va', 0],
      ['us-ia', 0],
      ['us-md', 0],
      ['us-de', 0],
      ['us-pa', 0],
      ['us-nj', 0],
      ['us-ny', 0],
      ['us-id', 0],
      ['us-sd', 0],
      ['us-ct', 0],
      ['us-nh', 0],
      ['us-ky', 0],
      ['us-oh', 0],
      ['us-tn', 0],
      ['us-wv', 0],
      ['us-dc', 0],
      ['us-la', 0],
      ['us-fl', 0],
      ['us-ga', 0],
      ['us-sc', 0],
      ['us-mn', 0],
      ['us-mt', 0],
      ['us-nd', 0],
      ['us-az', 0],
      ['us-ut', 0],
      ['us-hi', 0],
      ['us-ak', 0],
      ['undefined', 0]
  ];
}

// Scan through state_count.cv and update the dataset with the number
// of currently running jobs by state.
function processData(allText) {
  var allTextLines = allText.split(/\r\n|\n/);
  var headers = allTextLines[0].split('\t');
  for (var i = 1; i < allTextLines.length; ++i) {
    var states = allTextLines[i].split('\t');
    if (states.length == headers.length) {
      var cur_state = states[0].replace(/\"/g, "\'");
      var state_count = parseInt(states[1]);
      var iterator = data.keys();
      for (let key of iterator) {
        var arr = data[key];
        var state = arr[0];
        if (state.localeCompare(cur_state) == 0){
          arr[1] = state_count;
          break;
        }
      }
    }
  }
  loadHighmaps();
}

function dummyFunc(state) {
  alert("dummy func called for state " + state);
}

// Passes the data into highmaps
function loadHighmaps() {
  console.log(data);
  Highcharts.mapChart('map_container', {
      chart: {
          backgroundColor: '#c7d2e2',
          map: 'countries/us/us-all'
      },

      title: {
          text: ''
      },

      plotOptions: {
        series: {
          events: {
            click: function (e) {
                        var text = '<b>Clicked</b><br>State: ' + e.point.name + '<br>Running Jobs:' + e.point.value;
                        if (!this.chart.clickLabel) {
                            this.chart.clickLabel = this.chart.renderer.label(text, 0, 250)
                                .css({
                                    width: '180px'
                                })
                                .add();
                        } else {
                            this.chart.clickLabel.attr({
                                text: text
                            });
                        }
                        dummyFunc(e.point.name);
                    }
                }
            }
        },

      series: [ {
        states: {
        }
      },
      {
        name: 'Running jobs',
        type: 'mapbubble',
        color: '#76c6f7',
        minSize: 0,
        maxSize: '20%',
        data: data,
        joinBy: null,
        tooltip: {
          pointFormat: '{point.properties.hc-a2}: {point.z} running jobs'
        }
      }]
  });
}
