import { ipcRenderer } from 'electron';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import Logger, { ObservableLogger, ObservableLoggerCallback } from './common/logger';

ReactDOM.render(<div>hello world from React! </div>, document.getElementById('root'));
