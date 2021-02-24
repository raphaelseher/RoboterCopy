package com.example.myapplication.screens.home

import android.provider.Settings
import android.util.Log
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.Transformations
import androidx.lifecycle.ViewModel
import com.example.myapplication.service.CopyRepository
import com.example.myapplication.service.CopyServiceManager
import androidx.lifecycle.MediatorLiveData
import com.example.myapplication.R

class HomeViewModel(
    val copyRepository: CopyRepository,
    deviceName: String
) : ViewModel(), CopyRepository.Listener {
    val deviceName = MutableLiveData(deviceName)

    private val selectedServer = MutableLiveData<CopyServiceManager.Server?>()
    val server = MediatorLiveData<CopyServiceManager.Server?>().also { merger ->
        merger.addSource(selectedServer) { merger.value = it }
        merger.addSource(Transformations.map(copyRepository.servers) { it.firstOrNull() }) {
            if (selectedServer.value == null) {
                merger.value = it
            }
        }
    }

    init {
        copyRepository.listeners.add(this)
    }

    fun onClickConnect() {
        // TODO: Add disconnect
        // TODO: Change server
        selectedServer.value = server.value

        val server = selectedServer.value ?: return
        val deviceName = deviceName.value ?: return
        copyRepository.copyServiceManager?.connectToServer(server, deviceName)
    }

    override fun copyServiceConnected(manager: CopyServiceManager) {
        Log.d("Tag", "copyServiceConnected $manager")
    }


}
