// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var message_pb = require('./message_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

function serialize_RoboterCopy_Clipping(arg) {
  if (!(arg instanceof message_pb.Clipping)) {
    throw new Error('Expected argument of type RoboterCopy.Clipping');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RoboterCopy_Clipping(buffer_arg) {
  return message_pb.Clipping.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_RoboterCopy_Register(arg) {
  if (!(arg instanceof message_pb.Register)) {
    throw new Error('Expected argument of type RoboterCopy.Register');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RoboterCopy_Register(buffer_arg) {
  return message_pb.Register.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_RoboterCopy_ServerInformation(arg) {
  if (!(arg instanceof message_pb.ServerInformation)) {
    throw new Error('Expected argument of type RoboterCopy.ServerInformation');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_RoboterCopy_ServerInformation(buffer_arg) {
  return message_pb.ServerInformation.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error('Expected argument of type google.protobuf.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}


var ClipboardService = exports.ClipboardService = {
  getServerInformation: {
    path: '/RoboterCopy.Clipboard/GetServerInformation',
    requestStream: false,
    responseStream: false,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: message_pb.ServerInformation,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_RoboterCopy_ServerInformation,
    responseDeserialize: deserialize_RoboterCopy_ServerInformation,
  },
  streamOutClipboard: {
    path: '/RoboterCopy.Clipboard/StreamOutClipboard',
    requestStream: false,
    responseStream: true,
    requestType: message_pb.Register,
    responseType: message_pb.Clipping,
    requestSerialize: serialize_RoboterCopy_Register,
    requestDeserialize: deserialize_RoboterCopy_Register,
    responseSerialize: serialize_RoboterCopy_Clipping,
    responseDeserialize: deserialize_RoboterCopy_Clipping,
  },
  streamInClipboard: {
    path: '/RoboterCopy.Clipboard/StreamInClipboard',
    requestStream: true,
    responseStream: false,
    requestType: message_pb.Clipping,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_RoboterCopy_Clipping,
    requestDeserialize: deserialize_RoboterCopy_Clipping,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
};

exports.ClipboardClient = grpc.makeGenericClientConstructor(ClipboardService);
