
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quickfit.dev',
  appName: 'QuickFit',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
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
      forceCodeForRefreshToken: true
    }
  }
};

export default config;
