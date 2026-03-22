import { Capacitor } from '@capacitor/core';

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
    await GoogleAuth.initialize({
      clientId: '602471950477-h5kud4birt5a806m85u5ab8pd8d31ubr.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
    });
    const result = await GoogleAuth.signIn();
    if (result.authentication?.idToken) {
      return { idToken: result.authentication.idToken };
    }
    return null;
  } catch (error) {
    console.error('Native Google Sign-In error:', error);
    throw error;
  }
};
