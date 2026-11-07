package ru.sevmod.app;

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

    @PluginMethod
    public void status(PluginCall call) {
        JSObject r = new JSObject();
        r.put("enabled", SevmodSessionPlugin.prefs(getContext()).getBoolean("wifi_auto", false));
        r.put("onWifi", PresenceWorker.onWifi(getContext()));
        r.put("lastAt", SevmodSessionPlugin.prefs(getContext()).getLong("wifi_last_at", 0));
        call.resolve(r);
    }
}
