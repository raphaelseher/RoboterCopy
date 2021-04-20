export interface IClipboardProvider {
  serverName: string;
  ipAdresses: string[];
  port: number;
}

type ClippingsCallback = (clippings: string[]) => void
class ClipBoardProvider implements IClipboardProvider {
  clippingsListeners: ClippingsCallback[] = [];
  protected clippings: string[] = [];

  constructor(
    public serverName: string = '',
    public ipAdresses: string[] = [],
    public port: number = 0,
  ) { }

  addClipping = (content: string) => {
    // TODO: @raphi only compare to last element here
    if (this.clippings.includes(content)) {
      return
    }

    this.clippings.push(content);
    this.notifyListeners();
  }

  notifyListeners = () => {
    this.clippingsListeners.forEach(listener => {
      listener(this.clippings);
    });
  }
}

export default ClipBoardProvider;
