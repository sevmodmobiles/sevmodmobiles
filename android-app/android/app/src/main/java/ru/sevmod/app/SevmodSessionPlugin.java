package ru.sevmod.app;

import android.content.Context;
import android.content.SharedPreferences;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Запоминает телефон вошедшего сотрудника и адрес сервера — нужны кнопкам
 * «Согласовать» / «Отклонить» в уведомлении, которые работают без открытия
 * приложения.
 */
@CapacitorPlugin(name = "SevmodSession")
public class SevmodSessionPlugin extends Plugin {
    static final String PREFS = "sevmod_session";

    static SharedPreferences prefs(Context c) {
        return c.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    @PluginMethod
    public void setSession(PluginCall call) {
        String phone = call.getString("phone", "");
        String api = call.getString("apiUrl", "");
        if (!api.startsWith("https://script.google.com/")) {
            call.reject("bad api url");
            return;
        }
        prefs(getContext()).edit().putString("phone", phone).putString("api", api).apply();
        call.resolve();
    }

    @PluginMethod
    public void clear(PluginCall call) {
        prefs(getContext()).edit().clear().apply();
        call.resolve();
    }
}
