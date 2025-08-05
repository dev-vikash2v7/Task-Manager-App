import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Button, useTheme, SegmentedButtons, Switch } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from 'react-native-date-picker';
import { useTaskStore } from '../stores/taskStore';
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
  const { task } = route.params;
  
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(task.priority);
  const [isCompleted, setIsCompleted] = useState(task.isCompleted);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Zustand task store
  const { updateTask, isLoading, error, clearError } = useTaskStore();

  useEffect(() => {
    // Clear any previous errors when component mounts
    clearError();
  }, []);

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

    try {
      await updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
        dueDate,
        priority,
        isCompleted
      });
      
      console.log('Task updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text variant="bodyMedium" style={[styles.label, { color: theme.colors.onSurface }]}>
                Title
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
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text variant="bodyMedium" style={[styles.label, { color: theme.colors.onSurface }]}>
                Due Date & Time
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

            <View style={styles.inputContainer}>
              <Text variant="bodyMedium" style={[styles.label, { color: theme.colors.onSurface }]}>
                Priority
              </Text>
              <SegmentedButtons
                value={priority}
                onValueChange={setPriority as (value: string) => void}
                buttons={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                ]}
                style={styles.segmentedButtons}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.switchContainer}>
                <Text variant="bodyMedium" style={[styles.label, { color: theme.colors.onSurface }]}>
                  Completed
                </Text>
                <Switch
                  value={isCompleted}
                  onValueChange={setIsCompleted}
                  color={theme.colors.primary}
                />
              </View>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {error}
                </Text>
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
              Update Task
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <DateTimePicker
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
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    marginBottom: 0,
  },
  dateButton: {
    marginTop: 8,
  },
  segmentedButtons: {
    marginTop: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  errorContainer: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
  button: {
    marginTop: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default EditTaskScreen; 