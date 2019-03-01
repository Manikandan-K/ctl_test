function isNegative0(x) {
  return 1 / x === -Infinity;
}

function isSlopeChanging(x, y) {
  return x * y < 0
}

function arrayAverage(arr) {
      return _.reduce(arr, function(memo, num) {
        return memo + num;
      }, 0) / (arr.length === 0 ? 1 : arr.length);
}

function calculate(rows) {
  const dataPoints = [];
  const changePoints = [];
  const parsedData = [];

  const mm_index = parseInt(document.getElementById("mm_index").value) ;
  const kgf_index = parseInt(document.getElementById("kgf_index").value) ;
  const data_start_row = parseInt(document.getElementById("data_start_row").value);
  const cycle_start = parseInt(document.getElementById("cycle_start").value);
  const cycle_end = parseInt(document.getElementById("cycle_end").value);

  console.log(mm_index)
  console.log(rows[8])

  for (index = data_start_row - 1; index < rows.length; index++) {
    var data = rows[index];
    var point = parseFloat(data[mm_index - 1]).toFixed(1)
    var kgf = parseFloat(data[kgf_index - 1])
    var value = isNegative0(point) ? 0 : point;

    parsedData.push({
      pt: value,
      kgf: kgf,
      index: index
    });

    const lastValue = _.last(dataPoints);
    const lastPt = lastValue ? lastValue : {};
    if (lastPt.pt != value) {
      const obj = {
        pt: value,
        kgf: kgf,
        diff: (lastPt.pt - value).toFixed(1),
        index: index
      };
      dataPoints.push(obj);

      if (!_.isNaN(lastPt.diff) && isSlopeChanging(lastPt.diff, obj.diff)) {
        changePoints.push({
          diff: obj.pt,
          last: lastPt.diff,
          curr: obj.diff,
          kgf: obj.kgf,
          index: obj.index
        });
      }
    }
  }


  var indices = [data_start_row - 1];
  var cycles = [];
  changePoints.forEach(function(a) {
    if (a.curr < 0) {
      indices.push(a.index);
    }
  });



  for (index = 0; index < indices.length - 1; ++index) {
    var arr = parsedData.slice(indices[index], indices[index + 1]);
    cycles.push({
      start: indices[index],
      end: indices[index + 1],
      max: _.max(arr, function(a) {
        return a.kgf
      }).kgf,
      min: _.min(arr, function(a) {
        return a.kgf
      }).kgf
    })
  }


  var filterdData = cycles.slice(cycle_start -1, cycle_end);
  var maxAvg = arrayAverage(filterdData.map(d => d.max));
  var minAvg = arrayAverage(filterdData.map(d => d.min));

  document.getElementById("avg_max").innerText = maxAvg;
  document.getElementById("avg_min").innerText = minAvg;

  return cycles;


}
