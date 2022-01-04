import * as grpc from 'grpc';

import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { v4 as uuidv4 } from 'uuid';
import { Clipping, Register, ServerInformation } from '../proto/message/message_pb';
import { IClipboardServer } from '../proto/message/message_grpc_pb';

export interface IClipboardHandlerDelegate {
  requestServerInformation: () => ServerInformation;
  clientConnected: (uuid: string, name: string) => void;
  receivedClipping: (data: string) => void;
}

export class ClipboardHandler implements IClipboardServer {
  protected peers: Map<string, grpc.ServerWritableStream<Register, Clipping>>;

  private delegate: IClipboardHandlerDelegate;

  constructor(delegate: IClipboardHandlerDelegate) {
    this.peers = new Map<string, grpc.ServerWritableStream<Register, Clipping>>();
    this.delegate = delegate;
  }

  public getCallForPeer = (uuid: string): 
    grpc.ServerWritableStream<Register, Clipping> | undefined => this.peers.get(uuid);

  getServerInformation = (
    call: grpc.ServerUnaryCall<Empty>,
    callback: grpc.sendUnaryData<ServerInformation>,
  ): void => {
    const information = this.delegate.requestServerInformation();
    callback(null, information);
  };

  streamInClipboard = (
    call: grpc.ServerReadableStream<Clipping>,
    callback: grpc.sendUnaryData<Empty>,
  ): void => {
    call.on('data', (clipping: Clipping) => {
      this.delegate.receivedClipping(clipping.getContent());
    });
    call.on('end', () => callback(null, new Empty()));
  }

  streamOutClipboard = (
    call: grpc.ServerWritableStream<Register, Clipping>,
  ): void => {
    const clientRegister = call.request as Register;
    const uuid = uuidv4();
    this.peers.set(uuid, call);
    this.delegate.clientConnected(uuid, clientRegister.getName());
  }

  disconnectClient = (
    call: grpc.ServerUnaryCall<Empty>,
    callback: grpc.sendUnaryData<DisconnectResponse>,
  ): void => {
    const response = undefined;
    console.log("DisconnectClient");
  }
}

export default ClipboardHandler;
