import * as grpc from 'grpc';

import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { Clipping, Register, ServerInformation } from '../proto/message/message_pb';
import { IClipboardServer } from '../proto/message/message_grpc_pb';
import IClipboardProvider from '../data/clipboardProvider';

export class ClipboardHandler implements IClipboardServer {
  peers: Map<String, grpc.ServerWritableStream<Register, Clipping>>;

  constructor(protected provider: IClipboardProvider) {
    this.peers = new Map<string, grpc.ServerWritableStream<Register, Clipping>>();

    provider.clippingsListeners.push(this.clippingsListener);
  }

  clippingsListener = (clippings: string[]) => {
    const lastClip = new Clipping();
    lastClip.setContent(clippings[clippings.length - 1]);
    this.peers.forEach(call => {
      call.write(lastClip);
    });
  }

  getServerInformation = (
    call: grpc.ServerUnaryCall<Empty>,
    callback: grpc.sendUnaryData<ServerInformation>,
  ): void => {
    const information: ServerInformation = new ServerInformation();
    information.setName(this.provider.serverName);
    information.setIpaddressesList(this.provider.ipAdresses);
    information.setPort(this.provider.port);

    callback(null, information);
  };

  streamInClipboard = (
    call: grpc.ServerReadableStream<Clipping>,
    callback: grpc.sendUnaryData<Empty>
  ): void => {
    call.on('data', (clipping: Clipping) => {
      this.provider.addClipping(clipping.getContent());
    });
    call.on('end', () => callback(null, new Empty()));
  }

  streamOutClipboard = (
    call: grpc.ServerWritableStream<Register, Clipping>
  ): void => {
    const clientRegister = call.request as Register;
    this.peers.set(clientRegister.getName(), call);
  }

  /*
  clipboardStream = (call: grpc.ServerDuplexStream<Clipping, Clipping>) => {
    this.provider.clippingsCallback = (clippings: string[]) => {
      console.log('[clipboardStream] peers: ');
      const reply = new Clipping();
      reply.setContent(clippings.join(','));

      this.peers.forEach((call, key) => {
        call.write(reply);
      });
    };

    call.on('data', (request: Clipping) => {
      console.log(`[clipboardStream] Got: ${JSON.stringify(request.toObject())}`);
      console.log(`[clipboardStream] Got MetaData: ${JSON.stringify(call.metadata)}`);

      this.peers.set(request.getContent(), call);
    });
    call.on('end', () => {
      console.log('[clipboardStream] Done.');
      call.end();
    });
  };
  */

}

export default ClipboardHandler;
