/**
 * Created by LiuyinC on 10/25/15.
 */
function main(rawData) {
  var aggData = aggregate(rawData);
  draw(rawData, aggData);
}

function aggregate(data) {
  var result = [
    {
      key: '1',
      value: [
        {
          key: 'female',
          value: [
            {
              key: 'survived',
              value: 0
            },
            {
              key: 'total',
              value: 0
            }
          ]
        },
        {
          key: 'male',
          value: [
            {
              key: 'survived',
              value: 0
            },
            {
              key: 'total',
              value: 0
            }
          ]
        }
      ]
    },
    {
      key: '2',
      value: [
        {
          key: 'female',
          value: [
            {
              key: 'survived',
              value: 0
            },
            {
              key: 'total',
              value: 0
            }
          ]
        },
        {
          key: 'male',
          value: [
            {
              key: 'survived',
              value: 0
            },
            {
              key: 'total',
              value: 0
            }
          ]
        }
      ]
    },
    {
      key: '3',
      value: [
        {
          key: 'female',
          value: [
            {
              key: 'survived',
              value: 0
            },
            {
              key: 'total',
              value: 0
            }
          ]
        },
        {
          key: 'male',
          value: [
            {
              key: 'survived',
              value: 0
            },
            {
              key: 'total',
              value: 0
            }
          ]
        }
      ]
    }
  ];

  data.forEach(function(d) {
    var pclass = result.filter(function(pclass) {
      return pclass.key == d.Pclass;
    })[0];
    var sex = pclass.value.filter(function(sex) {
      return sex.key == d.Sex;
    })[0];
    var total = sex.value.filter(function(e) {
      return e.key == 'total';
    })[0];
    var survived = sex.value.filter(function(e) {
      return e.key == 'survived';
    })[0];
    total.value ++;
    survived.value += +d.Survived;
  });

  return result;
}

function draw(rawData, aggData) {
  var width = 1000;
  var barHeight = 40;
  var gutter = 5;
  var height = barHeight * 6; // total 6 bars

  var x = d3.scale.linear().domain([0, rawData.length]).range([0, width]);

  var chart = d3.select(".chart").attr("width", width).attr("height", height);

  var pclass = chart.selectAll("g")
    .data(aggData)
    .enter()
    .append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * d.value.length * barHeight + ")"; });

  var sex = pclass.selectAll('g')
    .data(function(d) { return d.value; })
    .enter()
    .append('g')
    .attr('transform', function(d, i) { return 'translate(0,' + i * barHeight + ')'; })
    ;

  sex.append("rect")
    .attr("width", function(d) {
      var totalCount = d.value.filter(function(e) {
        return e.key == 'total';
      })[0].value;
      return x(totalCount);
    })
    .attr("height", barHeight - gutter)
    .attr('class', 'total');

  sex.append("rect")
    .attr("width", function(d) {
      var survivedCount = d.value.filter(function(e) {
        return e.key == 'survived';
      })[0].value;
      return x(survivedCount);
    })
    .attr('class', 'survived')
    .attr("height", barHeight - gutter);

  sex.append("text")
    .attr("dx", function(d) {
      var total = d.value.filter(function(e) {
        return e.key == 'total';
      })[0].value;
      return x(total + 5);
    })
    .attr('text-anchor', 'start')
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) {
      var total = d.value.filter(function(e) {
        return e.key == 'total';
      })[0].value;
      var survived = d.value.filter(function(e) {
        return e.key == 'survived';
      })[0].value;
      var text = survived.toString() + '/' + total.toString();
      return text;
    })
}

d3.csv('data/train.csv', main);