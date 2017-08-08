"use strict";

// thanks https://github.com/janl/mustache.js/blob/master/mustache.js#L60

var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

function escapeHtml(string) {
  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return entityMap[s];
  });
}

var markerNames = [
  "circle", "square", "diamond",
  "cross", "x", "circle-open",
  "square-open", "diamond-open"
];

function unpack(rows, key) {
  return rows.map((row) => row[key]);
}

Plotly.d3.csv("ccservermap.csv", function(err, rows) {
  var names = unpack(rows, "Location");
  var markers = names.map((v, i) => 
    markerNames[i % markerNames.length]);
  var namesAndCoordinates = rows.map(row =>
    `${row.Location} (${row.x}, ${row.y}, ${row.z})`
  );
  var trace1 = {
    x: unpack(rows, "z"),
    y: unpack(rows, "x"),
    z: unpack(rows, "y"),
    mode: 'markers',
    marker: {
      symbol: markers,
      size: 5,
      opacity: 0.8,
      color: unpack(rows, "y"),
      reversescale: true
    },
    type: 'scatter3d',
    name: 'Locations',
    text: names,
    hovertext: namesAndCoordinates,
    hoverinfo: "text"
  };
  var data = [trace1];
  /*
  var data = rows.map(function(row) {
    return {
      x: [Number.parseInt(row.x)],
      y: [Number.parseInt(row.y)],
      z: [Number.parseInt(row.z)],
      mode: 'markers',
      marker: {
        size: 3,
        line: {
          color: 'rgba(240, 30, 40, 0.15)',
          width: 0.5
        },
        opacity: 0.8,
      },
      type: 'scatter3d',
      name: row.Location,
      hoverinfo: "all"
    };
  });
  */
  var layout = {
    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0
    },
    scene: {
      xaxis: {
        title: "Z"
      },
      zaxis: {
        title: "Y"
      },
      yaxis: {
        title: "X",
      },
      camera: {
        aspectmode: "data"
      }
    }
  };
  Plotly.newPlot("plot", data, layout);
  var table = document.getElementById("locs");
  var innerHTML = rows.map(row => 
    `<tr>
      <td>${escapeHtml(row.Location)}</td>
      <td>${escapeHtml(row.x)}</td>
      <td>${escapeHtml(row.y)}</td>
      <td>${escapeHtml(row.z)}</td>
    </tr>`
  ).join("");
  table.innerHTML += innerHTML;
});