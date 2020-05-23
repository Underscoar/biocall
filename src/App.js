import React, { Component } from 'react';
import JitsiContainer from './JitsiContainer';
import StressLevelChart from './StressLevelChart';
import './App.css';

import socketIOClient from 'socket.io-client';

class App extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
      // endpoint: "https://dcd202f7.ngrok.io",
      bioData: {gsr: '1.2', facereader: {}},
      borderStyle: {
        // boxShadow: `0 0 20px 5px rgba(90, 255, 52, 0.75)`
        boxShadow: `0 0 20px 5px rgba(0, 0, 255, 0.75)`
      },
      resizedWindow: false,
      shovedStressChart: false,
      spoofBorder: false,
      spoofValue: 0
    }

    this.processBioData = this.processBioData.bind(this);
    this.connectToFaceReader = this.connectToFaceReader.bind(this);
    this.spoofBorder = this.spoofBorder.bind(this);
    this.changeSpoof = this.changeSpoof.bind(this);
    this.toggleWindowSize = this.toggleWindowSize.bind(this);
    this.toggleShovedStressChart = this.toggleShovedStressChart.bind(this);
  }

  componentDidMount() {
    const { endpoint } = this.state;
    this.socket = socketIOClient(endpoint);

    //TODO User has to select/input room somewhere
    let room = 'Kamer';

    this.socket.on('connect', () => {
        this.socket.emit('roomRequest', room);

      });

    this.socket.on('bioData', data => this.processBioData(data));

    this.socket.on("eSenseData", data => this.processESenseDate(data));
    this.socket.on("spoofBorder", data => this.setBorderSpoofing(data));
    this.socket.on("spoofValue", data => this.spoofValue(data));
    this.socket.on("faceReaderData", data => this.processFaceReaderData(data));

    this.socket.on('testdata', data => {console.log(data);});
  }

  processBioData(data) {
    this.setState({bioData: data});
    console.log(data);
  }

  processESenseDate(data) {
    const bioSource = data[0];
    const bioValue = parseFloat(data[1]);
    if (this.state.spoofBorder === false) {
      if (bioSource === '/GSR') {
        console.log(data);
        // Set the border color based on the Skin Response Value
        if (bioValue <= 1) {this.setState({borderStyle: {boxShadow: '0 0 20px 5px rgba(0, 0, 255, 0.75)'}});}
        else if (bioValue >= 3) {this.setState({borderStyle: {boxShadow: '0 0 20px 5px rgba(255, 0, 0, 0.75)'}});}
        else {
          let percOfThreeVal = bioValue/3;
          let redVal = Math.floor(255*percOfThreeVal);
          let blueVal = 255-redVal;
          this.setState({borderStyle: {boxShadow: `0 0 20px 5px rgba(${redVal}, 0, ${blueVal}, 0.75)`}});
        }
      }
    }
  }

  setBorderSpoofing(bool) {
      this.setState({spoofBorder: bool});
  }

  spoofValue(data) {
    if (this.state.spoofBorder === true) {
      let redVal = data;
      let blueVal = 255-redVal;
      this.setState({spoofValue: data, borderStyle: {boxShadow: `0 0 20px 5px rgba(${redVal}, 0, ${blueVal}, 0.75)`}});
    }
  }

  processFaceReaderData(data) {
    console.log(data);
    let heartRate = data['Heart Rate'];
    console.log(heartRate);
    if (heartRate !== "Unknown") {
      if (heartRate <= 50) {this.setState({borderStyle: {boxShadow: '0 0 20px 5px rgba(0, 0, 255, 0.75)'}});}
      else if (heartRate >= 100) {this.setState({borderStyle: {boxShadow: '0 0 20px 5px rgba(255, 0, 0, 0.75)'}});}
      else {
        let percOfHundredVal = heartRate/100;
        let redVal = Math.floor(255*percOfHundredVal);
        let blueVal = 255-redVal;
        this.setState({borderStyle: {boxShadow: `0 0 20px 5px rgba(${redVal}, 0, ${blueVal}, 0.75)`}});
      }
    }
  }

  connectToFaceReader() {
    this.socket.emit('connectFaceReader', 'ClientIdOfzo');
    this.socket.on('ClientIdOfzo', data => console.log(data))
    console.log('Emitted: "connectFaceReader" with data: "ClientIdOfzo"');
  }

  spoofBorder() {
    if (this.state.spoofBorder === false) {
      this.socket.emit('spoofBorder', true);
    }
    else {
      this.socket.emit('spoofBorder', false);
    }
  }

  changeSpoof(event) {
    console.log(event.target.value);
    this.socket.emit('spoofValue', event.target.value);
  }

  toggleWindowSize() {
    let curBool = this.state.resizedWindow;
    this.setState({resizedWindow: !curBool});
  }

  toggleShovedStressChart() {
    let shovedStressChartVal = this.state.shovedStressChart;
    this.setState({shovedStressChart: !shovedStressChartVal});
  }

  render() {
    let resizedWindow = this.state.resizedWindow ? 'jitsi-wrap jitsi-resized' : 'jitsi-wrap';
    let shovedStressChart = this.state.shovedStressChart ? 'chart-wrap stress-level-chart-wrap' : 'chart-wrap stress-level-chart-wrap chart-hidden';
    return (
      <div className="App">
      <button onClick={this.connectToFaceReader}>Connect to Facereader</button>
      <button onClick={this.spoofBorder}>Spoof border</button>
      <input type="range" value={this.state.spoofValue} min="0" max="255" onChange={this.changeSpoof} />
        <div className="jitsi-window">
          <div style={this.state.borderStyle} className={resizedWindow}>
            <JitsiContainer />
            <div className="change-size-wrap">
              <span onClick={this.toggleWindowSize} className="change-size-btn">O</span>
            </div>
          </div>
          <div className="chart-contain stress-level-chart-contain">
            <div className={shovedStressChart}>
            <StressLevelChart bioData={this.state.bioData}/>
            <div className="chart-toggle-button" onClick={this.toggleShovedStressChart}>Stress level</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
