import { Capacitor } from '@capacitor/core';

let nativeGoogleInitialized = false;

// Check if running as a native app
export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

// Generate a random nonce string
export const generateNonce = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

// Hash nonce with SHA-256 for Google
export const hashNonce = async (nonce: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(nonce);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

// Native Google Sign-In using Capacitor plugin
export const nativeGoogleSignIn = async (): Promise<{ idToken: string } | null> => {
  try {
    const { GoogleAuth } = await import('@codetrix-studio/capacitor-google-auth');
    const platform = Capacitor.getPlatform();
    const iosClientId = '602471950477-0gu5j74jda1dg0edr9etqjitslp4hkir.apps.googleusercontent.com';
    const webClientId = '602471950477-h5kud4birt5a806m85u5ab8pd8d31ubr.apps.googleusercontent.com';

    if (!nativeGoogleInitialized) {
      const initOptions = {
        clientId: webClientId,
        iosClientId: iosClientId,
        serverClientId: webClientId,
        scopes: ['profile', 'email'],
        grantOfflineAccess: false,
      };
      console.log('Initializing GoogleAuth with options:', JSON.stringify(initOptions));
      await GoogleAuth.initialize(initOptions as any);
      nativeGoogleInitialized = true;
    }
    
    // Try silent native session restore first to avoid showing Google account UI repeatedly
    try {
      const refreshed = await GoogleAuth.refresh();
      if (refreshed?.idToken) {
        return { idToken: refreshed.idToken };
      }
    } catch {
      // Expected when user has not signed in before on this device
    }

    const result = await GoogleAuth.signIn();
    
    if (result.authentication?.idToken) {
      return { idToken: result.authentication.idToken };
    }
    
    console.error('No idToken returned from Google Sign-In. Platform:', platform);
    return null;
  } catch (error: any) {
    if (error?.message?.includes('canceled') || error?.message?.includes('cancelled')) {
      console.log('Google Sign-In was cancelled by user');
      return null;
    }
    console.error('Native Google Sign-In error:', error);
    throw error;
  }
};
