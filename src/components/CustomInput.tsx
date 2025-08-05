import React, { useState } from 'react';
import { TextInput, TextInputProps, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTheme, IconButton } from 'react-native-paper';

interface CustomInputProps extends TextInputProps {
  error?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({ 
  style, 
  error, 
  secureTextEntry,
  ...props 
}) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = secureTextEntry !== undefined;
  const shouldShowPassword = isPasswordField ? !showPassword : false;

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: error ? theme.colors.error : theme.colors.outline,
            color: theme.colors.onSurface,
            paddingRight: isPasswordField ? 50 : 12,
          },
          style
        ]}
        placeholderTextColor={theme.colors.onSurfaceVariant}
        secureTextEntry={shouldShowPassword}
        {...props}
      />
      {isPasswordField && (
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword(!showPassword)}
          activeOpacity={0.7}
        >
          <IconButton
            icon={showPassword ? 'eye-off' : 'eye'}
            size={20}
            iconColor={theme.colors.onSurfaceVariant}
            style={styles.iconButton}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  eyeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  iconButton: {
    margin: 0,
  },
});

export default CustomInput; 