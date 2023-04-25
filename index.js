// Red Color Pallete
const colors = [
  'rgb(250, 250, 250)',
  'rgb(239, 209, 202)',
  'rgb(223, 162, 145)',
  'rgb(207, 116, 89)',
  'rgb(191, 69, 32)',
  'rgb(175, 23, 16)',
  'rgb(139, 0, 0)',
  'rgb(100, 0, 0)',
]

const formatDate = function(d) {
  let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
  let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  return `${da} ${mo} ${ye}`;
}

document.addEventListener('DOMContentLoaded', function (event) {
  // Create a promise to load data
  Promise.all([
    d3.json('./data/world_countries.json'),
    d3.json('./data/data.json'),
  ]).then((res) => {
    document.body.innerHTML = '<h1>Covid Evolution</h1><h2>New Cases: <span id="date"></span></h2><div id="chart"></div><button id="play">Play</button><a href="https://github.com/owid/covid-19-data/tree/master/public/data" target="_blank">Fonte dos dados(OWID)</a>'

    // Dimensions
    const width = 950
    const height = 550

    // SVG init
    const svg = d3
      .select('#chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    // projection setup
    const projection = d3.geoRobinson()
      .scale(140) // The scale determines how much to magnify or reduce the features of the map
      .rotate([360, 0, 0]) // Center the map (Pacific Ocean?)
      .translate([width / 2, height / 2]) // translate the center of the map to center of the svg element
    const path = d3.geoPath().projection(projection) // Handles the projection
    // Map data
    const world = res[0]
    // New cases data
    let data = res[1]
    
    // Color scale (we use threshold scale)
    const color = d3.scaleThreshold()
      .domain([0, 1000, 10000, 50000, 100000, 500000, 1000000, 2000000])
      .range(colors)
    
    // Get all dates (uniques and sorted)
    let dates = [...new Set(data.map(v => v.date))].sort((a, b) => new Date(a) - new Date(b));
    let maxDate = dates[dates.length - 1]
    let filterDate = new Date(maxDate);
    filterDate.setDate(filterDate.getDate() - 4);
    dates = dates.filter(v => new Date(v) < filterDate)
    let selectedDate = dates[0]

    // Function to redraw the map based on the selected date
    function redraw () {
      svg.selectAll('g.countries').remove()

      const dataByID = {}
      const dataByDate = data.filter(v => v.date === selectedDate)
      dataByDate.forEach(v => { dataByID[v.iso_code] = v.new_cases })
      svg
        .append('g')
        .attr('class', 'countries')
        .selectAll('path')
        .data(world.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style('fill', d => dataByID[d.id] ? color(dataByID[d.id]) : colors[0])
        .style('stroke', '#646464')
        .style('opacity', 0.8)
        .style('stroke-width', 1.5)
    }

    redraw()

    document.getElementById('date').textContent = formatDate(new Date(selectedDate))
    let tickIndex = 0
    const slider = d3
      .sliderRight()
      .max(dates.length - 1)
      .tickValues(Array.from(dates.keys()))
      .step(2)
      .height(400)
      .tickFormat(tick => ++tickIndex % 100 === 0 ? dates[tick] : null)
      .displayFormat(tick => dates[tick])
      .default(0)
      .on('onchange', tick => {
        selectedDate = dates[tick]
        document.getElementById('date').textContent = formatDate(new Date(selectedDate))
        redraw()
      })

    play = false;
    d3.selectAll('#play').on("click", async () => {
      if(play) {
        play = false;
        document.getElementById('play').textContent = 'Play';
      } else {
        play = true;
        document.getElementById('play').textContent = 'Stop';
      }
      while(slider.value() < 1200 & play) {
        slider.value(slider.value() + 30);
        await new Promise(r => setTimeout(r, 600));
        if(slider.value() >= 1200) {
          play = false;
          document.getElementById('play').textContent = 'Play';
          slider.value(0)
          break;
        }
      }
    })

    svg
      .append('g')
      .attr('transform', 'translate(7,80)')
      .call(slider)

  })
})
