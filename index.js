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
    document.body.innerHTML = '<h1>Covid Evolution</h1><h2>New Cases: <span id="date"></span></h2><div id="chart"></div>'

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
      .scale(140)
      .rotate([360, 0, 0])
      .translate([width / 2, height / 2])
    const path = d3.geoPath().projection(projection)
    console.log(path)
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
    let max_date = dates[dates.length - 1]
    let filter_date = new Date(max_date);
    filter_date.setDate(filter_date.getDate() - 2);
    dates = dates.filter(v => new Date(v) < filter_date)
    let selectedDate = dates[0]

    function redraw () {
      svg.selectAll('g.countries').remove()

      const dataByName = {}
      const dataByDate = data.filter(v => v.date === selectedDate)
      dataByDate.forEach(v => { dataByName[v.iso_code] = v.new_cases })
      world.features.forEach(d => {d.case = typeof dataByName[d.id] === 'number' ? dataByName[d.id] : 0})
      svg
        .append('g')
        .attr('class', 'countries')
        .selectAll('path')
        .data(world.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style('fill', d => dataByName[d.id] ? color(dataByName[d.id]) : colors[0])
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

    svg
      .append('g')
      .attr('transform', 'translate(30,30)')
      .call(slider)

  })
})
