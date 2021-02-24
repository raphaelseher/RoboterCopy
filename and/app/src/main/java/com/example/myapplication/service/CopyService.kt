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
import com.example.myapplication.MainActivity
import com.example.myapplication.R
import com.example.myapplication.Service.Message
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlin.properties.Delegates

class CopyServiceManager() {
    data class Server(
        val name: String,
        val discoveredAddress: String,
        val ipAddress: List<String>,
        val port: Int)

    interface Listener {
        fun discoveredServersChanged()
        fun connectionChanged()
    }

    interface Actions {
        fun connectServer(server: Server)
        fun disconnect()
    }

    val discoveredServers = mutableListOf<Server>()
    var listener: Listener? = null
    var actionDelegate: Actions? = null
    var isConnected: Boolean by Delegates.observable(false) {
        _, _, _ ->
        listener?.connectionChanged()
    }

    fun addDiscoveredServer(server: Server) {
        if (discoveredServers.contains(server)) {
            return
        }

        discoveredServers.add(server)
        listener?.discoveredServersChanged()
    }

    fun connectToServer(server: Server) {
        actionDelegate?.connectServer(server)
    }
}

class CopyService: Service(), DiscoveryService.Callback, ClipboardHandler.Listener,
    CopyServiceManager.Actions {
    val TAG = this.javaClass.simpleName

    inner class CopyBinder: Binder() {
        var receivedClipListener: ((clip: Message.Clipping) -> Unit)? = null
        fun getManager(): CopyServiceManager = manager
    }

    private val manager = CopyServiceManager().also { it.actionDelegate = this }
    private var copyBinder = CopyBinder()
    private lateinit var discoveryService: DiscoveryService
    private var clipboardHandler: ClipboardHandler? by Delegates.observable(null) {
        prop, old, new ->
        manager.isConnected = new != null
    }

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

    private fun connectToServer(address: String, port: Int) {
        clipboardHandler = ClipboardHandler(address, port, this).also {
            it.startListening()
        }
        updateNotification(true)
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
        val serverInformation = tempHandler.getServerInformation()
        manager.addDiscoveredServer(CopyServiceManager.Server(serverInformation.name, host,
            serverInformation.ipAddressesList, port))
        tempHandler.shutdown()
    }

    override fun discoveredServer(info: NsdServiceInfo) {
        Log.d(TAG, "discoveredServer: ${info.serviceName}")
        resolveServer(info.host.hostAddress, info.port)
    }

    override fun discoveryFailed(error: Exception) {
        Log.e(error.toString(), TAG)
    }

    override fun receivedClip(clip: Message.Clipping) {
        copyBinder.receivedClipListener?.invoke(clip)
    }

    override fun connectServer(server: CopyServiceManager.Server) {
        connectToServer(server.discoveredAddress, server.port)
    }

    override fun disconnect() {
        // clipboardHandler.channel.shutdown()
        clipboardHandler = null
        updateNotification(false)
    }

    companion object {
        const val ONGOING_NOTIFICATION_ID = 1;
        const val SERVICE_NOTIFICATION_CHANNEL_ID = "com.example.myapplication.service.CopyService.Foreground";
    }
}