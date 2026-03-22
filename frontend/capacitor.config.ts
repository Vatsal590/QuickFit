
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quickfit.dev',
  appName: 'QuickFit',
  webDir: 'build',
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
      iosClientId: '602471950477-0gu5j74jda1dg0edr9etqjitslp4hkir.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    }
  }
};

export default config;
