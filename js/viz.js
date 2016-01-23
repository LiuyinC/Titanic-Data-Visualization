/**
 * Created by LiuyinC on 10/25/15.
 */
function main(rawData) {
  var aggData = aggregate(rawData);
  draw(rawData, aggData);
}

/**
 * get statistics of the data
 * @param data
 * @returns {*[]}
 */
function aggregate(data) {
  var result = [
    {
      key: '1',
      value: [
        {
          key: 'female',
          value: [
            {
              key: 'total',
              value: 0
            },
            {
              key: 'survived',
              value: 0
            }
          ]
        },
        {
          key: 'male',
          value: [
            {
              key: 'total',
              value: 0
            },
            {
              key: 'survived',
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
              key: 'total',
              value: 0
            },
            {
              key: 'survived',
              value: 0
            }
          ]
        },
        {
          key: 'male',
          value: [
            {
              key: 'total',
              value: 0
            },
            {
              key: 'survived',
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
              key: 'total',
              value: 0
            },
            {
              key: 'survived',
              value: 0
            }
          ]
        },
        {
          key: 'male',
          value: [
            {
              key: 'total',
              value: 0
            },
            {
              key: 'survived',
              value: 0
            }
          ]
        }
      ]
    }
  ];

  data.forEach(function(d) {
    // get passenger class in result
    var pclass = result.filter(function(pclass) {
      return pclass.key == d.Pclass;
    })[0];
    // get gender in the above Pclass
    var sex = pclass.value.filter(function(sex) {
      return sex.key == d.Sex;
    })[0];
    // get total count in the above gender
    var total = sex.value.filter(function(e) {
      return e.key == 'total';
    })[0];
    // get survived count in the above gender
    var survived = sex.value.filter(function(e) {
      return e.key == 'survived';
    })[0];
    // increment the total count and survived count
    total.value ++;
    survived.value += +d.Survived;
  });

  return result;
}

function draw(rawData, aggData) {
  var width = 1000;
  var barHeight = 40;
  var gutter = 5;
  var pclassLabelWidth = 170;
  var genderLabelWidth = 70;
  var height = barHeight * 6; // total 6 bars

  var x = d3.scale.linear().domain([0, rawData.length]).range([0, width]);

  var chart = d3.select(".chart").attr("width", width).attr("height", height);

  var pclass = chart.selectAll("g")
    .data(aggData)
    .enter()
    .append("g")
    // have to use transform because g tag doesn't have x y dx dy attributes
    .attr("transform", function(d, i) { return "translate(0," + i * d.value.length * barHeight + ")"; });

  var pclassLabel = pclass.append("text")
    .text(function(d) { return "Passenger class " + d.key; })
    .attr('y', barHeight);

  var sex = pclass.selectAll('g')
    .data(function(d) { return d.value; })
    .enter()
    .append('g')
    // have to use transform because g tag doesn't have x y dx dy attributes
    .attr('transform', function(d, i) { return 'translate(' + pclassLabelWidth + ', ' + i * barHeight + ')'; });

  var sexLabel = sex.append('text')
    .text(function(d) { return d.key; })
    .attr('x', gutter)
    .attr('y', barHeight / 2);

  sex.selectAll('rect')
    .data(function(d) { return d.value; })
    .enter()
    .append('rect')
    .attr('width', function(d) { return x(d.value); })
    .attr('height', barHeight - gutter)
    .attr('class', function(d) { return d.key; })
    .attr('x', genderLabelWidth);

  sex.append("text")
    .attr("x", function(d) {
      var total = d.value.filter(function(e) {
        return e.key == 'total';
      })[0].value;
      return x(total + gutter) + genderLabelWidth;
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
    });

  var legends = chart.append('g')
    .attr('class', 'legends')
    .attr('transform', 'translate(550, 0)');

  var survivedLegend = legends.append('g');

  var survivedLegendRect = survivedLegend.append('rect')
    .attr('width', 40)
    .attr('height', 20)
    .attr('class', 'survived');
  var survivedLegendLabel = survivedLegend.append('text')
    .text('survived')
    .attr('x', 45)
    .attr('y', 16);

  var totalLegend = legends.append('g')
    .attr('transform', 'translate(0, 25)');

  var totalLegendRect = totalLegend.append('rect')
    .attr('width', 40)
    .attr('height', 20)
    .attr('class', 'total');

  var totalLegendLabel = totalLegend.append('text')
    .text('not survived')
    .attr('x', 45)
    .attr('y', 16);

}

d3.csv('data/train.csv', main);