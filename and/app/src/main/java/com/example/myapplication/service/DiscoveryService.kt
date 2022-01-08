package com.example.myapplication.service

import android.net.nsd.NsdManager
import android.net.nsd.NsdServiceInfo
import android.telecom.Call
import android.util.Log

class DiscoveryService(val nsdManager: NsdManager) {
    val TAG = javaClass.simpleName

    sealed class Error: Exception() {
        object ServiceLost: Error()
        class Discovery(val code: Int): Error()
        class Resolve(val code: Int): Error()
    }

    interface Callback {
        fun discoveredServer(info: NsdServiceInfo)
        fun discoveryFailed(error: Exception)
    }

    var listener: Callback? = null

    private val discoveryListener = object : NsdManager.DiscoveryListener {
        override fun onDiscoveryStarted(regType: String) {}

        override fun onServiceFound(service: NsdServiceInfo) {
            when {
                service.serviceType != NSD_SERVICE_TYPE ->
                    Log.d(TAG, "Unknown Service Type: ${service.serviceType}")
                service.serviceName.contains(ROBOCOPY_SERVICE_NAME) ->
                    nsdManager.resolveService(service, resolveListener)
            }
        }

        override fun onServiceLost(service: NsdServiceInfo) {
            listener?.discoveryFailed(Error.ServiceLost)
        }

        override fun onDiscoveryStopped(serviceType: String) {}

        override fun onStartDiscoveryFailed(serviceType: String, errorCode: Int) {
            nsdManager.stopServiceDiscovery(this)
            listener?.discoveryFailed(Error.Discovery(errorCode))
        }

        override fun onStopDiscoveryFailed(serviceType: String, errorCode: Int) {
            listener?.discoveryFailed(Error.Discovery(errorCode))
            nsdManager.stopServiceDiscovery(this)
        }
    }
    private val resolveListener = object : NsdManager.ResolveListener {
        override fun onResolveFailed(serviceInfo: NsdServiceInfo, errorCode: Int) {
            listener?.discoveryFailed(Error.Resolve(errorCode))
        }

        override fun onServiceResolved(serviceInfo: NsdServiceInfo) {
            listener?.discoveredServer(serviceInfo)
        }
    }

    init {
        nsdManager.discoverServices(NSD_SERVICE_TYPE, NsdManager.PROTOCOL_DNS_SD, discoveryListener)
    }

    companion object {
        const val NSD_SERVICE_TYPE = "_http._tcp."
        const val ROBOCOPY_SERVICE_NAME = "RoboterCopy"
    }
}
