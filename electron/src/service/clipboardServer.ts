import * as grpc from 'grpc';
import { ServerInformation, Clipping } from 'src/proto/message/message_pb';
import { ClipboardHandler, IClipboardHandlerDelegate } from '../handlers/clipboard';
import { IClipboardServer, ClipboardService } from '../proto/message/message_grpc_pb';
import ServerDataHandler, { IClient, ClippingsCallback } from '../data/serverDataHandler';

type StartServerCallback = (error: Error | null) => void;
type PeersChangedCallback = (peers: string[]) => void;

class ClipboardServer implements IClipboardHandlerDelegate {
  public isRunning = false;

  private grpcServer: grpc.Server;

  private serverDataHandler: ServerDataHandler;

  private clipboardHandler: ClipboardHandler;

  constructor(
    port: number,
    serverDataHandler: ServerDataHandler,
    startCallback: StartServerCallback,
    peersChangedCallback: PeersChangedCallback,
  ) {
    this.serverDataHandler = serverDataHandler;
    serverDataHandler.clippingsListeners.push(this.clippingsListener);
    this.clipboardHandler = new ClipboardHandler(this);
    this.bindAndStartServer(port, this.clipboardHandler, startCallback);
  }

  public disconnectClient = (uuid: string) => {
    const call = this.clipboardHandler.getCallForPeer(uuid);
    call?.end();
    this.serverDataHandler.removeClient(uuid);
  }

  // ServerDataHandler
  requestServerInformation = (): ServerInformation => {
    const information = new ServerInformation();
    information.setName(this.serverDataHandler.serverName);
    information.setPort(this.serverDataHandler.port);
    information.setIpaddressesList(this.serverDataHandler.ipAdresses);
    return information;
  }

  clientConnected = (uuid: string, name: string) => {
    this.serverDataHandler.addClient(uuid, name);
  }

  receivedClipping = (data: string) => {
    this.serverDataHandler.addClipping(data);
  }

  clippingsListener: ClippingsCallback = (clippings: string[]) => {
    const lastClipping = clippings.slice(-1)[0];
    if (!lastClipping) return;

    const clipping = new Clipping();
    clipping.setDate('2021-01-01'); // TODO: add correct date
    clipping.setContent(lastClipping);
    this.serverDataHandler.getClientMap().forEach((_: IClient, id: string) => {
      const call = this.clipboardHandler.getCallForPeer(id);
      call?.write(clipping);
    });
  }

  // Server state handling
  private bindAndStartServer(
    port: number,
    clipboardHandler: ClipboardHandler,
    startCallback: StartServerCallback,
  ) {
    this.grpcServer = ClipboardServer.createServer(clipboardHandler);
    this.grpcServer.bindAsync(
      `0.0.0.0:${port}`,
      grpc.ServerCredentials.createInsecure(),
      (err: Error | null, _: number) => {
        this.isRunning = err == null;
        startCallback(err);
      },
    );

    this.grpcServer.start();
  }

  private static createServer(
    handler: ClipboardHandler,
  ): grpc.Server {
    const server: grpc.Server = new grpc.Server();
    server.addService<IClipboardServer>(ClipboardService, handler);
    return server;
  }
}

export default ClipboardServer;
