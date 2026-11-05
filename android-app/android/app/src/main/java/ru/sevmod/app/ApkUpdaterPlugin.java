package ru.sevmod.app;

import android.app.PendingIntent;
import android.content.Intent;
import android.content.pm.PackageInstaller;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import androidx.core.content.FileProvider;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Обновление приложения из самого приложения: скачивает APK (с прогрессом —
 * событие "progress") и открывает системное окно «Обновить приложение?».
 * Android не позволяет ставить приложения не из магазина без этого окна.
 */
@CapacitorPlugin(name = "ApkUpdater")
public class ApkUpdaterPlugin extends Plugin {

    /** Разрешено ли приложению предлагать установку (Android 8+ спрашивает один раз). */
    @PluginMethod
    public void canInstall(PluginCall call) {
        JSObject r = new JSObject();
        r.put("allowed", canInstall_());
        call.resolve(r);
    }

    /** Открывает настройку «Разрешить установку из этого источника» для SEVMOD. */
    @PluginMethod
    public void openInstallSettings(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Intent i = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                Uri.parse("package:" + getContext().getPackageName()));
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(i);
        }
        call.resolve();
    }

    static ApkUpdaterPlugin instance;

    @Override
    public void load() {
        instance = this;
    }

    /** Итог установки из InstallResultReceiver — в приложение (событие installStatus). */
    static void reportInstall(int status, String message) {
        if (instance == null) return;
        JSObject r = new JSObject();
        r.put("status", status);
        r.put("message", message == null ? "" : message);
        instance.notifyListeners("installStatus", r);
    }

    @PluginMethod
    public void downloadAndInstall(PluginCall call) {
        download(call, false);
    }

    /** Через системный установщик (PackageInstaller) — без окна «Открыть с помощью». */
    @PluginMethod
    public void downloadAndInstallSession(PluginCall call) {
        download(call, true);
    }

    private void installWithSession(File apk) throws Exception {
        PackageInstaller pi = getContext().getPackageManager().getPackageInstaller();
        PackageInstaller.SessionParams params = new PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL);
        params.setAppPackageName(getContext().getPackageName());
        int id = pi.createSession(params);
        try (PackageInstaller.Session s = pi.openSession(id)) {
            try (InputStream in = new FileInputStream(apk); OutputStream out = s.openWrite("sevmod", 0, apk.length())) {
                byte[] buf = new byte[65536];
                int n;
                while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
                s.fsync(out);
            }
            Intent cb = new Intent(getContext(), InstallResultReceiver.class);
            cb.setAction("ru.sevmod.app.INSTALL_RESULT");
            int f = PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 31 ? PendingIntent.FLAG_MUTABLE : 0);
            PendingIntent p = PendingIntent.getBroadcast(getContext(), id, cb, f);
            s.commit(p.getIntentSender());
        }
    }

    private void download(final PluginCall call, final boolean session) {
        final String url = call.getString("url");
        if (url == null || !url.startsWith("https://")) {
            call.reject("bad url");
            return;
        }
        new Thread(() -> {
            HttpURLConnection c = null;
            try {
                File dir = new File(getContext().getCacheDir(), "update");
                dir.mkdirs();
                File apk = new File(dir, "sevmod.apk");
                URL u = new URL(url);
                int redirects = 0;
                while (true) {
                    c = (HttpURLConnection) u.openConnection();
                    c.setInstanceFollowRedirects(false);
                    c.setConnectTimeout(20000);
                    c.setReadTimeout(30000);
                    int code = c.getResponseCode();
                    if (code >= 300 && code < 400 && redirects++ < 5) {
                        String loc = c.getHeaderField("Location");
                        c.disconnect();
                        u = new URL(u, loc);
                        if (!"https".equals(u.getProtocol())) throw new Exception("insecure redirect");
                        continue;
                    }
                    if (code != 200) throw new Exception("HTTP " + code);
                    break;
                }
                long total = c.getContentLengthLong();
                long done = 0;
                int lastPct = -1;
                try (InputStream in = c.getInputStream(); OutputStream out = new FileOutputStream(apk)) {
                    byte[] buf = new byte[65536];
                    int n;
                    while ((n = in.read(buf)) > 0) {
                        out.write(buf, 0, n);
                        done += n;
                        int pct = total > 0 ? (int) (done * 100 / total) : -1;
                        if (pct != lastPct) {
                            lastPct = pct;
                            JSObject p = new JSObject();
                            p.put("percent", pct);
                            p.put("bytes", done);
                            notifyListeners("progress", p);
                        }
                    }
                }
                if (total > 0 && done != total) throw new Exception("download incomplete");
                if (session) {
                    installWithSession(apk);
                } else {
                    Uri uri = FileProvider.getUriForFile(getContext(), getContext().getPackageName() + ".fileprovider", apk);
                    Intent i = new Intent(Intent.ACTION_VIEW);
                    i.setDataAndType(uri, "application/vnd.android.package-archive");
                    i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
                    getContext().startActivity(i);
                }
                JSObject r = new JSObject();
                r.put("started", true);
                call.resolve(r);
            } catch (Exception e) {
                call.reject(String.valueOf(e.getMessage()));
            } finally {
                if (c != null) c.disconnect();
            }
        }).start();
    }

    private boolean canInstall_() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            return getContext().getPackageManager().canRequestPackageInstalls();
        }
        return true;
    }
}
