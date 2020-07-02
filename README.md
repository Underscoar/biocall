# BioCall

## About
BioCall is een element van het grotere BioCall geheel. Een applicatie waarin biofeedback getoond wordt tijdens een videogesprek. Het bestaat uit drie onderdelen:
- **BioCall: Frontend (React) applicatie**
- BioCall-Server: NodeJS server die realtime biofeedback naar de frontend stuurt
- BioCall-User: Electron applicatie die realtime de biofeedback van eSense en Facereader naar de NodeJS server stuurt

## Installation
### Clone
Clone deze repo `https://github.com/Underscoar/biocall`

### Setup
Installeer alle NPM packages
```
npm install
```

Start de applicatie
```
npm start
```

Build voor webserver
```
npm run build
```

### Belangrijke Info
Deze applicatie is gemaakt in een testomgeving op hera.fhict.nl. BioCall-Server is tijdens deze tests ook lokaal gedraaid. Er zijn daarom een aantal variabelen die specifiek voor deze use case waren die vooral met netwerklocaties te maken hebben:

*App.js*

this.state.endpoint: “http://127.0.0.1:4001” (Locatie van BioCall-Server)


*JitsiContainer.JS*

<Iframe url=”https://i342465.hera.fhict.nl/jitsi-meet-link”> (Locatie van de de Jitsi Meet pagina)


*package.json*

“homepage”: “https://i342465.hera.fhict.nl/biocall” (Locatie waar deze applicatie gehost wordt)


## Use
Het Jitsi scherm is een aparte pagina die wordt ingeladen via een Iframe. Dit is de link naar de `jitsi-meet-link` map. Host die ergens op een server en zet die link in de url variabele in `JitsiContainer.JS`.

Het gebruik van de complete applicatie begint bij het opstarten van de BioCall-Server. Noteer het IP adres en port van deze server in BioCall App.JS `this.state.endpoint`. Start daarna `npm start` (in BioCall) of build de applicatie voor hosting op een webserver.
