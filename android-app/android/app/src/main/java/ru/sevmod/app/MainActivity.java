package ru.sevmod.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(ApkUpdaterPlugin.class);
        registerPlugin(SevmodSessionPlugin.class);
        registerPlugin(WifiPresencePlugin.class);
        super.onCreate(savedInstanceState);
    }
}
