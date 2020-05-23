import React from 'react';
import './StressLevelChart.css';

var Chart = require('chart.js');

class StressLevelChart extends React.Component {
  componentDidMount(props) {
    this.ctx = document.getElementById('stress-level-chart');
    console.log(this.ctx);
    this.gsrData = [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1];
    this.config = {
      type: 'line',
      data: {
				labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
				datasets: [{
					label: 'Stress level',
					fill: true,
					backgroundColor: 'rgba(255,0,0,0.2)',
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
              min: 0,
              max: 5
            }
					}]
				}
			}
    }

    this.stressChart = new Chart(this.ctx, this.config);
  }

  updateChart(bioData) {
    // console.log(bioData);
    if (this.stressChart !== undefined) {
      // this.stressChart.data.datasets[0].data.push(Math.floor(Math.random() * 6));
      this.stressChart.data.datasets[0].data.push(bioData.gsr);
      this.stressChart.data.datasets[0].data.shift();
      this.stressChart.update();
      console.log(this.stressChart.data.datasets[0].data);
    }
  }

  render() {
    this.updateChart(this.props.bioData);
    return (
      <div className="StressLevelChart">
      <canvas id="stress-level-chart" width="300" height="400"></canvas>
      </div>
    );
  }
}

export default StressLevelChart;
