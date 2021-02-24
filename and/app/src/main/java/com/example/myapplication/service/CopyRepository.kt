package com.example.myapplication.service

import androidx.lifecycle.MutableLiveData
import kotlin.properties.Delegates

class CopyRepository: CopyServiceManager.Listener {
    interface Listener {
        fun copyServiceConnected(manager: CopyServiceManager)
    }

    val servers = MutableLiveData<List<CopyServiceManager.Server>>(emptyList())

    val listeners = mutableListOf<Listener>()
    var copyServiceManager: CopyServiceManager? by Delegates.observable(null) { prop, old, new ->
        new?.let { manager ->
            manager.listener = this
            listeners.forEach { it.copyServiceConnected(manager) }
        }
    }

    override fun discoveredServersChanged() {
        servers.postValue(copyServiceManager?.discoveredServers)
    }
}