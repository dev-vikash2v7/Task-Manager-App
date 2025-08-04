import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../config/firebase';

// Configure Google Sign-In
export const configureGoogleSignIn = () => {

  GoogleSignin.configure({
    // Get this from Google Cloud Console
    webClientId: '387521966166-rhfek880sd38v9e9scqp5v0bhkr3jdj3.apps.googleusercontent.com', 
  });
};

// Google Sign-In function
export const signInWithGoogle = async () => {
  try {
    // Check if device has Google Play Services
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    
    const signInResult = await GoogleSignin.signIn();

  // Try the new style of google-sign in result, from v13+ of that module
 let idToken = signInResult.data?.idToken;
 
  if (!idToken) {
    throw new Error('No ID token found');
  }

  // Create a Google credential with the token
  const googleCredential = GoogleAuthProvider.credential(idToken);

    // Sign in to Firebase with Google credential
    const result = await signInWithCredential(auth, googleCredential);
    
    console.log('Google Sign-In successful:', result.user.email);
    return result.user;
    
  } catch (error: any) {
    console.error('Google Sign-In error:', error);
    throw error;
  }
};

// Sign out from Google
export const signOutFromGoogle = async () => {
  try {
    await GoogleSignin.signOut();
    console.log('Signed out from Google');
  } catch (error) {
    console.error('Google Sign-Out error:', error);
  }
};

// Check if user is signed in with Google
export const isSignedInWithGoogle = async () => {
  try {
    const isSignedIn = await GoogleSignin.signIn();
    return isSignedIn;
  } catch (error) {
    console.error('Error checking Google sign-in status:', error);
    return false;
  }
};

// Get current user info from Google
export const getCurrentGoogleUser = async () => {
  try {
    const userInfo = await GoogleSignin.getCurrentUser();
    return userInfo;
  } catch (error) {
    console.error('Error getting current Google user:', error);
    return null;
  }
}; 