import { ipcRenderer } from 'electron';
import './index.css';

const toggleServerButton = document.getElementById('toggleServer');

ipcRenderer.on('update-app-state', (_, state) => {
  document.getElementById('hostname').innerText = state.hostname;
  document.getElementById('ip').innerText = state.ipAddresses.join(', ');
  document.getElementById('port').innerText = state.port;
  document.getElementById('serverStatus').innerText = state.serverIsRunning ? "running" : "stopped"

  toggleServerButton.innerText = state.serverIsRunning ? "Stop" : "Start"

  document.getElementById('connectedDevices').innerHTML = state.connectedDevices.map((name: string) => "<li>" + name + "</li>")
});

toggleServerButton.addEventListener('click', () => {
  ipcRenderer.send('toggle-server')
});
