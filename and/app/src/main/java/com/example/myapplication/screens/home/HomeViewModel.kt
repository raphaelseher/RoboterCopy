package com.example.myapplication.screens.home

import android.util.Log
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.Transformations
import androidx.lifecycle.ViewModel
import com.example.myapplication.service.CopyRepository
import com.example.myapplication.service.CopyServiceManager
import androidx.lifecycle.MediatorLiveData

data class ServerInformation(
    val hostname: String,
    val address: String?,
    val port: String,
    val isConnected: Boolean
)

class HomeViewModel(
    val copyRepository: CopyRepository
) : ViewModel(), CopyRepository.Listener {
    val deviceName = MutableLiveData<String>("Test")

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
        selectedServer.postValue(CopyServiceManager.Server("Hello", "", emptyList(), 0))
    }

    override fun copyServiceConnected(manager: CopyServiceManager) {
        Log.d("Tag", "copyServiceConnected $manager")
    }
}
