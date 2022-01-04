package com.example.myapplication.service

import android.util.Log
import com.example.myapplication.Service.ClipboardGrpc
import com.example.myapplication.Service.Message
import com.google.protobuf.Empty
import io.grpc.ManagedChannelBuilder
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlin.coroutines.resume
import kotlin.coroutines.suspendCoroutine

sealed class Response<out T, out E> {
    data class Success<out T>(val value: T) : Response<T, Nothing>()
    class Error<out E> : Response<Nothing, E>()
}

class ClipboardHandler(
    address: String, port: Int,
    private val listener: ClipboardHandler.Listener?
) {
    class EmptyException : Exception() {}

    val TAG = this.javaClass.simpleName

    private val channel = ManagedChannelBuilder.forAddress(address, port).usePlaintext().build()
    private val stub = ClipboardGrpc.newBlockingStub(channel)

    fun startListening(deviceName: String) {
        GlobalScope.launch { listen(deviceName) }
    }

    fun shutdown() {
        channel.shutdown()
    }

    suspend fun getServerInformation(): Message.ServerInformation = suspendCoroutine { cont ->
        cont.resume(stub.getServerInformation(Empty.newBuilder().build()))
    }

    private suspend fun listen(deviceName: String) {
        val register = Message.Register.newBuilder().setName(deviceName).build()
        stub.streamOutClipboard(register).forEachRemaining {
            listener?.receivedClip(it)
        }
        listener?.serverDisconnected()
    }

    interface Listener {
        fun receivedClip(clip: Message.Clipping)
        fun serverDisconnected()
    }
}