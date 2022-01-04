export interface IClient {
    id: string;
    name: string;
}

export interface ClippingsCallback {
  (clippings: string[]) : void;
}
export interface ClientsChangedCallback {
  (clients: IClient[]) : void
}

class ServerDataHandler {
  public clippingsListeners: ClippingsCallback[] = [];

  public clientsListener: ClientsChangedCallback | undefined;
  
  protected clippings: string[] = [];

  private clientMap: Map<string, IClient> = new Map();

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
    this.clientMap.set(id, { id, name });
    this.clientsListener?.(Array.from(this.clientMap.values()));
  }

  public removeClient = (id: string) => {
    this.clientMap.delete(id);
    this.clientsListener?.(Array.from(this.clientMap.values()));
  }

  public addClipping = (content: string) => {
    // TODO: @raphi only compare to last element here
    if (this.clippings.includes(content)) {
      return;
    }

    this.clippings.push(content);
    this.notifyListeners();
  }

  public getClientMap = (): Map<string, IClient> => this.clientMap;

  notifyListeners = () => {
    this.clippingsListeners.forEach((listener) => {
      listener(this.clippings);
    });
  }
}

export default ServerDataHandler;
