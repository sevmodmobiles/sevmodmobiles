package ru.sevmod.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** Телефон подключился к Wi-Fi или потерял его — проверить присутствие в офисе. */
public class NetworkChangeReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (!SevmodSessionPlugin.prefs(context).getBoolean("wifi_auto", false)) return;
        PresenceScheduler.checkNow(context.getApplicationContext(), "net");
    }
}
