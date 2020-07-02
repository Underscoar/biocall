const jitsiDomain = 'meet.jit.si';
const jitsiOptions = {
  roomName: 'BioCallTest',
  parentNode: document.querySelector('#jitsi-container')
}

const api = new JitsiMeetExternalAPI(jitsiDomain, jitsiOptions);
