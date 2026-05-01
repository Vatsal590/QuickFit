
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quickfit.dev',
  appName: 'QuickFit',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#16a34a',
      showSpinner: false
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '602471950477-h5kud4birt5a806m85u5ab8pd8d31ubr.apps.googleusercontent.com',
      iosClientId: '602471950477-0gu5j74jda1dg0edr9etqjitslp4hkir.apps.googleusercontent.com',
      androidClientId: '602471950477-mo08salu0lu9nvgqlvpnq5djipt13r47.apps.googleusercontent.com',
      forceCodeForRefreshToken: false
    }
  }
};

export default config;
