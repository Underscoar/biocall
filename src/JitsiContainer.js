import React from 'react';
import Iframe from 'react-iframe';
import './JitsiContainer.css';

function JitsiContainer() {
  return (
    <div className="JitsiContainer">
    <Iframe url="https://i342465.hera.fhict.nl/jitsi-meet-link"
    // <Iframe url="https://i342465.hera.fhict.nl/jitsi-meet-link-placeholder"
              className="jitsi-iframe-wrap"
              allow="camera; microphone" />
    </div>
  );
}

export default JitsiContainer;
