import React from 'react';
import Iframe from 'react-iframe';
import './JitsiContainer.css';

function JitsiContainer() {
  return (
    <div className="JitsiContainer">
      <Iframe url="http://i342465.hera.fhict.nl/jitsi-meet-link"
              className="jitsi-iframe-wrap" />
    </div>
  );
}

export default JitsiContainer;
