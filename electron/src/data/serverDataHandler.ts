export interface IClient {
    id: string;
    name: string;
}

type ClippingsCallback = (clippings: string[]) => void;
type ClientsChangedCallback = (clients: IClient[]) => void;
export class ServerDataHandler {
  public clippingsListeners: ClippingsCallback[] = [];

  public clientsListener: ClientsChangedCallback | undefined;

  protected clippings: string[] = [];

  protected clients: IClient[] = [];

  constructor(
      public serverName: string = '',
      public ipAdresses: string[] = [],
      public port: number = 0,
  ) {
    this.serverName = serverName;
    this.ipAdresses = ipAdresses;
    this.port = port;
  }

  public addClient = (id: string, name: string) => {
    this.clients.push({ id, name });
    this.clientsListener?.(this.clients);
  }

  public addClipping = (content: string) => {
    // TODO: @raphi only compare to last element here
    if (this.clippings.includes(content)) {
      return;
    }

    this.clippings.push(content);
    this.notifyListeners();
  }

  notifyListeners = () => {
    this.clippingsListeners.forEach((listener) => {
      listener(this.clippings);
    });
  }
}

export default ClientsChangedCallback;
