import React, { Component } from 'react';
import JitsiContainer from './JitsiContainer';
import StressLevelChart from './StressLevelChart';
import HeartRateChart from './HeartRateChart';
import ClientView from './ClientView';
import ActionUnit from './ActionUnit';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
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
      // endpoint: "https://454f763a791d.eu.ngrok.io",
      // endpoint: "http://192.168.0.166:4001",
      endpoint: "http://127.0.0.1:4001",
      bioData: {gsr: '1.2', gsrHistory: {minVal:0, maxVal:1}, faceReaderHRHistory: {minVal:0, maxVal:60}, faceReaderHRVHistory: {minVal:0, maxVal:0.200}, faceReader: {
        "Heart Rate": 60,
        "Heart Rate Var": 0.180,
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
        boxShadow: `0 0 40px 5px rgba(0, 0, 255, 0.75)`
      },
      showToClientBorder: false,
      showToClientStressChart: false,
      showToClientHRChart: false,
      resizedWindow: false,
      shovedStressChart: false,
      shovedHRChart: false,
      displaySpoofMenu: false,
      spoofBorder: false,
      spoofValue: 0,
      spoofGSR: false,
      spoofedGSRVal: 1,
      actionUnitsWrapClass: false
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

    this.sendActionUnitsWrapReq = this.sendActionUnitsWrapReq.bind(this);
    this.spoof4 = this.spoof4.bind(this);
    this.spoof23 = this.spoof23.bind(this);
    this.spoof24 = this.spoof24.bind(this);

    this.spoofActionUnit = this.spoofActionUnit.bind(this);

    this.showToClientBorder = this.showToClientBorder.bind(this);
    this.showToClientStress = this.showToClientStress.bind(this);
    this.showToClientHR = this.showToClientHR.bind(this);

  }

  componentDidMount() {
    const { endpoint } = this.state;
    this.socket = socketIOClient(endpoint);

    let room = 'BioCallTest';
    let urlParams = window.location.pathname.split('/');
    for (let i=0; i<urlParams.length; i++) {
      if (urlParams[i].endsWith('-view')) {
        room = urlParams[i+1];
      }
    }

    this.socket.on('connect', () => {
        this.socket.emit('roomRequest', room);
      });

    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === 'q') {
        if (!this.state.displaySpoofMenu) {
          this.setState({displaySpoofMenu: true});
        }
        else {
          this.setState({displaySpoofMenu: false});
        }
      }
    });

    this.socket.on('bioData', data => this.processBioData(data));

    this.socket.on("eSenseData", data => this.processESenseDate(data));
    this.socket.on("spoofBorder", data => this.setBorderSpoofing(data));
    this.socket.on("spoofValue", data => this.spoofValue(data));
    this.socket.on("faceReaderData", data => this.processFaceReaderData(data));

    this.socket.on('spoofActionUnit', data => this.spoofActionUnit(data));
    this.socket.on('testdata', data => {console.log(data);});
    this.socket.on('setActionUnitsWrap', data =>{this.setState({actionUnitsWrapClass: data});});

    this.socket.on('showToClientBorder', data => {this.setState({showToClientBorder: data});});
    this.socket.on('showToClientStress', data => {this.setState({showToClientStressChart: data});});
    this.socket.on('showToClientHR', data => {this.setState({showToClientHRChart: data});});
  }

  processBioData(data) {
    this.setState({bioData: data});
    console.log(data);
    this.processESenseDate(data.gsr, data.gsrHistory);
  }

  processESenseDate(data, gsrHistory) {
    const bioSource = '/GSR';
    const bioValue = parseFloat(data);
    if (this.state.spoofBorder === false) {
      if (bioSource === '/GSR') {
        if (bioValue <= 1) {this.setState({borderStyle: {boxShadow: '0 0 50px 5px rgba(0, 0, 255, 0.75)'}});}
        else if (bioValue >= gsrHistory['maxVal']) {this.setState({borderStyle: {boxShadow: '0 0 50px 5px rgba(255, 0, 0, 0.75)'}});}
        else {
          let percOfMaxVal = bioValue/gsrHistory['maxVal'];
          let redVal = Math.floor(255*percOfMaxVal);
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
      this.setState({spoofGSR: true});
    }
    else {
      this.socket.emit('spoofGSR', false);
      this.setState({spoofGSR: false});
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

  sendActionUnitsWrapReq() {
    let toggle = !this.state.actionUnitsWrapClass;
    this.socket.emit('setActionUnitsWrap', toggle);
  }

  spoof4() {
    this.socket.emit('spoofActionUnit', '4');
  }

  spoof23() {
    this.socket.emit('spoofActionUnit', '23');
  }

  spoof24() {
    this.socket.emit('spoofActionUnit', '24');
  }

  showToClientBorder(event) {
    this.socket.emit('showToClientBorder', event.target.checked);
  }

  showToClientStress(event) {
    this.socket.emit('showToClientStress', event.target.checked);
  }

  showToClientHR(event) {
    this.socket.emit('showToClientHR', event.target.checked);
  }

  spoofActionUnit(val) {
    try {
      document.getElementById('action-unit-' + val).classList.add('action-unit-' + val + '-wall');
      setTimeout(function() {
        document.getElementById('action-unit-' + val).classList.remove('action-unit-' + val + '-wall');
      },1000);
    }
    catch(err) {
      console.log(err);
    }
  }

  render() {
    let resizedWindow = this.state.resizedWindow ? 'jitsi-wrap jitsi-resized' : 'jitsi-wrap';
    let shovedStressChart = this.state.shovedStressChart ? 'chart-wrap stress-level-chart-wrap' : 'chart-wrap stress-level-chart-wrap chart-hidden';
    let shovedStressChartContain = this.state.shovedStressChart ? 'chart-contain stress-level-chart-contain' : 'chart-contain stress-level-chart-contain chart-contain-hidden';

    let resizedWindowCharts = this.state.resizedWindow ? 'charts-contain charts-side' : 'charts-contain';

    let shovedHRChart = this.state.shovedHRChart ? 'chart-wrap heart-rate-chart-wrap' : 'chart-wrap heart-rate-chart-wrap chart-hidden';
    let shovedHRChartContain = this.state.shovedHRChart ? 'chart-contain heart-rate-chart-contain' : 'chart-contain heart-rate-chart-contain chart-contain-hidden';

    let displaySpoofMenu = this.state.displaySpoofMenu ? 'spoof-menu' : 'spoof-menu spoof-menu-hidden';
    return (
      <div className="App">
      {/*<button onClick={this.connectToFaceReader}>Connect to Facereader</button>
      <button onClick={this.spoofBorder}>Spoof border</button>
      <input type="range" value={this.state.spoofValue} min="0" max="255" onChange={this.changeSpoof} />*/}
      <Router basename={'/biocall'}>
        <Switch>
          <Route path="/full-view/:slug">
            <div className={displaySpoofMenu}>
              <button onClick={this.spoofGSR}>Spoof GSR</button>
              <input type="range" value={this.state.spoofedGSRVal} min="0" max="5" step="0.1" onChange={this.changeGSR} />
              {/*<button onClick={this.sendActionUnitsWrapReq}>Display action units</button>*/}
              <button onClick={this.spoof4}>Spoof 4</button>
              <button onClick={this.spoof23}>Spoof 23</button>
              <button onClick={this.spoof24}>Spoof 24</button>
            </div>
            <div className="jitsi-window">
              <div style={this.state.borderStyle} className={resizedWindow}>
                <JitsiContainer />
                <div className="change-size-wrap">
                  <span onClick={this.toggleWindowSize} className="change-size-btn"><FontAwesomeIcon icon={faChevronUp} /></span>
                </div>
              </div>

              <div className={resizedWindowCharts}>
                <div className={shovedStressChartContain}>
                  <div className={shovedStressChart}>
                    <StressLevelChart bioData={this.state.bioData}/>
                    <div className="chart-toggle-button" onClick={this.toggleShovedStressChart}>Stress level</div>
                  </div>
                </div>

                <div className={shovedHRChartContain}>
                  <div className={shovedHRChart}>
                    <HeartRateChart bioData={this.state.bioData} />
                    <div className="chart-toggle-button" onClick={this.toggleShovedHRChart}>Heart rate</div>
                  </div>
                </div>
              </div>

              <div className="bottom-wrap">
                <div className="bottom-wrap-part bottom-left">
                  <div className="toggles-title">Show elements to client</div>
                  <div className="toggles-wrap">
                    <div className="toggles-text"><label className="toggle-label"><input type="checkbox" onChange={this.showToClientBorder} /><span className="toggle toggle-round"></span></label><span className="toggles-desc">Show border to client</span></div>
                    <div className="toggles-text"><label className="toggle-label"><input type="checkbox" onChange={this.showToClientStress} /><span className="toggle toggle-round"></span></label><span className="toggles-desc">Show stress level to client</span></div>
                    <div className="toggles-text"><label className="toggle-label"><input type="checkbox" onChange={this.showToClientHR} /><span className="toggle toggle-round"></span></label><span className="toggles-desc">Show heart rate to client</span></div>
                  </div>
                </div>
                <div className="bottom-wrap-part bottom-right">
                {/*  <div className="action-units-wrap">
                    <div className="all-action-units">
                      <ActionUnit actionUnit={this.state.bioData.faceReader['Action Unit 04 - Brow Lowerer']} actionName="Brow Lowerer" actionClass="action-unit-4" />
                      <ActionUnit actionUnit={this.state.bioData.faceReader['Action Unit 23 - Lip Tightener']} actionName="Lip Tightener" actionClass="action-unit-23" />
                      <ActionUnit actionUnit={this.state.bioData.faceReader['Action Unit 24 - Lip Pressor']} actionName="Lip Pressor" actionClass="action-unit-24" />
                    </div>
                  </div> */}

                  <div className="action-units-contain">
                    <ActionUnit actionUnit={this.state.bioData.faceReader['Action Unit 04 - Brow Lowerer']} actionName="Brow Lowerer" actionClass="action-unit-4" />
                    <ActionUnit actionUnit={this.state.bioData.faceReader['Action Unit 23 - Lip Tightener']} actionName="Lip Tightener" actionClass="action-unit-23" />
                    <ActionUnit actionUnit={this.state.bioData.faceReader['Action Unit 24 - Lip Pressor']} actionName="Lip Pressor" actionClass="action-unit-24" />
                  </div>
                </div>
              </div>
            </div>
          </Route>
          <Route path="/client-view/:slug">
            <ClientView bioData={this.state.bioData} borderStyle={this.state.borderStyle} showToClientBorder={this.state.showToClientBorder} showToClientStressChart={this.state.showToClientStressChart} showToClientHRChart={this.state.showToClientHRChart} />
          </Route>
        </Switch>
      </Router>
      </div>
    );
  }
}

export default App;
