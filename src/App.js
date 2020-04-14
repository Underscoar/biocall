import React from 'react';
import './App.css';

import JitsiContainer from './JitsiContainer';

function App() {
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

export default App;
