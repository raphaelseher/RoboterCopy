import { ipcRenderer } from 'electron';
import './index.css';

const toggleServerButton = document.getElementById('toggleServer');

ipcRenderer.on('update-app-state', (event, state) => {
  document.getElementById('hostname').innerText = state.hostname;
  document.getElementById('ip').innerText = state.ipAddresses.join(', ');
  document.getElementById('port').innerText = state.port;
  document.getElementById('serverStatus').innerText = state.serverIsRunning ? "running" : "stopped"

  toggleServerButton.innerText = state.serverIsRunning ? "Stop" : "Start"
});

toggleServerButton.addEventListener('click', () => {
  ipcRenderer.send('toggle-server')
});
