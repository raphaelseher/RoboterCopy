import * as grpc from 'grpc';

import { ClipboardHandler } from '../handlers/clipboard';
import { IClipboardServer, ClipboardService } from '../proto/message/message_grpc_pb';
import ClipboardProvider from '../data/clipboardProvider';

type StartServerCallback = (error: Error | null) => void;
type PeersChangedCallback = (peers: string[]) => void;

type StartServerType = (
  port: number,
  clipboardProvider: ClipboardProvider,
  startCallback: StartServerCallback,
  peersChangedCallback: PeersChangedCallback
) => grpc.Server;

export const createServer: StartServerType = (
  port: number,
  clipboardProvider: ClipboardProvider,
  startCallback: StartServerCallback): grpc.Server => {
  const server: grpc.Server = new grpc.Server();
  const clipboardHandler = new ClipboardHandler(clipboardProvider);

  server.addService<IClipboardServer>(ClipboardService, clipboardHandler);

  server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (err: Error | null, _: number) => {
      startCallback(err);
    },
  );

  return server;
};

export const bindAndStartServer = (
  port: number,
  clipboardProvider: ClipboardProvider,
  startCallback: StartServerCallback,
  peersChangedCallback: PeersChangedCallback
): grpc.Server => {
  const server = createServer(port, clipboardProvider, startCallback, peersChangedCallback);
  server.start();
  return server;
};
