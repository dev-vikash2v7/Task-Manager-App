import { create } from 'zustand';
import { updateProfile, User } from 'firebase/auth';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { signInWithGoogle, signOutFromGoogle } from '../utils/googleSignIn';

interface AuthState {
  user: User | null;
  error: string | null;
  
  
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (displayName: string, email: string, password: string) => Promise<void>;
  signInWithGoogleAuth: () => Promise<void>;
  signOut: () => Promise<void>;
  
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  error: null,

  setUser: (user) => set({ user }),
  setError: (error) => set({ error }),

  signInWithEmail: async (email: string, password: string) => {
    set({  error: null });
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      set({ user: userCredential.user });
    } catch (error: any) {
      let errorMessage = 'Authentication failed ! Invalid login credentials .';
      // console.log({error});
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      
      set({ error: errorMessage });
      throw errorMessage;
    }
  },

  signUpWithEmail: async (displayName: string, email: string, password: string) => {
    set({ error: null });
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      set({ user: userCredential.user });
      const user = userCredential.user;

      // Update the user's display name
      updateProfile(user, {
        displayName: displayName // Replace with the desired display name
      })


    } catch (error: any) {
      let errorMessage = 'Registration failed';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      
      set({ error: errorMessage });
      throw errorMessage;
    }
  },

  signInWithGoogleAuth: async () => {
    set({ error: null });
    
    try {
      const user = await signInWithGoogle();
      set({ user });
    } catch (error: any) {
      let errorMessage = 'Google Sign-In failed';
      
      if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with this email using a different sign-in method';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid Google credentials';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Google Sign-In is not enabled for this app';
      } else if (error.code === 'SIGN_IN_CANCELLED') {
        errorMessage = 'Sign-in was cancelled';
      } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        errorMessage = 'Google Play Services not available';
      }
      
      set({ error: errorMessage });
      throw errorMessage;
    }
  },

  signOut: async () => {
    set({ error: null });
    
    try {
      await signOutFromGoogle();
      await firebaseSignOut(auth);
      set({ user: null });
    } catch (error) {
      console.error('Sign out error:', error);
      set({ error: 'Sign out failed' });
    }
  },

  clearError: () => set({ error: null }),
})); 