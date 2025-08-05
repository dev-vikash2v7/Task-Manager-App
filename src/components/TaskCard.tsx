import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Chip, IconButton, useTheme } from 'react-native-paper';
import { Task } from '../models/Task';
import { formatDateTime, isOverdue, getPriorityColor } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string, isCompleted: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete 
}) => {
  const theme = useTheme();

  const getPriorityThemeColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.colors.error;
      case 'medium':
        return theme.colors.tertiary;
      case 'low':
        return theme.colors.primary;
      default:
        return theme.colors.outline;
    }
  };

  const isTaskOverdue = isOverdue(task.dueDate) && !task.isCompleted;

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text 
              variant="titleMedium" 
              style={[
                styles.title,
                { 
                  textDecorationLine: task.isCompleted ? 'line-through' : 'none',
                  color: task.isCompleted ? theme.colors.onSurfaceVariant : theme.colors.onSurface
                }
              ]}
            >
              {task.title}
            </Text>
            <Chip 
              mode="outlined" 
              textStyle={{ color: getPriorityThemeColor(task.priority) }}
              style={[styles.priorityChip, { borderColor: getPriorityThemeColor(task.priority) }]}
            >
              {task.priority.toUpperCase()}
            </Chip>
          </View>
          <View style={styles.actions}>
            <IconButton
              icon={task.isCompleted ? 'check-circle' : 'circle-outline'}
              iconColor={task.isCompleted ? theme.colors.primary : theme.colors.outline}
              size={24}
              onPress={() => onToggleComplete(task.id, !task.isCompleted)}
            />
            <IconButton
              icon="pencil"
              iconColor={theme.colors.primary}
              size={20}
              onPress={() => onEdit(task)}
            />
            <IconButton
              icon="delete"
              iconColor={theme.colors.error}
              size={20}
              onPress={() => onDelete(task.id)}
            />
          </View>
        </View>
        
        <Text 
          variant="bodyMedium" 
          style={[
            styles.description,
            { 
              color: task.isCompleted ? theme.colors.onSurfaceVariant : theme.colors.onSurface 
            }
          ]}
        >
          {task.description}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.dateContainer}>
            <Text 
              variant="bodySmall" 
              style={[
                styles.date,
                { 
                  color: isTaskOverdue ? theme.colors.error : theme.colors.onSurfaceVariant 
                }
              ]}
            >
              {formatDateTime(task.dueDate)}
            </Text>
            {isTaskOverdue && (
              <Chip 
                mode="flat" 
                textStyle={{ color: theme.colors.onError }}
                style={[styles.overdueChip, { backgroundColor: theme.colors.errorContainer }]}
                compact
              >
                OVERDUE
              </Chip>
            )}
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    marginBottom: 4,
    fontWeight: '600',
  },
  priorityChip: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontWeight: '500',
    flex: 1,
  },
  overdueChip: {
    alignSelf: 'flex-start',
  },
});

export default TaskCard; 