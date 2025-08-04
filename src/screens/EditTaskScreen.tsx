import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button, useTheme, SegmentedButtons, Switch } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from 'react-native-date-picker';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import CustomInput from '../components/CustomInput';
import { Task } from '../models/Task';

interface EditTaskScreenProps {
  navigation: any;
  route: {
    params: {
      task: Task;
    };
  };
}

const EditTaskScreen: React.FC<EditTaskScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const { task: initialTask } = route.params;
  
  const [title, setTitle] = useState(initialTask.title);
  const [description, setDescription] = useState(initialTask.description);
  const [dueDate, setDueDate] = useState(new Date(initialTask.dueDate));
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initialTask.priority);
  const [isCompleted, setIsCompleted] = useState(initialTask.isCompleted);
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
      const taskRef = doc(db, 'tasks', initialTask.id);
      const updateData = {
        title: title.trim(),
        description: description.trim(),
        dueDate: Timestamp.fromDate(dueDate),
        priority,
        isCompleted,
        updatedAt: Timestamp.now()
      };

      await updateDoc(taskRef, updateData);
      console.log('Task updated successfully');
      navigation.goBack();
      
    } catch (error: any) {
      console.error('Error updating task:', error);
      setErrors({ firestore: 'Failed to update task. Please try again.' });
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
              Edit Task
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

            <View style={styles.completedContainer}>
              <Text variant="bodyMedium" style={[styles.label, { color: theme.colors.onSurface }]}>
                Completed
              </Text>
              <Switch
                value={isCompleted}
                onValueChange={setIsCompleted}
                color={theme.colors.primary}
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
                Update Task
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
    marginBottom: 16,
  },
  segmentedButtons: {
    marginTop: 8,
  },
  completedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
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

export default EditTaskScreen; 