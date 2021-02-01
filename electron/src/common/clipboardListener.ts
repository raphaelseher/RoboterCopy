import * as clipboard from 'clipboardy';
import IClipboardProvider from '../data/clipboardProvider';

class ClipboardListener {

  interval: NodeJS.Timeout | undefined

  constructor(protected provider: IClipboardProvider) {
    provider.clippingsListeners.push(this.clipboardListener);
  }

  startClipboardListener = () => {
    let lastClipboard: string | undefined = undefined

    this.interval = setInterval(() => {
      const clipboardData = clipboard.readSync();
      if (lastClipboard !== clipboardData) {
        lastClipboard = clipboardData;
        this.provider.addClipping(clipboardData);
      }
    }, 1000);

  };

  stopClipboardListener = () => {
    this.interval ? clearInterval(this.interval) : null;
  }

  clipboardListener = (clippings: string[]) => {
    const currentClipboard = clipboard.readSync();
    if (currentClipboard !== clippings[clippings.length - 1]) {
      console.log('New clipping synced to mac');
      clipboard.write(clippings[clippings.length - 1]);
    }
  }
}

export default ClipboardListener;
