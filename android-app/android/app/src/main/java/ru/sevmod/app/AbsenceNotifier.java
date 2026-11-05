package ru.sevmod.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;
import java.util.Map;

/** Уведомление о заявке с кнопками «Согласовать» / «Отклонить». */
public class AbsenceNotifier {
    static final String CHANNEL = "sevmod";
    static final int ID = 1;

    static void ensureChannel(Context c) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager nm = c.getSystemService(NotificationManager.class);
            if (nm != null && nm.getNotificationChannel(CHANNEL) == null) {
                NotificationChannel ch = new NotificationChannel(CHANNEL, "SEVMOD", NotificationManager.IMPORTANCE_HIGH);
                ch.setDescription("Задачи, заявки, напоминания об уходе");
                nm.createNotificationChannel(ch);
            }
        }
    }

    static int flags() {
        return PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE;
    }

    /** Нажатие на само уведомление — открыть приложение на нужном экране. */
    static PendingIntent openApp(Context c, Map<String, String> d, String tag) {
        Intent i = new Intent(c, MainActivity.class);
        i.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        for (Map.Entry<String, String> e : d.entrySet()) i.putExtra(e.getKey(), e.getValue());
        i.putExtra("google.message_id", "local-" + tag);
        return PendingIntent.getActivity(c, ("open" + tag).hashCode(), i, flags());
    }

    static PendingIntent decide(Context c, String tag, String absId, String decision, String title, String body) {
        Intent i = new Intent(c, AbsenceActionReceiver.class);
        i.setAction("ru.sevmod.app.ABS_DECIDE." + decision);
        i.putExtra("tag", tag).putExtra("absId", absId).putExtra("decision", decision)
            .putExtra("title", title).putExtra("body", body);
        return PendingIntent.getBroadcast(c, (decision + tag).hashCode(), i, flags());
    }

    static NotificationCompat.Builder base(Context c, String title, String body) {
        ensureChannel(c);
        return new NotificationCompat.Builder(c, CHANNEL)
            .setSmallIcon(R.drawable.ic_stat_sevmod)
            .setColor(ContextCompat.getColor(c, R.color.sevmod_brand))
            .setContentTitle(title)
            .setContentText(body)
            .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_MESSAGE);
    }

    static void show(Context c, Map<String, String> d) {
        String tag = d.get("tag"), absId = d.get("absId");
        String title = d.get("title"), body = d.get("body");
        if (tag == null || absId == null) return;
        NotificationCompat.Builder b = base(c, title, body)
            .setAutoCancel(true)
            .setContentIntent(openApp(c, d, tag))
            .addAction(0, "Согласовать", decide(c, tag, absId, "approve", title, body))
            .addAction(0, "Отклонить", decide(c, tag, absId, "reject", title, body));
        post(c, tag, b);
    }

    /** Состояние после нажатия кнопки: «Отправляю…», итог или ошибка. */
    static void status(Context c, String tag, String title, String text, boolean progress, long timeoutMs) {
        NotificationCompat.Builder b = base(c, title, text)
            .setOnlyAlertOnce(true)
            .setSilent(true)
            .setAutoCancel(true)
            .setContentIntent(openApp(c, java.util.Collections.singletonMap("screen", "adminAbsences"), tag));
        if (progress) b.setProgress(0, 0, true).setOngoing(true);
        if (timeoutMs > 0) b.setTimeoutAfter(timeoutMs);
        post(c, tag, b);
    }

    static void cancel(Context c, String tag) {
        if (tag != null) NotificationManagerCompat.from(c).cancel(tag, ID);
    }

    static void post(Context c, String tag, NotificationCompat.Builder b) {
        try {
            NotificationManagerCompat.from(c).notify(tag, ID, b.build());
        } catch (SecurityException e) {
            // уведомления запрещены пользователем — ничего не показываем
        }
    }
}
