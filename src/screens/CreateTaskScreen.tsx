import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button, useTheme, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from 'react-native-date-picker';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import CustomInput from '../components/CustomInput';

interface CreateTaskScreenProps {
  navigation: any;
}

const CreateTaskScreen: React.FC<CreateTaskScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (dueDate < new Date()) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setErrors({ auth: 'User not authenticated' });
      return;
    }

    setIsLoading(true);

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        dueDate: Timestamp.fromDate(dueDate),
        priority,
        isCompleted: false,
        userId: currentUser.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await addDoc(collection(db, 'tasks'), taskData);
      console.log('Task created successfully');
      navigation.goBack();
      
    } catch (error: any) {
      console.error('Error creating task:', error);
      setErrors({ firestore: 'Failed to create task. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
              Create New Task
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text variant="bodyMedium" style={[styles.label, { color: theme.colors.onSurface }]}>
                Task Title
              </Text>
              <CustomInput
                value={title}
                onChangeText={setTitle}
                error={!!errors.title}
                placeholder="Enter task title"
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text variant="bodyMedium" style={[styles.label, { color: theme.colors.onSurface }]}>
                Description
              </Text>
              <CustomInput
                value={description}
                onChangeText={setDescription}
                error={!!errors.description}
                placeholder="Enter task description"
                multiline
                numberOfLines={4}
                style={[styles.input, styles.textArea]}
              />
            </View>

            <View style={styles.dateContainer}>
              <Text variant="bodyMedium" style={[styles.label, { color: theme.colors.onSurface }]}>
                Due Date
              </Text>
              <Button
                mode="outlined"
                onPress={() => setShowDatePicker(true)}
                style={styles.dateButton}
                textColor={errors.dueDate ? theme.colors.error : theme.colors.onSurface}
              >
                {formatDate(dueDate)}
              </Button>
              {errors.dueDate && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {errors.dueDate}
                </Text>
              )}
            </View>

            <View style={styles.priorityContainer}>
              <Text variant="bodyMedium" style={[styles.label, { color: theme.colors.onSurface }]}>
                Priority
              </Text>
              <SegmentedButtons
                value={priority}
                onValueChange={setPriority as (value: string) => void}
                buttons={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' }
                ]}
                style={styles.segmentedButtons}
              />
            </View>

            {Object.keys(errors).length > 0 && (
              <View style={styles.errorContainer}>
                {Object.values(errors).map((error, index) => (
                  <Text key={index} style={[styles.errorText, { color: theme.colors.error }]}>
                    {error}
                  </Text>
                ))}
              </View>
            )}

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                style={[styles.button, styles.cancelButton]}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={[styles.button, styles.submitButton]}
                loading={isLoading}
                disabled={isLoading}
              >
                Create Task
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <DatePicker
        modal
        open={showDatePicker}
        date={dueDate}
        mode="datetime"
        onConfirm={(date) => {
          setShowDatePicker(false);
          setDueDate(date);
        }}
        onCancel={() => {
          setShowDatePicker(false);
        }}
        minimumDate={new Date()}
      />
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
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateContainer: {
    marginBottom: 16,
  },
  dateButton: {
    marginTop: 4,
  },
  priorityContainer: {
    marginBottom: 24,
  },
  segmentedButtons: {
    marginTop: 8,
  },
  errorContainer: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
  },
  cancelButton: {
    marginRight: 6,
  },
  submitButton: {
    marginLeft: 6,
  },
});

export default CreateTaskScreen; 