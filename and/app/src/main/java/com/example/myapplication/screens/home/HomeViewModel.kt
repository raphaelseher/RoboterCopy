package com.example.myapplication.screens.home

import android.util.Log
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.Transformations
import androidx.lifecycle.ViewModel
import com.example.myapplication.service.CopyRepository
import com.example.myapplication.service.CopyServiceManager

data class ServerInformation(
    val hostname: String,
    val address: String?,
    val port: String,
    val isConnected: Boolean
)

class HomeViewModel(
    val copyRepository: CopyRepository
) : ViewModel(), CopyRepository.Listener {
    val deviceName = MutableLiveData<String>()
    val serverInformation = MutableLiveData<ServerInformation>()

    init {
        copyRepository.listeners.add(this)
    }

    override fun copyServiceConnected(manager: CopyServiceManager) {
        Log.d("Tag", "copyServiceConnected $manager")
    }
}
