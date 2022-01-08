export interface IClient {
    id: string;
    name: string;
}

export interface ClientsChangedCallback {
  (clients: IClient[]) : void
}

class ServerRepository {
  public clientsListener: ClientsChangedCallback | undefined;
  
  private clientMap: Map<string, IClient> = new Map();

  constructor(
      private serverName: string = '',
      private ipAdresses: string[] = [],
      private port: number = 0,
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

  public getClientMap = (): Map<string, IClient> => this.clientMap;
  
  public getServerName = () => this.serverName;
  public getIpAdresses = () => this.ipAdresses;
  public getPort = () => this.port;
}

export default ServerRepository;
