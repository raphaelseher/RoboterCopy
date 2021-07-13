export interface IClipboardProvider {
    serverName: string;
    ipAdresses: string[];
    port: number;
    peersChangedCallback: (peers: string[]) => void;
    peerAddedCallback: (id: string, name: string) => void;
}

export interface IClient {
    id: string;
    name: string;
}

type ClippingsCallback = (clippings: string[]) => void;
type ClientsChangedCallback = (clients: IClient[]) => void;
export class ClipboardProvider implements IClipboardProvider {
    public clippingsListeners: ClippingsCallback[] = [];
    public clientsListener: ClientsChangedCallback;
    protected clippings: string[] = [];
    protected clients: IClient[] = [];

    constructor(
        public serverName: string = '',
        public ipAdresses: string[] = [],
        public port: number = 0,
    ) {}

    public peersChangedCallback = (peers: string[]) => {

    }

    public peerAddedCallback = (id: string, name: string) => {
        this.clients.push({id: id, name: name}); 
        this.clientsListener(this.clients); 
    }

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

export default ClipboardProvider;
