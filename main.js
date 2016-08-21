'use strict';
$(window).load(function() {
  let scm = new ColorScheme;
  scm.from_hue(21).scheme('triade').distance(0.1).add_complement(false).variation('pastel').web_safe(true);
  let colors = scm.colors();
  let instance = api.instance.get();

  let json = api.boa.run('null-check-bug.boa');
  $('#loading').hide();
  $('#content').show();

  let canvas = $('#chart-output').get(0).getContext("2d");
  let chartData = [];
  let count = 0;

  for(let index in json.out) {
    count++;
    $('#numToShow').append(`<option value="${count}"> ${count} </option>`);
    chartData.push({
        label: index,
        value: json.out[index],
        color: '#' + _.sample(colors)
    });
  }

  $('#numToShow').change(function() {
    $('#output').html('<canvas id="chart-output"> </canvas>');
    canvas = $('#chart-output').get(0).getContext('2d');
    display($('#numToShow').val());
  });

  chartData = _.sortBy(chartData, function(line) {
    return Number(-line.value);
  });

  display(1);

  $('#app-title').html(`Number of Weeks to fix Null check bugs ${instance.repos.name}`);

  function display(num) {
    let limitedData = _.first(chartData, num);

    $('#table-output-body').html('');
    _.each(limitedData, function(element, index, list) {
      let num = index + 1;
      $('#table-output-body').append(`<tr><td> ${num} </td> <td> ${element.label} </td> <td> ${element.value} </td> </tr>`)
    });

    let outputChart = new Chart(canvas).Pie(limitedData, {responsive: true});
  }

});
