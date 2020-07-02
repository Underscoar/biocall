import React from 'react';
import './Charts.css';

var Chart = require('chart.js');

class HeartRateChart extends React.Component {
  componentDidMount(props) {
    this.ctx = document.getElementById('heart-rate-chart').getContext('2d');
    //console.log(this.ctx);
    let gradient = this.ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(255,0,0,0.8)');
    gradient.addColorStop(1, 'rgba(255,0,0,0)');
    this.gsrData = [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1];
    this.config = {
      type: 'line',
      data: {
				labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
				datasets: [{
					label: 'Heart rate',
					fill: true,
					// backgroundColor: 'rgba(255,0,0,0.2)',
					// borderColor: 'rgba(255,0,0,1)',
          // backgroundColor: 'rgba(255,0,0,0.2)',
          backgroundColor: gradient,
					borderColor: 'rgba(255,0,0,1)',
					data: this.gsrData,
          radius: 0
				}]
			},
			options: {
				responsive: true,
				title: {
					display: false
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'nearest',
					intersect: true
				},
				scales: {
					xAxes: [{
						display: false
					}],
					yAxes: [{
						display: true,
            ticks: {
              min: 40,
              max: 100
            }
					}]
				}
			}
    }

    this.hrChart = new Chart(this.ctx, this.config);
  }

  updateChart(bioData) {
    if (this.hrChart !== undefined) {
      // let maxChartVal = bioData.faceReaderHRHistory.maxVal+5;
      // this.hrChart.options.scales.yAxes[0].ticks.max = maxChartVal;
      this.hrChart.data.datasets[0].data.push(bioData.faceReader['Heart Rate']);
      //console.log(bioData.faceReader['Heart Rate']);
      this.hrChart.data.labels.push('');
      if (this.hrChart.data.datasets[0].data.length > 100) {
        this.hrChart.data.datasets[0].data.shift();
        this.hrChart.data.labels.shift();
      }
      this.hrChart.update();
      //console.log(this.hrChart.data.datasets[0].data);
    }
  }

  render() {
    this.updateChart(this.props.bioData);
    return (
      <div className="StressLevelChart">
      <canvas id="heart-rate-chart" width="200" height="300"></canvas>
      </div>
    );
  }
}

export default HeartRateChart;
