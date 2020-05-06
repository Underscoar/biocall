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
      // endpoint: "https://155707cb.ngrok.io",
      borderStyle: {
        boxShadow: `0 0 20px 5px rgba(90, 255, 52, 0.75)`
      }
    }

    this.connectToFaceReader = this.connectToFaceReader.bind(this);
  }

  componentDidMount() {
    const { endpoint } = this.state;
    this.socket = socketIOClient(endpoint);

    this.socket.on("eSenseData", data => this.processESenseDate(data));
    this.socket.on("faceReaderData", data => this.processFaceReaderData(data));
  }

  processESenseDate(data) {
    console.log(data);
    const bioSource = data[0];
    const bioValue = parseFloat(data[1]);
    if (bioSource === '/GSR') {
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

  render() {
    return (
      <div className="App">
      <button onClick={this.connectToFaceReader}>Connect to Facereader</button>
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
