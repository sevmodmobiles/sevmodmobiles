package ru.sevmod.app;

import android.content.Context;
import android.content.SharedPreferences;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONObject;

/**
 * Автоотметка по Wi-Fi офиса (тест): узнаёт, на Wi-Fi ли телефон, и его внешний
 * IP, и сообщает серверу (wifiPresence). Офис по IP определяет сервер.
 * Запускается раз в ~15 минут и при каждой смене сети.
 */
public class PresenceWorker extends Worker {
    public PresenceWorker(@NonNull Context c, @NonNull WorkerParameters p) {
        super(c, p);
    }

    @NonNull
    @Override
    public Result doWork() {
        Context c = getApplicationContext();
        SharedPreferences s = SevmodSessionPlugin.prefs(c);
        if (!s.getBoolean("wifi_auto", false)) return Result.success();
        String phone = s.getString("phone", ""), api = s.getString("api", "");
        if (phone.isEmpty() || api.isEmpty()) return Result.success();
        PresenceScheduler.registerNetworkCallback(c); // переживает перезапуск телефона
        Network wifiNet = wifiNetwork(c);
        boolean wifi = wifiNet != null;
        boolean lastWifi = s.getBoolean("wifi_last_sent", false);
        // не на Wi-Fi и об этом уже сообщали — ничего не делаем
        if (!wifi && !lastWifi) return Result.success();
        try {
            // адрес узнаём именно через Wi-Fi — в обход VPN, если он включён
            // IP — не обязателен: офис узнаётся по имени сети/роутеру; сбой сервиса IP не должен срывать отметку
            String ip = "";
            if (wifi) { try { ip = publicIp(wifiNet); } catch (Exception e) { ip = ""; } }
            JSONObject req = new JSONObject();
            req.put("action", "wifiPresence");
            req.put("phone", phone);
            req.put("ip", ip);
            req.put("onWifi", wifi);
            // имя сети и роутер — по ним сервер узнаёт офис (нужна геолокация «Всегда»)
            if (wifi) {
                String[] id = wifiId(c);
                req.put("ssid", id[0]);
                req.put("bssid", id[1]);
            }
            req.put("reason", getInputData().getString("reason") == null ? "tick" : getInputData().getString("reason"));
            AbsenceActionReceiver.post(api, req.toString());
            s.edit().putBoolean("wifi_last_sent", wifi).putLong("wifi_last_at", System.currentTimeMillis()).apply();
            return Result.success();
        } catch (Exception e) {
            return Result.retry();
        }
    }

    /** {имя сети, адрес роутера}; пусто, если Android не дал (нет разрешения). */
    @SuppressWarnings("deprecation")
    static String[] wifiId(Context c) {
        try {
            android.net.wifi.WifiManager wm = (android.net.wifi.WifiManager) c.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
            android.net.wifi.WifiInfo wi = wm != null ? wm.getConnectionInfo() : null;
            if (wi == null) return new String[] { "", "" };
            String ssid = wi.getSSID() == null ? "" : wi.getSSID().replace("\"", "");
            if ("<unknown ssid>".equals(ssid)) ssid = "";
            String bssid = wi.getBSSID() == null ? "" : wi.getBSSID();
            if ("02:00:00:00:00:00".equals(bssid)) bssid = "";
            return new String[] { ssid, bssid };
        } catch (Exception e) {
            return new String[] { "", "" };
        }
    }

    static boolean onWifi(Context c) {
        return wifiNetwork(c) != null;
    }

    /** Подключённая сеть Wi-Fi (не VPN) или null. */
    static Network wifiNetwork(Context c) {
        ConnectivityManager cm = (ConnectivityManager) c.getSystemService(Context.CONNECTIVITY_SERVICE);
        if (cm == null) return null;
        for (Network n : cm.getAllNetworks()) {
            NetworkCapabilities nc = cm.getNetworkCapabilities(n);
            if (nc != null && nc.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)
                && !nc.hasTransport(NetworkCapabilities.TRANSPORT_VPN)
                && nc.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)) return n;
        }
        return null;
    }

    static String publicIp(Network net) throws Exception {
        URL u = new URL("https://api.ipify.org");
        HttpURLConnection c = (HttpURLConnection) (net != null ? net.openConnection(u) : u.openConnection());
        c.setConnectTimeout(6000);
        c.setReadTimeout(6000);
        try (InputStream in = c.getInputStream()) {
            byte[] b = new byte[64];
            int n = in.read(b);
            return n > 0 ? new String(b, 0, n, "UTF-8").trim() : "";
        } finally {
            c.disconnect();
        }
    }
}
