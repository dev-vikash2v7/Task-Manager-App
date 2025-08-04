import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button, useTheme, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  User as FirebaseUser 
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { configureGoogleSignIn, signInWithGoogle } from '../utils/googleSignIn';
import CustomInput from '../components/CustomInput';

interface AuthScreenProps {
  navigation: any;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!displayName) {
        newErrors.displayName = 'Display name is required';
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Sign in
        await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in successfully');
      } else {
        // Sign up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('User created successfully:', userCredential.user.uid);
      }
      
      // Navigation will be handled by AppNavigator's auth state listener
      
    } catch (error: any) {
      console.error('Auth error:', error);
      let errorMessage = 'Authentication failed';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      
      setErrors({ auth: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrors({});
    
    try {
      await signInWithGoogle();
      console.log('Google Sign-In successful');
      // Navigation will be handled by AppNavigator's auth state listener
      
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
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
      
      setErrors({ google: errorMessage });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text variant="displaySmall" style={[styles.title, { color: theme.colors.primary }]}>
              Gig Task Manager
            </Text>
            <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </Text>
          </View>

          <View style={styles.form}>
            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text variant="bodyMedium" style={[styles.label, { color: theme.colors.onSurface }]}>
                  Display Name
                </Text>
                <CustomInput
                  value={displayName}
                  onChangeText={setDisplayName}
                  error={!!errors.displayName}
                  placeholder="Enter your display name"
                  style={styles.input}
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text variant="bodyMedium" style={[styles.label, { color: theme.colors.onSurface }]}>
                Email
              </Text>
              <CustomInput
                value={email}
                onChangeText={setEmail}
                error={!!errors.email}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text variant="bodyMedium" style={[styles.label, { color: theme.colors.onSurface }]}>
                Password
              </Text>
              <CustomInput
                value={password}
                onChangeText={setPassword}
                error={!!errors.password}
                placeholder="Enter your password"
                secureTextEntry
                style={styles.input}
              />
            </View>

            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text variant="bodyMedium" style={[styles.label, { color: theme.colors.onSurface }]}>
                  Confirm Password
                </Text>
                <CustomInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  error={!!errors.confirmPassword}
                  placeholder="Confirm your password"
                  secureTextEntry
                  style={styles.input}
                />
              </View>
            )}

            {Object.keys(errors).length > 0 && (
              <View style={styles.errorContainer}>
                {Object.values(errors).map((error, index) => (
                  <Text key={index} style={[styles.errorText, { color: theme.colors.error }]}>
                    {error}
                  </Text>
                ))}
              </View>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
              contentStyle={styles.buttonContent}
              loading={isLoading}
              disabled={isLoading || isGoogleLoading}
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>

            <Divider style={styles.divider} />

            <Button
              mode="outlined"
              onPress={handleGoogleSignIn}
              style={styles.googleButton}
              contentStyle={styles.buttonContent}
              loading={isGoogleLoading}
              disabled={isLoading || isGoogleLoading}
              icon="google"
            >
              Continue with Google
            </Button>

            <Divider style={styles.divider} />

            <Button
              mode="text"
              onPress={toggleMode}
              style={styles.toggleButton}
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    marginBottom: 0,
  },
  errorContainer: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 4,
  },
  button: {
    marginBottom: 16,
  },
  googleButton: {
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  divider: {
    marginVertical: 16,
  },
  toggleButton: {
    marginTop: 8,
  },
});

export default AuthScreen; 