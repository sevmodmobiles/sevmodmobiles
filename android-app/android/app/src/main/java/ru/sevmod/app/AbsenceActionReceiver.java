package ru.sevmod.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import org.json.JSONObject;

/** Кнопки «Согласовать» / «Отклонить»: решение уходит на сервер без открытия приложения. */
public class AbsenceActionReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        final Context c = context.getApplicationContext();
        final String tag = intent.getStringExtra("tag");
        final String absId = intent.getStringExtra("absId");
        final String decision = intent.getStringExtra("decision");
        final String title = intent.getStringExtra("title");
        final String body = intent.getStringExtra("body");
        final boolean approve = "approve".equals(decision);
        AbsenceNotifier.status(c, tag, title, approve ? "Согласовываю…" : "Отклоняю…", true, 0);
        final PendingResult pr = goAsync();
        new Thread(() -> {
            try {
                SharedPreferences p = SevmodSessionPlugin.prefs(c);
                String phone = p.getString("phone", ""), api = p.getString("api", "");
                if (phone.isEmpty() || api.isEmpty()) throw new Exception("Откройте приложение SEVMOD и войдите");
                JSONObject req = new JSONObject();
                req.put("action", "adminDecideAbsence");
                req.put("phone", phone);
                req.put("id", absId);
                req.put("decision", decision);
                req.put("fromPush", true);
                JSONObject res = new JSONObject(post(api, req.toString()));
                if ("ok".equals(res.optString("status"))) {
                    AbsenceNotifier.status(c, tag, (approve ? "Согласовано: " : "Отклонено: ") + title.replace(" просит согласовать", ""),
                        body, false, 15000);
                } else {
                    AbsenceNotifier.status(c, tag, title, res.optString("message", "Не получилось — откройте приложение"), false, 60000);
                }
            } catch (Exception e) {
                AbsenceNotifier.status(c, tag, title, "Нет связи с сервером — откройте приложение и решите там. (" + e.getMessage() + ")", false, 0);
            } finally {
                pr.finish();
            }
        }).start();
    }

    /** POST в Apps Script: ответ приходит через перенаправление (302 → GET). */
    static String post(String api, String json) throws Exception {
        HttpURLConnection c = (HttpURLConnection) new URL(api).openConnection();
        c.setInstanceFollowRedirects(false);
        c.setConnectTimeout(6000);
        c.setReadTimeout(7000);
        c.setDoOutput(true);
        c.setRequestMethod("POST");
        c.setRequestProperty("Content-Type", "text/plain;charset=utf-8");
        try (OutputStream o = c.getOutputStream()) {
            o.write(json.getBytes(StandardCharsets.UTF_8));
        }
        int code = c.getResponseCode();
        for (int i = 0; i < 5 && code >= 300 && code < 400; i++) {
            String loc = c.getHeaderField("Location");
            c.disconnect();
            URL next = new URL(c.getURL(), loc);
            if (!"https".equals(next.getProtocol())) throw new Exception("insecure redirect");
            c = (HttpURLConnection) next.openConnection();
            c.setInstanceFollowRedirects(false);
            c.setConnectTimeout(6000);
            c.setReadTimeout(7000);
            code = c.getResponseCode();
        }
        if (code != 200) throw new Exception("HTTP " + code);
        try (InputStream in = c.getInputStream()) {
            ByteArrayOutputStream b = new ByteArrayOutputStream();
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) > 0) b.write(buf, 0, n);
            return b.toString("UTF-8");
        } finally {
            c.disconnect();
        }
    }
}
