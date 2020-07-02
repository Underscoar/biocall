const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var room = 'Biocall_' + urlParams.get('room');


const jitsiDomain = 'meet.jit.si';
const jitsiOptions = {
  roomName: room,
  parentNode: document.querySelector('#jitsi-container')
}

const api = new JitsiMeetExternalAPI(jitsiDomain, jitsiOptions);
