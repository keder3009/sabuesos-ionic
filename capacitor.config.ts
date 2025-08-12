import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'co.com.sabuesos.newapp',
  appName: 'sabuesos',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    NativeGeocoder: {
      useLocale: true,
      defaultLocale: "en",
      maxResults: 5
    },
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId: "909651562334-o2jsv9m3sdpkq11ng034bfsh2m7b5fb1.apps.googleusercontent.com",
      forceCodeForRefreshToken: false
    },
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#ffffff",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true
    }
  },
  ios: {
    handleApplicationNotifications: false
  },
};

export default config;
