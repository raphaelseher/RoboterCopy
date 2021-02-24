package com.example.myapplication.extensions

import android.content.Context
import android.provider.Settings
import androidx.fragment.app.Fragment

fun Fragment.deviceName(): String {
    return Settings.System.getString(requireContext().contentResolver, "bluetooth_name") ?:
    Settings.Secure.getString(requireContext().contentResolver, "bluetooth_name") ?:
    Settings.System.getString(requireContext().contentResolver, "device_name") ?:
    Settings.Secure.getString(requireContext().contentResolver, "lock_screen_owner_info")
}