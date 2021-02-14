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


class CopyService: Service(), DiscoveryService.Callback, ClipboardHandler.Listener {
    val TAG = this.javaClass.simpleName

    inner class CopyBinder: Binder() {
        var receivedClipListener: ((clip: Message.Clipping) -> Unit)? = null
        fun getClipboardHandler(): ClipboardHandler? = clipboardHandler
    }

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
        val pendingIntent: PendingIntent =
            Intent(this, MainActivity::class.java).let { notificationIntent ->
                PendingIntent.getActivity(this, 0, notificationIntent, 0)
            }

        startForeground(ONGOING_NOTIFICATION_ID, createNotification(pendingIntent))
        return START_STICKY;
    }

    override fun onDestroy() {
        Toast.makeText(baseContext, "Copy Service destroyed", Toast.LENGTH_SHORT).show()
        super.onDestroy()
    }

    private fun createNotification(pendingIntent: PendingIntent): Notification {
        val channel = NotificationChannel(SERVICE_NOTIFICATION_CHANNEL_ID, "RoboCopy",
            NotificationManager.IMPORTANCE_LOW)
        channel.description = "Foreground Service Notification Channel"
        channel.setSound(null, null)
        val notificationManager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.createNotificationChannel(channel)

        return Notification.Builder(this, SERVICE_NOTIFICATION_CHANNEL_ID)
            .setContentTitle("Not title")
            .setContentText("Not Message")
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setContentIntent(pendingIntent)
            .setTicker("Ticker?")
            .setOngoing(true)
            .setCategory(Notification.CATEGORY_SERVICE)
            .build()
    }

    override fun discoveredServer(info: NsdServiceInfo) {
        clipboardHandler = ClipboardHandler(info.host.hostAddress, info.port, this)
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