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
 
let naming_dict = {
  'total_cases': 'Total Cases',
  'new_cases': 'New Cases',
  'new_deaths': 'New Deaths',
  'total_deaths': 'Total Deaths',
  '7DMA': '1 Week Moving Average',
}
 
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
    d3.json('./data/country-iso-map.json'),
  ]).then((res) => {
    // Dimensions
    const width = 1200
    const height = 600
 
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
    // Country ISO code map
    const isoMap = res[2]
    // Create a dictionary to map iso codes to country names
    const isoDict = {}
    isoMap.forEach(v => { isoDict[v['alpha-3']] = v.name })
 
    // Color scale (we use threshold scale)
    const color = d3.scaleThreshold()
      .domain([1000, 10000, 50000, 100000, 250000, 500000, 1000000])
      .range(colors)
    
    // Get all dates (uniques and sorted)
    let dates = [...new Set(data.map(v => v.date))].sort((a, b) => new Date(a) - new Date(b));
    let maxDate = dates[dates.length - 1]
    let filterDate = new Date(maxDate);
    filterDate.setDate(filterDate.getDate() - 4);
    dates = dates.filter(v => new Date(v) < filterDate)
    let selectedDate = dates[0]
 
 
    // Get selected option from the dropdown '#selectvar'
    const selectvar = document.getElementById('selectvar')
    let selectedVar = selectvar.value
 
    // Function to redraw the map based on the selected date
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
 
    // Function to open the modal
    function openModal(countryName) {
      const modal = document.getElementById('modal');
      const modalTitle = document.getElementById('modal-title');
      modal.style.display = 'block';
      modalTitle.textContent = countryName;
    }
 
    // Function to close the modal
    function closeModal() {
      const modal = document.getElementById('modal');
      modal.style.display = 'none';
    }
 
    const closeButton = document.getElementsByClassName('close')[0];
    closeButton.addEventListener('click', closeModal);
 
    function updateModalContent(countryName, seriesData) {
      const modalTitle = document.getElementById('modal-title');
      modalTitle.textContent = countryName;
    
      // Extract the date and value arrays from the series data
      const dates = seriesData.map(data => new Date(data.date));
      const values = seriesData.map(data => data[selectedVar]);
    
      // Create the chart data object
      const chartData = {
        labels: dates,
        datasets: [
          {
            label: naming_dict[selectedVar],
            data: values,
            backgroundColor: 'black'
          }
        ]
      };
    
      // Get the canvas element and initialize the chart
      document.querySelector("#chart-holder").innerHTML =  '<canvas id="modal-chart"></canvas>'
      const chartCanvas = document.getElementById('modal-chart');
 
      const chartContext = chartCanvas.getContext('2d');
      const barChart = new Chart(chartContext, {
        type: 'bar',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day'
              },
              ticks: {
                source: 'labels'
              }
            },
            y: {
              beginAtZero: true
            }
          }
        }
      });
 
 
    }
    
 
 
    function redraw () {
      svg.selectAll('g.countries').remove()
 
      const dataByID = {}
      const dataByDate = data.filter(v => v.date === selectedDate)
      dataByDate.forEach(v => { dataByID[v.iso_code] = v[selectedVar] })
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
        .on('mouseover', (event, d) => {
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip.html(`${isoDict[d.id]}: ${dataByID[d.id] ? dataByID[d.id] : 0}`)
            .style('left', `${event.pageX}px`)
            .style('top', `${event.pageY - 28}px`);
          d3.select(event.target)
            .style('stroke', '#000')
            .style('stroke-width', 2)
            .style('opacity', 1);
        })
        .on('mouseout', (event, d) => {
          tooltip.transition().duration(300).style('opacity', 0);
          d3.select(event.target)
            .style('stroke', '#646464')
            .style('stroke-width', 1.5)
            .style('opacity', 0.8);
        })
        .on('click', (event, d) => {
          openModal(isoDict[d.id]);
          // Retrieve the series data for the clicked country and update the modal content
          const seriesData = data.filter(v => v.iso_code === d.id);
          updateModalContent(isoDict[d.id], seriesData);
        });
      
    }
    redraw()
 
    // Function to add the top 10 countries with the most cumulative cases to the 'toplist' ul
    function addTopList () {
      const topList = document.getElementById('toplist')
      topList.innerHTML = ''
      const dataByDate = data.filter(v => v.date === selectedDate)
      dataByDate.sort((a, b) => b[selectedVar] - a[selectedVar])
      dataByDate.slice(0, 10).forEach(v => {
        const li = document.createElement('li')
        li.textContent = `${isoDict[v.iso_code]}: ${v[selectedVar]}`
        topList.appendChild(li)
      })
    }
    addTopList()
 
    document.getElementById('date').textContent = formatDate(new Date(selectedDate))
    document.getElementById('variable').textContent = naming_dict[selectedVar]
 
    let tickIndex = 0
    const slider = d3
      .sliderHorizontal()
      .max(dates.length - 1)
      .tickValues(Array.from(dates.keys()))
      .step(1)
      .height(30)
      .width(400)
      .tickFormat(tick => ++tickIndex == (dates.length-1) || tickIndex == 1 ? dates[tick] : null)
      .displayFormat(tick => dates[tick])
      .default(0)
      .on('onchange', tick => {
        selectedDate = dates[tick]
        document.getElementById('date').textContent = formatDate(new Date(selectedDate))
        redraw()
        addTopList()
      })
    
    let speed=1;
    const legend = svg.append('g')
      .attr('class', 'legendQuant')
      .attr('transform', 'translate(1000,50)')
 
    legend.call(d3.legendColor()
      .orient('vertical')
      .shapeWidth(60)
      .labelFormat(d3.format('i'))
      .labels(d3.legendHelpers.thresholdLabels)
      .scale(color))
 
    selectvar.addEventListener('change', (event) => {
      selectedVar = event.target.value
      switch (selectedVar) {
        case 'new_cases':
          color.domain([1000, 10000, 50000, 100000, 250000, 500000, 1000000])
          break
        case 'total_cases':
          color.domain([10000, 100000, 500000, 1000000, 2500000, 5000000, 10000000])
          break
        case 'new_deaths':
          color.domain([100, 1000, 5000, 10000, 25000, 50000, 100000])
          break
        case 'total_deaths':
          color.domain([1000, 10000, 50000, 100000, 250000, 500000, 1000000])
          break
        case '7DMA':
          color.domain([1000, 10000, 50000, 100000, 250000, 500000, 1000000])
 
      }
      document.getElementById('variable').textContent = naming_dict[selectedVar]
 
      redraw()
      addTopList()
      legend.call(d3.legendColor()
        .orient('vertical')
        .shapeWidth(60)
        .labelFormat(d3.format('i'))
        .labels(d3.legendHelpers.thresholdLabels)
        .scale(color))
 
    })
  
    let play = false;
    d3.selectAll('#play').on("click", async () => {
      if(play) {
        play = false;
        document.getElementById('play').textContent = 'Play';
      } else {
        play = true;
        document.getElementById('play').textContent = 'Stop';
      }
      while(slider.value() < 1200 & play) {
        slider.value(slider.value() + speed);
        await new Promise(r => setTimeout(r, 75));
        if(slider.value() >= 1200) {
          play = false;
          document.getElementById('play').textContent = 'Play';
          slider.value(0)
          break;
        }
      }
    })
 
    d3.selectAll('#minus').on('click', async () =>  {
      speed = Math.max(speed -1, 1)
      document.getElementById('steps').textContent = `Steps: ${speed} days`
 
    })
 
    d3.selectAll('#plus').on('click', async () =>  {
      speed = Math.min(speed + 1, 50)
      document.getElementById('steps').textContent = `Steps: ${speed} days`
    })
    svg
      .append('g')
      .attr('transform', `translate(${width/2 - 190}, ${height - 50})`)
      .call(slider)
 
  })
})
 