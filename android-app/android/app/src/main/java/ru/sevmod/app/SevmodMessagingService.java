package ru.sevmod.app;

import androidx.annotation.NonNull;
import com.capacitorjs.plugins.pushnotifications.MessagingService;
import com.google.firebase.messaging.RemoteMessage;
import java.util.Map;

/**
 * Принимает push-сообщения. Заявки на согласование (kind=absReq) приходят
 * без готового уведомления — показываем их сами, с кнопками; kind=cancel —
 * убрать уведомление (заявку уже рассмотрели). Остальное — как раньше,
 * через модуль Capacitor (его методы вызываются через super).
 */
public class SevmodMessagingService extends MessagingService {
    @Override
    public void onMessageReceived(@NonNull RemoteMessage m) {
        Map<String, String> d = m.getData();
        String kind = d.get("kind");
        if (m.getNotification() == null) {
            if ("absReq".equals(kind)) AbsenceNotifier.show(this, d);
            else if ("cancel".equals(kind)) AbsenceNotifier.cancel(this, d.get("tag"));
        }
        super.onMessageReceived(m);
    }
}
