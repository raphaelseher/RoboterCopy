// package: RoboterCopy
// file: message.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class ServerInformation extends jspb.Message { 
    getName(): string;
    setName(value: string): ServerInformation;

    clearIpaddressesList(): void;
    getIpaddressesList(): Array<string>;
    setIpaddressesList(value: Array<string>): ServerInformation;
    addIpaddresses(value: string, index?: number): string;

    getPort(): number;
    setPort(value: number): ServerInformation;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ServerInformation.AsObject;
    static toObject(includeInstance: boolean, msg: ServerInformation): ServerInformation.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ServerInformation, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ServerInformation;
    static deserializeBinaryFromReader(message: ServerInformation, reader: jspb.BinaryReader): ServerInformation;
}

export namespace ServerInformation {
    export type AsObject = {
        name: string,
        ipaddressesList: Array<string>,
        port: number,
    }
}

export class Clipping extends jspb.Message { 
    getDate(): string;
    setDate(value: string): Clipping;

    getContent(): string;
    setContent(value: string): Clipping;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Clipping.AsObject;
    static toObject(includeInstance: boolean, msg: Clipping): Clipping.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Clipping, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Clipping;
    static deserializeBinaryFromReader(message: Clipping, reader: jspb.BinaryReader): Clipping;
}

export namespace Clipping {
    export type AsObject = {
        date: string,
        content: string,
    }
}

export class Register extends jspb.Message { 
    getName(): string;
    setName(value: string): Register;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Register.AsObject;
    static toObject(includeInstance: boolean, msg: Register): Register.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Register, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Register;
    static deserializeBinaryFromReader(message: Register, reader: jspb.BinaryReader): Register;
}

export namespace Register {
    export type AsObject = {
        name: string,
    }
}
