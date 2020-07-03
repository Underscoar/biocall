import React from 'react';
import Iframe from 'react-iframe';
import './JitsiContainer.css';
import {
  useParams
} from "react-router-dom";

function JitsiContainer() {
  let { slug } = useParams();
  let jitsiMeetUrl = 'https://i342465.hera.fhict.nl/jitsi-meet-link/index.html?room=' + slug;
  return (
    <div className="JitsiContainer">
    <Iframe url={jitsiMeetUrl}
              className="jitsi-iframe-wrap"
              allow="camera; microphone" />
    </div>
  );
}

export default JitsiContainer;
