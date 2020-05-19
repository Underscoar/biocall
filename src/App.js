import React, { Component } from 'react';
import JitsiContainer from './JitsiContainer';
import './App.css';

import socketIOClient from 'socket.io-client';


class App extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
      // endpoint: "https://dcd202f7.ngrok.io",
      borderStyle: {
        // boxShadow: `0 0 20px 5px rgba(90, 255, 52, 0.75)`
        boxShadow: `0 0 20px 5px rgba(0, 0, 255, 0.75)`
      },
      spoofBorder: false,
      spoofValue: 0
    }

    this.connectToFaceReader = this.connectToFaceReader.bind(this);
    this.spoofBorder = this.spoofBorder.bind(this);
    this.changeSpoof = this.changeSpoof.bind(this);
  }

  componentDidMount() {
    const { endpoint } = this.state;
    this.socket = socketIOClient(endpoint);

    this.socket.on("eSenseData", data => this.processESenseDate(data));
    this.socket.on("spoofBorder", data => this.setBorderSpoofing(data));
    this.socket.on("spoofValue", data => this.spoofValue(data));
    this.socket.on("faceReaderData", data => this.processFaceReaderData(data));

    this.socket.on('testdata', data => {console.log(data);});
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

  render() {
    return (
      <div className="App">
      <button onClick={this.connectToFaceReader}>Connect to Facereader</button>
      <button onClick={this.spoofBorder}>Spoof border</button>
      <input type="range" value={this.state.spoofValue} min="0" max="255" onChange={this.changeSpoof} />
        <div className="jitsi-window">
          <div style={this.state.borderStyle} className="jitsi-wrap">
            <JitsiContainer />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
