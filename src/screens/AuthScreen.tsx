import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button, useTheme, Divider, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { configureGoogleSignIn } from '../utils/googleSignIn';
import { useAuthStore } from '../stores/authStore';
import CustomInput from '../components/CustomInput';
import Toast from '../components/Toast';

interface AuthScreenProps {
  navigation: any;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  
  // Toast state
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error' ,
  });

  // Zustand auth store
  const { 
    error: authError, 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithGoogleAuth, 
    clearError 
  } = useAuthStore();

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  useEffect(() => {
    clearError();
  }, [isLogin, clearError]);

  const showToast = (message: string, type: 'success' | 'error' ) => {
    setToast({
      visible: true,
      message,
      type,
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

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

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmail(email, password);
        showToast('Signed in successfully!', 'success');
      } else {
        await signUpWithEmail(displayName , email, password);
        showToast('Account created successfully!', 'success');
      }
    } catch (error: any) {
      // Error is handled by the store
      showToast(error, 'error');
    } finally {
      setIsLoading(false);
      }
  };

  const handleGoogleSignIn = async () => {
    setFormErrors({});
    setIsLoading(true);
    
    try {
      await signInWithGoogleAuth();
      showToast('Sign-in successful!', 'success');
    } catch (error: any) {
      showToast(error, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormErrors({});
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
  };

  // Combine form errors with auth errors
  const allErrors = { ...formErrors };
  if (authError) {
    allErrors.auth = authError;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >

<Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
        duration={4000}
      />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text variant="displaySmall" style={[styles.title, { color: theme.colors.primary }]}>
               Task Manager
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
                  error={!!allErrors.displayName}
                  placeholder="Enter your display name"
                  style={styles.input}
                />
                {allErrors.displayName && (
                  <Text style={[styles.fieldError, { color: theme.colors.error }]}>
                    {allErrors.displayName}
                  </Text>
                )}
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text variant="bodyMedium" style={[styles.label, { color: theme.colors.onSurface }]}>
                Email
              </Text>
              <CustomInput
                value={email}
                onChangeText={setEmail}
                error={!!allErrors.email}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
              {allErrors.email && (
                <Text style={[styles.fieldError, { color: theme.colors.error }]}>
                  {allErrors.email}
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text variant="bodyMedium" style={[styles.label, { color: theme.colors.onSurface }]}>
                Password
              </Text>
              <CustomInput
                value={password}
                onChangeText={setPassword}
                error={!!allErrors.password}
                placeholder="Enter your password"
                secureTextEntry
                style={styles.input}
              />
              {allErrors.password && (
                <Text style={[styles.fieldError, { color: theme.colors.error }]}>
                  {allErrors.password}
                </Text>
              )}
            </View>

            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text variant="bodyMedium" style={[styles.label, { color: theme.colors.onSurface }]}>
                  Confirm Password
                </Text>
                <CustomInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  error={!!allErrors.confirmPassword}
                  placeholder="Confirm your password"
                  secureTextEntry
                  style={styles.input}
                />
                {allErrors.confirmPassword && (
                  <Text style={[styles.fieldError, { color: theme.colors.error }]}>
                    {allErrors.confirmPassword}
                  </Text>
                )}
              </View>
            )}  

            

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
              contentStyle={styles.buttonContent}
              loading={isLoading}
              disabled={isLoading}
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>

{Platform.OS !== 'ios' && (
<>
            <Divider style={styles.divider} />

            <Button
              mode="outlined"
              onPress={handleGoogleSignIn}
              style={styles.googleButton}
              contentStyle={styles.buttonContent}
              disabled={isLoading}
              icon="google"
            >
              Continue with Google
            </Button>
</>
)}

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
  fieldError: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  errorCard: {
    marginBottom: 16,
    elevation: 2,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 14,
    lineHeight: 20,
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