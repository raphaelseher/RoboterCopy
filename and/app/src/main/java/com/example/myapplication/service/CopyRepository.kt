package com.example.myapplication.service

import androidx.lifecycle.MutableLiveData
import kotlin.properties.Delegates

class CopyRepository: CopyServiceManager.Listener {
    interface Listener {
        fun copyServiceConnected(manager: CopyServiceManager)
    }

    val servers = MutableLiveData<List<CopyServiceManager.Server>>(emptyList())
    val isConnected = MutableLiveData<Boolean>(false)

    val listeners = mutableListOf<Listener>()
    var copyServiceManager: CopyServiceManager? by Delegates.observable(null) { prop, old, new ->
        new?.let { manager ->
            manager.listener = this
            listeners.forEach { it.copyServiceConnected(manager) }
        }
    }

    fun disconnectServer() {
        copyServiceManager?.disconnectServer()
    }

    override fun discoveredServersChanged() {
        servers.postValue(copyServiceManager?.discoveredServers)
    }

    override fun clippingsChanged() {

    }

    override fun connectionChanged() {
        isConnected.postValue(copyServiceManager?.isConnected ?: false)
    }
}