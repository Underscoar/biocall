import React from 'react';
import JitsiContainer from './JitsiContainer';
import StressLevelChart from './StressLevelChart';
import HeartRateChart from './HeartRateChart';

class ClientView extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = {
      shovedStressChart: false,
      shovedHRChart: false
    }

    this.toggleShovedStressChart = this.toggleShovedStressChart.bind(this);
    this.toggleShovedHRChart = this.toggleShovedHRChart.bind(this);
  }
  componentDidMount() {
    // console.log(this.props);
  }

  toggleShovedStressChart() {
    let shovedStressChartVal = this.state.shovedStressChart;
    this.setState({shovedStressChart: !shovedStressChartVal});
  }

  toggleShovedHRChart() {
    let shovedHRChartVal = this.state.shovedHRChart;
    this.setState({shovedHRChart: !shovedHRChartVal});
  }

  render() {
    console.log(this.props.showToClientHRChart);

    let visibleBorder = this.props.showToClientBorder ? this.props.borderStyle : {boxShadow: 'none'};
    let visibleStressChart = this.props.showToClientStressChart ? '' : ' hide-el';
    let visibleHRChart = this.props.showToClientHRChart ? '' : ' hide-el';

    let shovedStressChart = this.state.shovedStressChart ? 'chart-wrap stress-level-chart-wrap' : 'chart-wrap stress-level-chart-wrap chart-hidden';
    let shovedStressChartContain = this.state.shovedStressChart ? 'chart-contain stress-level-chart-contain' : 'chart-contain stress-level-chart-contain chart-contain-hidden';

    let shovedHRChart = this.state.shovedHRChart ? 'chart-wrap heart-rate-chart-wrap' : 'chart-wrap heart-rate-chart-wrap chart-hidden';
    let shovedHRChartContain = this.state.shovedHRChart ? 'chart-contain heart-rate-chart-contain' : 'chart-contain heart-rate-chart-contain chart-contain-hidden';

    return (
      <div className="JitsiContainer">
      <div className="jitsi-window">
        <div style={visibleBorder} className="jitsi-wrap">
          <JitsiContainer />
        </div>

        <div className="charts-contain">
          <div className={shovedStressChartContain + visibleStressChart}>
            <div className={shovedStressChart}>
              <StressLevelChart bioData={this.props.bioData}/>
              <div className="chart-toggle-button" onClick={this.toggleShovedStressChart}>Stress level</div>
            </div>
          </div>

          <div className={shovedHRChartContain + visibleHRChart}>
            <div className={shovedHRChart}>
              <HeartRateChart bioData={this.props.bioData} />
              <div className="chart-toggle-button" onClick={this.toggleShovedHRChart}>Heart rate</div>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
}

export default ClientView;
