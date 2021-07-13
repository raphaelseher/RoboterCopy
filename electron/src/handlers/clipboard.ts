import * as grpc from 'grpc';

import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { Clipping, Register, ServerInformation } from '../proto/message/message_pb';
import { IClipboardServer } from '../proto/message/message_grpc_pb';
import IClipboardProvider from '../data/clipboardProvider';
import Logger from '../common/logger';
import {v4 as uuidv4} from 'uuid';

export class ClipboardHandler implements IClipboardServer {
    peers: Map<String, grpc.ServerWritableStream<Register, Clipping>>;
    provider: IClipboardProvider;

    constructor(protected provider: IClipboardProvider) {
        this.peers = new Map<string, grpc.ServerWritableStream<Register, Clipping>>();
        this.provider = provider;
        provider.clippingsListeners.push(this.clippingsListener);
    }

    clippingsListener = (clippings: string[]) => {
        const lastClip = new Clipping();
        lastClip.setContent(clippings[clippings.length - 1]);

        Logger.verbose(`send clipping: "${lastClip.getContent()}" to ${Array.from(this.peers.keys()).join(', ')}`);
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
        const uuid = uuidv4();
        this.peers.set(uuid, call);
        this.provider.peerAddedCallback(uuid, clientRegister.getName())
    }
}

export default ClipboardHandler;
