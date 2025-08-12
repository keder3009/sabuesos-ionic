package co.com.sabuesos.newapp;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.keder.capacitor.admob.googleAdmodPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate (Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(googleAdmodPlugin.class);
    }
}
