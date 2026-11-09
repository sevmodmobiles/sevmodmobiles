package ru.sevmod.app;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/** Автоотметка по Wi-Fi офиса: включить / выключить / состояние. */
@CapacitorPlugin(name = "WifiPresence")
public class WifiPresencePlugin extends Plugin {
    @PluginMethod
    public void start(PluginCall call) {
        SevmodSessionPlugin.prefs(getContext()).edit().putBoolean("wifi_auto", true).apply();
        PresenceScheduler.start(getContext());
        call.resolve();
    }

    @PluginMethod
    public void stop(PluginCall call) {
        SevmodSessionPlugin.prefs(getContext()).edit().putBoolean("wifi_auto", false).putBoolean("wifi_last_sent", false).apply();
        PresenceScheduler.stop(getContext());
        call.resolve();
    }

    /** Внешний IP через Wi-Fi (в обход VPN) — для отметки по Wi-Fi офиса. */
    @PluginMethod
    public void wifiIp(PluginCall call) {
        new Thread(() -> {
            JSObject r = new JSObject();
            try {
                android.net.Network n = PresenceWorker.wifiNetwork(getContext());
                r.put("onWifi", n != null);
                r.put("ip", n != null ? PresenceWorker.publicIp(n) : "");
            } catch (Exception e) {
                r.put("ip", "");
            }
            call.resolve(r);
        }).start();
    }

    private boolean granted(String p) {
        return ContextCompat.checkSelfPermission(getContext(), p) == PackageManager.PERMISSION_GRANTED;
    }

    /** Разрешения для имени сети Wi-Fi в фоне: геолокация и «Всегда», включена ли геолокация. */
    @PluginMethod
    public void locStatus(PluginCall call) {
        JSObject r = new JSObject();
        boolean fine = granted(Manifest.permission.ACCESS_FINE_LOCATION);
        boolean bg = Build.VERSION.SDK_INT < 29 || granted(Manifest.permission.ACCESS_BACKGROUND_LOCATION);
        boolean on = true;
        try {
            LocationManager lm = (LocationManager) getContext().getSystemService(android.content.Context.LOCATION_SERVICE);
            on = lm == null || Build.VERSION.SDK_INT < 28 || lm.isLocationEnabled();
        } catch (Exception e) { /* считаем включённой */ }
        String[] id = PresenceWorker.wifiId(getContext());
        r.put("fine", fine);
        r.put("background", bg);
        r.put("locationOn", on);
        r.put("ssid", id[0]);
        r.put("bssid", id[1]);
        call.resolve(r);
    }

    /** Шаг 1 — системный вопрос о геолокации; шаг 2 — настройки приложения, где выбрать «Разрешить всегда». */
    @PluginMethod
    public void requestLocationAlways(PluginCall call) {
        if (!granted(Manifest.permission.ACCESS_FINE_LOCATION)) {
            ActivityCompat.requestPermissions(getActivity(), new String[] {
                Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION }, 7302);
        } else if (Build.VERSION.SDK_INT >= 29 && !granted(Manifest.permission.ACCESS_BACKGROUND_LOCATION)) {
            Intent i = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + getContext().getPackageName()));
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(i);
        }
        call.resolve();
    }

    @PluginMethod
    public void openLocationSettings(PluginCall call) {
        Intent i = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getContext().startActivity(i);
        call.resolve();
    }

    @PluginMethod
    public void status(PluginCall call) {
        JSObject r = new JSObject();
        r.put("enabled", SevmodSessionPlugin.prefs(getContext()).getBoolean("wifi_auto", false));
        r.put("onWifi", PresenceWorker.onWifi(getContext()));
        r.put("lastAt", SevmodSessionPlugin.prefs(getContext()).getLong("wifi_last_at", 0));
        call.resolve(r);
    }
}
