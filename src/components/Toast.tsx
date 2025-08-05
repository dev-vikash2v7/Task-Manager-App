import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import  {Icon}  from 'react-native-paper';

interface ToastProps {
  visible: boolean;
  message: string;
  type: 'success' | 'error' ;
  onHide: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  visible, 
  message, 
  type, 
  onHide, 
  duration = 3000 
}) => {
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: theme.colors.primaryContainer,
          borderColor: theme.colors.primary,
        };
      case 'error':
        return {
          backgroundColor: theme.colors.errorContainer,
          borderColor: theme.colors.error,
        };
    
    }
  };

  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'account-cancel';
    
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return theme.colors.primary;
      case 'error':
        return theme.colors.error;
     
    }
  };

  if (!visible) return null;


  return (
    <Animated.View
      style={[
        styles.container,
        getToastStyle(),
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Icon 
        source={getIconName() as any} 
        size={24} 
        color={getIconColor()} 
      />
      <Text 
        style={[
          styles.message, 
          { color: theme.colors.onSurface }
        ]}
        numberOfLines={3}
      >
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },

  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    marginLeft:12
  },
});

export default Toast; 