package ru.sevmod.app;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkCapabilities;
import android.net.NetworkRequest;
import android.os.Build;
import androidx.work.Constraints;
import androidx.work.Data;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.ExistingWorkPolicy;
import androidx.work.NetworkType;
import androidx.work.OneTimeWorkRequest;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;
import java.util.concurrent.TimeUnit;

/** Включение/выключение фоновой проверки сети для автоотметки. */
public class PresenceScheduler {
    static final String PERIODIC = "sevmod_presence";
    static final String NOW = "sevmod_presence_now";

    static void start(Context c) {
        Constraints net = new Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build();
        PeriodicWorkRequest p = new PeriodicWorkRequest.Builder(PresenceWorker.class, 15, TimeUnit.MINUTES)
            .setConstraints(net).build();
        WorkManager.getInstance(c).enqueueUniquePeriodicWork(PERIODIC, ExistingPeriodicWorkPolicy.UPDATE, p);
        registerNetworkCallback(c);
        checkNow(c, "start");
    }

    static void stop(Context c) {
        WorkManager.getInstance(c).cancelUniqueWork(PERIODIC);
        try {
            ConnectivityManager cm = (ConnectivityManager) c.getSystemService(Context.CONNECTIVITY_SERVICE);
            if (cm != null) cm.unregisterNetworkCallback(networkIntent(c));
        } catch (Exception e) { /* не был зарегистрирован */ }
    }

    static void checkNow(Context c, String reason) {
        OneTimeWorkRequest w = new OneTimeWorkRequest.Builder(PresenceWorker.class)
            .setInputData(new Data.Builder().putString("reason", reason).build())
            .setInitialDelay(5, TimeUnit.SECONDS) // дать сети установиться
            .build();
        WorkManager.getInstance(c).enqueueUniqueWork(NOW, ExistingWorkPolicy.REPLACE, w);
    }

    static PendingIntent networkIntent(Context c) {
        Intent i = new Intent(c, NetworkChangeReceiver.class);
        int f = PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 31 ? PendingIntent.FLAG_MUTABLE : 0);
        return PendingIntent.getBroadcast(c, 7301, i, f);
    }

    /** Сообщения о смене сети приходят, даже когда приложение закрыто. */
    static void registerNetworkCallback(Context c) {
        try {
            ConnectivityManager cm = (ConnectivityManager) c.getSystemService(Context.CONNECTIVITY_SERVICE);
            if (cm == null) return;
            NetworkRequest r = new NetworkRequest.Builder().addTransportType(NetworkCapabilities.TRANSPORT_WIFI).build();
            cm.registerNetworkCallback(r, networkIntent(c));
        } catch (Exception e) { /* без мгновенных событий — останется проверка раз в 15 минут */ }
    }
}
