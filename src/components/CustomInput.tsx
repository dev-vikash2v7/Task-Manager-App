import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

interface CustomInputProps extends TextInputProps {
  error?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({ 
  style, 
  error, 
  ...props 
}) => {
  const theme = useTheme();

  return (
    <TextInput
      style={[
        styles.input,
        {
          borderColor: error ? theme.colors.error : theme.colors.outline,
          color: theme.colors.onSurface,
        },
        style
      ]}
      placeholderTextColor={theme.colors.onSurfaceVariant}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
});

export default CustomInput; 