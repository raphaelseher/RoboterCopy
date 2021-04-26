import { ipcRenderer } from 'electron';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useEffect } from 'react';
import './index.css';
import { IState } from './index';
import Logs from './components/logs/logs';

type ServerInformationProps = { state: IState }
const ServerInformation: React.FC<ServerInformationProps> = (props) => {
    return (
        <div id="server-information">
            <h3>ServerInformation</h3>
            <p>Hostname: {props.state.hostname}</p>
            <p>IP: {props.state.ipAddresses.join(', ')}</p>
            <p>Port: {props.state.port}</p>
        </div>
    )
}

type ServerControlProps = { isRunning: Boolean }
const ServerControl: React.FC<ServerControlProps> = (props) => {
    return (
        <div id="server-control">
            <button type="button" onClick={() => {
                ipcRenderer.send('toggle-server')
            }}>Toggle</button>
            <p>Server is {props.isRunning ? 'running' : 'stopped'}</p>
        </div>
    )
}

const App = () => {
    let [state, setState] = React.useState<IState>({
        hostname: "",
        ipAddresses: [],
        port: 0,
        serverIsRunning: false,
        connectedDevices: []
    })

    useEffect(() => {
        ipcRenderer.on('update-app-state', (_, newState: IState) => {
            setState(newState);
        });
    }, []);

    return (
        <>
            <h1>🤖 Copy</h1>
            <ServerInformation state={state} />
            <ServerControl isRunning={state.serverIsRunning} />
            <Logs />
        </>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));
