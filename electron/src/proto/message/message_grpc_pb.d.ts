// package: RoboterCopy
// file: message.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as message_pb from "./message_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

interface IClipboardService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getServerInformation: IClipboardService_IGetServerInformation;
    streamOutClipboard: IClipboardService_IStreamOutClipboard;
    streamInClipboard: IClipboardService_IStreamInClipboard;
}

interface IClipboardService_IGetServerInformation extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, message_pb.ServerInformation> {
    path: "/RoboterCopy.Clipboard/GetServerInformation";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<message_pb.ServerInformation>;
    responseDeserialize: grpc.deserialize<message_pb.ServerInformation>;
}
interface IClipboardService_IStreamOutClipboard extends grpc.MethodDefinition<message_pb.Register, message_pb.Clipping> {
    path: "/RoboterCopy.Clipboard/StreamOutClipboard";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<message_pb.Register>;
    requestDeserialize: grpc.deserialize<message_pb.Register>;
    responseSerialize: grpc.serialize<message_pb.Clipping>;
    responseDeserialize: grpc.deserialize<message_pb.Clipping>;
}
interface IClipboardService_IStreamInClipboard extends grpc.MethodDefinition<message_pb.Clipping, google_protobuf_empty_pb.Empty> {
    path: "/RoboterCopy.Clipboard/StreamInClipboard";
    requestStream: true;
    responseStream: false;
    requestSerialize: grpc.serialize<message_pb.Clipping>;
    requestDeserialize: grpc.deserialize<message_pb.Clipping>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}

export const ClipboardService: IClipboardService;

export interface IClipboardServer {
    getServerInformation: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, message_pb.ServerInformation>;
    streamOutClipboard: grpc.handleServerStreamingCall<message_pb.Register, message_pb.Clipping>;
    streamInClipboard: grpc.handleClientStreamingCall<message_pb.Clipping, google_protobuf_empty_pb.Empty>;
}

export interface IClipboardClient {
    getServerInformation(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: message_pb.ServerInformation) => void): grpc.ClientUnaryCall;
    getServerInformation(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.ServerInformation) => void): grpc.ClientUnaryCall;
    getServerInformation(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.ServerInformation) => void): grpc.ClientUnaryCall;
    streamOutClipboard(request: message_pb.Register, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.Clipping>;
    streamOutClipboard(request: message_pb.Register, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.Clipping>;
    streamInClipboard(callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientWritableStream<message_pb.Clipping>;
    streamInClipboard(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientWritableStream<message_pb.Clipping>;
    streamInClipboard(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientWritableStream<message_pb.Clipping>;
    streamInClipboard(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientWritableStream<message_pb.Clipping>;
}

export class ClipboardClient extends grpc.Client implements IClipboardClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getServerInformation(request: google_protobuf_empty_pb.Empty, callback: (error: grpc.ServiceError | null, response: message_pb.ServerInformation) => void): grpc.ClientUnaryCall;
    public getServerInformation(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: message_pb.ServerInformation) => void): grpc.ClientUnaryCall;
    public getServerInformation(request: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: message_pb.ServerInformation) => void): grpc.ClientUnaryCall;
    public streamOutClipboard(request: message_pb.Register, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.Clipping>;
    public streamOutClipboard(request: message_pb.Register, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<message_pb.Clipping>;
    public streamInClipboard(callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientWritableStream<message_pb.Clipping>;
    public streamInClipboard(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientWritableStream<message_pb.Clipping>;
    public streamInClipboard(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientWritableStream<message_pb.Clipping>;
    public streamInClipboard(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientWritableStream<message_pb.Clipping>;
}
