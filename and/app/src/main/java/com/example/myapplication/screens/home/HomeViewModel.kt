package com.example.myapplication.screens.home

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

data class ServerInformation(
    val hostname: String,
    val address: String?,
    val port: String,
    val isConnected: Boolean
)

class HomeViewModel : ViewModel() {
    val deviceName = MutableLiveData<String>("-")
    val serverInformation = MutableLiveData<ServerInformation>()

    init {
        deviceName.value = "OnePlus"
    }
}