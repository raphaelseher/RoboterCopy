import * as grpc from 'grpc';
import { ServerInformation, Clipping } from 'src/proto/message/message_pb';
import { ClipboardHandler, IClipboardHandlerDelegate } from '../handlers/clipboardHandler';
import { IClipboardServer, ClipboardService } from '../proto/message/message_grpc_pb';
import ServerRepository, { IClient, } from '../data/serverRepository';
import ClippingsRepository, { ClippingsCallback }  from 'src/data/clippingRepository';

type StartServerCallback = (error: Error | null) => void;
type PeersChangedCallback = (peers: IClient[]) => void;

class RemoteCopyServer implements IClipboardHandlerDelegate {
  public isRunning = false;

  private grpcServer: grpc.Server;

  private grpcClipboardHandler: ClipboardHandler;

  constructor(
    port: number,
    private serverRepository: ServerRepository,
    private clippingsRepository: ClippingsRepository,
    startCallback: StartServerCallback,
    peersChangedCallback: PeersChangedCallback,
  ) {
    clippingsRepository.clippingsListeners.push(this.clippingsListener);
    this.grpcClipboardHandler = new ClipboardHandler(this);
    this.bindAndStartServer(port, this.grpcClipboardHandler, startCallback);
  }

  public disconnectClient = (uuid: string) => {
    const call = this.grpcClipboardHandler.getCallForPeer(uuid);
    call?.end();
    this.serverRepository.removeClient(uuid);
  }

  requestServerInformation = (): ServerInformation => {
    const information = new ServerInformation();
    information.setName(this.serverRepository.getServerName());
    information.setPort(this.serverRepository.getPort());
    information.setIpaddressesList(this.serverRepository.getIpAdresses());
    return information;
  }

  clientConnected = (uuid: string, name: string) => {
    this.serverRepository.addClient(uuid, name);
  }

  receivedClipping = (data: string) => {
    this.clippingsRepository.addClipping(data);
  }

  clippingsListener: ClippingsCallback = (clippings: string[]) => {
    const lastClipping = clippings.slice(-1)[0];
    if (!lastClipping) return;

    const clipping = new Clipping();
    clipping.setDate('2021-01-01'); // TODO: add correct date
    clipping.setContent(lastClipping);
    this.serverRepository.getClientMap().forEach((_: IClient, id: string) => {
      const call = this.grpcClipboardHandler.getCallForPeer(id);
      call?.write(clipping);
    });
  }

  // Server state handling
  private bindAndStartServer(
    port: number,
    clipboardHandler: ClipboardHandler,
    startCallback: StartServerCallback,
  ) {
    this.grpcServer = RemoteCopyServer.createServer(clipboardHandler);
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

export default RemoteCopyServer;
