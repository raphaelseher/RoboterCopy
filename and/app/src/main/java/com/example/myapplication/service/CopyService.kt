package com.example.myapplication.service

import android.app.*
import android.content.Context
import android.content.Intent
import android.net.nsd.NsdManager
import android.net.nsd.NsdServiceInfo
import android.os.Binder
import android.os.IBinder
import android.util.Log
import android.widget.Toast
import androidx.lifecycle.MutableLiveData
import com.example.myapplication.MainActivity
import com.example.myapplication.R
import com.example.myapplication.Service.Message
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

class CopyServiceManager() {
    data class Server(
        val name: String,
        val discoverdAdress: String,
        val ipAddress: List<String>,
        val port: Int)

    interface Listener {
        fun discoveredServersChanged()
    }

    val discoveredServers = mutableListOf<Server>()
    var listener: Listener? = null

    fun addDiscoveredServer(server: Server) {
        if (discoveredServers.contains(server)) {
            return
        }

        discoveredServers.add(server)
        listener?.discoveredServersChanged()
    }
}

class CopyService: Service(), DiscoveryService.Callback, ClipboardHandler.Listener {
    val TAG = this.javaClass.simpleName

    inner class CopyBinder: Binder() {
        var receivedClipListener: ((clip: Message.Clipping) -> Unit)? = null
        fun getManager(): CopyServiceManager = manager
    }

    private val manager = CopyServiceManager()
    private var copyBinder = CopyBinder()
    private lateinit var discoveryService: DiscoveryService
    private var clipboardHandler: ClipboardHandler? = null

    override fun onBind(intent: Intent?): IBinder {
        return copyBinder
    }

    override fun onCreate() {
        discoveryService = DiscoveryService(getSystemService(Context.NSD_SERVICE) as NsdManager)
        discoveryService.listener = this
        super.onCreate()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        startForeground(ONGOING_NOTIFICATION_ID, createNotification("Disconnected",
            R.drawable.ic_notification_disconnected))
        return START_STICKY;
    }

    override fun onDestroy() {
        Toast.makeText(baseContext, "Copy Service destroyed", Toast.LENGTH_SHORT).show()
        super.onDestroy()
    }

    private fun createNotification(title: String, icon: Int): Notification {
        val pendingIntent = Intent(this, MainActivity::class.java).let {
            PendingIntent.getActivity(this, 0, it, 0)
        }

        val channel = NotificationChannel(SERVICE_NOTIFICATION_CHANNEL_ID, "RoboCopy",
            NotificationManager.IMPORTANCE_LOW)
        channel.description = "Foreground Service Notification Channel"
        channel.setSound(null, null)
        val notificationManager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.createNotificationChannel(channel)

        // TODO: `setAction` for Stop & CopyLastAgain
        return Notification.Builder(this, SERVICE_NOTIFICATION_CHANNEL_ID)
            .setContentTitle(title)
            .setSmallIcon(icon)
            .setContentIntent(pendingIntent)
            .setLocalOnly(true)
            .setOngoing(true)
            .setCategory(Notification.CATEGORY_SERVICE)
            .build()
    }

    private fun updateNotification(connected: Boolean) {
        Log.d(TAG, "UpdateNotification: $connected")

        val title = if (connected) "Connected" else "Disconnected"
        val icon = if (connected) R.drawable.ic_notification_connected else R.drawable.ic_notification_disconnected
        (getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager).also {
            it.notify(ONGOING_NOTIFICATION_ID, createNotification(title, icon))
        }
    }

    private fun resolveServer(host: String, port: Int) = GlobalScope.launch {
        val tempHandler = ClipboardHandler(host, port, null)
        tempHandler.getServerInformation().also {
            manager.addDiscoveredServer(CopyServiceManager.Server(it.name, host, it.ipAddressesList, port))
        }
        tempHandler.shutdown()
    }

    override fun discoveredServer(info: NsdServiceInfo) {
        Log.d(TAG, "discoveredServer: ${info.serviceName}")
        resolveServer(info.host.hostAddress, info.port)
        clipboardHandler = ClipboardHandler(info.host.hostAddress, info.port, this).also {
            it.startListening()
        }
        updateNotification(true)
    }

    override fun discoveryFailed(error: Exception) {
        Log.e(error.toString(), TAG)
    }

    override fun receivedClip(clip: Message.Clipping) {
        copyBinder.receivedClipListener?.invoke(clip)
    }

    companion object {
        const val ONGOING_NOTIFICATION_ID = 1;
        const val SERVICE_NOTIFICATION_CHANNEL_ID = "com.example.myapplication.service.CopyService.Foreground";
    }
}