package com.example.myapplication

import android.content.Context
import android.net.nsd.NsdManager
import android.net.nsd.NsdServiceInfo
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import android.view.Menu
import android.view.MenuItem
import com.example.myapplication.Service.MessageOuterClass
import com.example.myapplication.Service.MessageServiceGrpc
import io.grpc.ManagedChannel
import io.grpc.ManagedChannelBuilder
import io.grpc.stub.StreamObserver

class MainActivity : AppCompatActivity() {
    val TAG = this.javaClass.simpleName

    private val SERVICE_TYPE = "_roco._tcp."
    private lateinit var nsdManager: NsdManager
    private val discoveryListener = object : NsdManager.DiscoveryListener {
        // Called as soon as service discovery begins.
        override fun onDiscoveryStarted(regType: String) {
            Log.d(TAG, "Service discovery started")
        }

        override fun onServiceFound(service: NsdServiceInfo) {
            // A service was found! Do something with it.
            Log.d(TAG, "Service discovery success $service")


            when {
                service.serviceType != SERVICE_TYPE -> // Service type is the string containing the protocol and
                    // transport layer for this service.
                    Log.d(TAG, "Unknown Service Type: ${service.serviceType}")
                service.serviceName.contains("RoboterCopy") -> nsdManager.resolveService(service, resolveListener)
            }
        }

        override fun onServiceLost(service: NsdServiceInfo) {
            // When the network service is no longer available.
            // Internal bookkeeping code goes here.
            Log.e(TAG, "service lost: $service")
        }

        override fun onDiscoveryStopped(serviceType: String) {
            Log.i(TAG, "Discovery stopped: $serviceType")
        }

        override fun onStartDiscoveryFailed(serviceType: String, errorCode: Int) {
            Log.e(TAG, "Discovery failed: Error code:$errorCode")
            nsdManager.stopServiceDiscovery(this)
        }

        override fun onStopDiscoveryFailed(serviceType: String, errorCode: Int) {
            Log.e(TAG, "Discovery failed: Error code:$errorCode")
            nsdManager.stopServiceDiscovery(this)
        }
    }
    private val resolveListener = object : NsdManager.ResolveListener {
        override fun onResolveFailed(serviceInfo: NsdServiceInfo, errorCode: Int) {
            // Called when the resolve fails. Use the error code to debug.
            Log.e(TAG, "Resolve failed: $errorCode")
        }

        override fun onServiceResolved(serviceInfo: NsdServiceInfo) {
            Log.e(TAG, "Resolve Succeeded. ${serviceInfo.host.hostAddress}:${serviceInfo.port}")

            channel =  ManagedChannelBuilder.forAddress(serviceInfo.host.hostAddress, serviceInfo.port).usePlaintext().build().also {
                Log.d(TAG, "Channel created")
                val state = it.getState(true)
                Log.d(TAG, "Channel state: $state")

                val client = MessageServiceGrpc.newBlockingStub(it)
                val request = MessageOuterClass.RegisterRequest.newBuilder().setName("Oneplus 8t").build()
                val response = client.getFeature(request)
                Log.d(TAG, "Got a response: ${response}")
                /*
                val streamObserver = object: StreamObserver<MessageOuterClass.Message> {
                    override fun onNext(value: MessageOuterClass.Message?) {
                        Log.e(TAG,"OnNext: ${value?.content}")
                    }

                    override fun onError(t: Throwable?) {
                        Log.e(TAG,"onError $t")
                    }

                    override fun onCompleted() {
                        Log.e(TAG,"onCompleted")
                    }
                }

                client.messageStream(streamObserver)

                val message = MessageOuterClass.Message.newBuilder().setContent("Hello to server").build()
                streamObserver.onNext(message)
                */
            }
        }
    }
    private var channel: ManagedChannel? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        setSupportActionBar(findViewById(R.id.toolbar))

        nsdManager = (getSystemService(Context.NSD_SERVICE) as NsdManager)
        nsdManager.discoverServices(SERVICE_TYPE, NsdManager.PROTOCOL_DNS_SD, discoveryListener)
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.menu_main, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        return when (item.itemId) {
            R.id.action_settings -> true
            else -> super.onOptionsItemSelected(item)
        }
    }
}