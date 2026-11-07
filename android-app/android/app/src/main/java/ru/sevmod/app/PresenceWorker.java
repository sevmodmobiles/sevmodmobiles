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
        boolean wifi = onWifi(c);
        boolean lastWifi = s.getBoolean("wifi_last_sent", false);
        // не на Wi-Fi и об этом уже сообщали — ничего не делаем
        if (!wifi && !lastWifi) return Result.success();
        try {
            String ip = wifi ? publicIp() : "";
            JSONObject req = new JSONObject();
            req.put("action", "wifiPresence");
            req.put("phone", phone);
            req.put("ip", ip);
            req.put("onWifi", wifi);
            req.put("reason", getInputData().getString("reason") == null ? "tick" : getInputData().getString("reason"));
            AbsenceActionReceiver.post(api, req.toString());
            s.edit().putBoolean("wifi_last_sent", wifi).putLong("wifi_last_at", System.currentTimeMillis()).apply();
            return Result.success();
        } catch (Exception e) {
            return Result.retry();
        }
    }

    static boolean onWifi(Context c) {
        ConnectivityManager cm = (ConnectivityManager) c.getSystemService(Context.CONNECTIVITY_SERVICE);
        if (cm == null) return false;
        Network n = cm.getActiveNetwork();
        if (n == null) return false;
        NetworkCapabilities nc = cm.getNetworkCapabilities(n);
        return nc != null && nc.hasTransport(NetworkCapabilities.TRANSPORT_WIFI);
    }

    static String publicIp() throws Exception {
        HttpURLConnection c = (HttpURLConnection) new URL("https://api.ipify.org").openConnection();
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
