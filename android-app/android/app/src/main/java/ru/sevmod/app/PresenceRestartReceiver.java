package ru.sevmod.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** Перезагрузка телефона или обновление приложения — заново включить фоновую проверку Wi-Fi. */
public class PresenceRestartReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        String a = intent == null ? "" : String.valueOf(intent.getAction());
        if (!Intent.ACTION_BOOT_COMPLETED.equals(a) && !Intent.ACTION_MY_PACKAGE_REPLACED.equals(a)) return;
        if (!SevmodSessionPlugin.prefs(context).getBoolean("wifi_auto", false)) return;
        PresenceScheduler.start(context.getApplicationContext());
    }
}
