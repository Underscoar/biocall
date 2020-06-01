import React, { Component } from 'react';
import JitsiContainer from './JitsiContainer';
import StressLevelChart from './StressLevelChart';
import HeartRateChart from './HeartRateChart';
import ActionUnit from './ActionUnit';
import './App.css';

// import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import socketIOClient from 'socket.io-client';

class App extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
      // endpoint: "https://d14f756054fa.ngrok.io",
      bioData: {gsr: '1.2', gsrHistory: {minVal:0, maxVal:1}, faceReaderHRHistory: {minVal:0, maxVal:60}, faceReader: {
        "Heart Rate": 60,
        "Neutral": 0,
        "Happy": 0,
        "Sad": 0,
        "Angry": 0,
        "Surprised": 0,
        "Disgusted": 0,
        "Scared": 0,
        "Action Unit 04 - Brow Lowerer": "NotActive",
        "Action Unit 23 - Lip Tightener": "NotActive",
        "Action Unit 24 - Lip Pressor": "NotActive"
      }},
      borderStyle: {
        // boxShadow: `0 0 20px 5px rgba(90, 255, 52, 0.75)`
        boxShadow: `0 0 20px 5px rgba(0, 0, 255, 0.75)`
      },
      resizedWindow: false,
      shovedStressChart: false,
      shovedHRChart: false,
      spoofBorder: false,
      spoofValue: 0,
      spoofGSR: false,
      spoofedGSRVal: 1
    }

    this.processBioData = this.processBioData.bind(this);
    this.connectToFaceReader = this.connectToFaceReader.bind(this);
    this.spoofBorder = this.spoofBorder.bind(this);
    this.changeSpoof = this.changeSpoof.bind(this);
    this.toggleWindowSize = this.toggleWindowSize.bind(this);
    this.toggleShovedStressChart = this.toggleShovedStressChart.bind(this);
    this.toggleShovedHRChart = this.toggleShovedHRChart.bind(this);
    this.processESenseDate = this.processESenseDate.bind(this);

    this.spoofGSR = this.spoofGSR.bind(this);
    this.changeGSR = this.changeGSR.bind(this);
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
    this.processESenseDate(data.gsr);
  }

  processESenseDate(data) {
    const bioSource = '/GSR';
    const bioValue = parseFloat(data);
    if (this.state.spoofBorder === false) {
      if (bioSource === '/GSR') {
        //console.log(data);
        // Set the border color based on the Skin Response Value
        if (bioValue <= 1) {this.setState({borderStyle: {boxShadow: '0 0 50px 5px rgba(0, 0, 255, 0.75)'}});}
        else if (bioValue >= 5) {this.setState({borderStyle: {boxShadow: '0 0 50px 5px rgba(255, 0, 0, 0.75)'}});}
        else {
          let percOfThreeVal = bioValue/3;
          let redVal = Math.floor(255*percOfThreeVal);
          let blueVal = 255-redVal;
          this.setState({borderStyle: {boxShadow: `0 0 50px 5px rgba(${redVal}, 0, ${blueVal}, 0.75)`}});
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
      this.setState({spoofValue: data, borderStyle: {boxShadow: `0 0 50px 5px rgba(${redVal}, 0, ${blueVal}, 0.75)`}});
    }
  }

  processFaceReaderData(data) {
    //console.log(data);
    let heartRate = data['Heart Rate'];
    //console.log(heartRate);
    if (heartRate !== "Unknown") {
      if (heartRate <= 50) {this.setState({borderStyle: {boxShadow: '0 0 50px 5px rgba(0, 0, 255, 0.75)'}});}
      else if (heartRate >= 100) {this.setState({borderStyle: {boxShadow: '0 0 50px 5px rgba(255, 0, 0, 0.75)'}});}
      else {
        let percOfHundredVal = heartRate/100;
        let redVal = Math.floor(255*percOfHundredVal);
        let blueVal = 255-redVal;
        this.setState({borderStyle: {boxShadow: `0 0 50px 5px rgba(${redVal}, 0, ${blueVal}, 0.75)`}});
      }
    }
  }

  connectToFaceReader() {
    this.socket.emit('connectFaceReader', 'ClientIdOfzo');
    // this.socket.on('ClientIdOfzo', data => console.log(data))
    // console.log('Emitted: "connectFaceReader" with data: "ClientIdOfzo"');
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

  spoofGSR() {
    if (this.state.spoofGSR === false) {
      this.socket.emit('spoofGSR', true);
    }
    else {
      this.socket.emit('spoofGSR', false);
    }
  }

  changeGSR(event) {
    this.setState({spoofedGSRVal: event.target.value});
    this.socket.emit('changeGSR', event.target.value);
  }

  toggleWindowSize() {
    let curBool = this.state.resizedWindow;
    this.setState({resizedWindow: !curBool});
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
    let resizedWindow = this.state.resizedWindow ? 'jitsi-wrap jitsi-resized' : 'jitsi-wrap';
    let shovedStressChart = this.state.shovedStressChart ? 'chart-wrap stress-level-chart-wrap' : 'chart-wrap stress-level-chart-wrap chart-hidden';
    let shovedStressChartContain = this.state.shovedStressChart ? 'chart-contain stress-level-chart-contain' : 'chart-contain stress-level-chart-contain chart-contain-hidden';

    let shovedHRChart = this.state.shovedHRChart ? 'chart-wrap heart-rate-chart-wrap' : 'chart-wrap heart-rate-chart-wrap chart-hidden';
    let shovedHRChartContain = this.state.shovedHRChart ? 'chart-contain heart-rate-chart-contain' : 'chart-contain heart-rate-chart-contain chart-contain-hidden';
    return (
      <div className="App">
      {/*<button onClick={this.connectToFaceReader}>Connect to Facereader</button>
      <button onClick={this.spoofBorder}>Spoof border</button>
      <input type="range" value={this.state.spoofValue} min="0" max="255" onChange={this.changeSpoof} />*/}
      <button onClick={this.spoofGSR}>Spoof GSR</button>
      <input type="range" value={this.state.spoofedGSRVal} min="0" max="5" step="0.1" onChange={this.changeGSR} />
        <div className="jitsi-window">
          <div style={this.state.borderStyle} className={resizedWindow}>
            <JitsiContainer />
            <div className="change-size-wrap">
              <span onClick={this.toggleWindowSize} className="change-size-btn"><FontAwesomeIcon icon={faChevronUp} /></span>
            </div>
          </div>
          <div className={shovedStressChartContain}>
            <div className={shovedStressChart}>
              <StressLevelChart bioData={this.state.bioData}/>
              <div className="chart-toggle-button" onClick={this.toggleShovedStressChart}>Stress level</div>
            </div>
          </div>

          <div className="action-units-wrap">
            <ActionUnit actionUnit={this.state.bioData.faceReader['Action Unit 04 - Brow Lowerer']} actionName="Brow Lowerer" actionClass="action-unit-4" />
            <ActionUnit actionUnit={this.state.bioData.faceReader['Action Unit 23 - Lip Tightener']} actionName="Lip Tightener" actionClass="action-unit-23" />
            <ActionUnit actionUnit={this.state.bioData.faceReader['Action Unit 24 - Lip Pressor']} actionName="Lip Pressor" actionClass="action-unit-24" />
          </div>

          <div className={shovedHRChartContain}>
            <div className={shovedHRChart}>
              <HeartRateChart bioData={this.state.bioData} />
              <div className="chart-toggle-button" onClick={this.toggleShovedHRChart}>Heart rate</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
