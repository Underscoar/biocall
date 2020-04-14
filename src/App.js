import React, { Component } from 'react';
import JitsiContainer from './JitsiContainer';
import './App.css';

import socketIOClient from 'socket.io-client';


class App extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001"
    }
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("testId", data => console.log(data))
  }

  render() {
    return (
      <div className="App">
        <div className="jitsi-window">
          <div class="jitsi-wrap border-green">
            <JitsiContainer />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
