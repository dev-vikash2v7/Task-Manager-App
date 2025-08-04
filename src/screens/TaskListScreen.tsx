import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, FAB, Chip, useTheme, Menu, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut, User as FirebaseUser } from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  Timestamp,
  onSnapshot 
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import TaskCard from '../components/TaskCard';
import { Task } from '../models/Task';

interface TaskListScreenProps {
  navigation: any;
}

const TaskListScreen: React.FC<TaskListScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high' | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<'completed' | 'incomplete' | undefined>(undefined);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    setUser(auth.currentUser);
    if (auth.currentUser) {
      loadTasks();
      // Set up real-time listener
      const unsubscribe = setupRealtimeListener();
      return unsubscribe;
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, selectedPriority, selectedStatus]);

  const setupRealtimeListener = () => {
    if (!auth.currentUser) return () => {};

    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('dueDate', 'asc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const tasksData: Task[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tasksData.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          dueDate: data.dueDate.toDate(),
          priority: data.priority,
          isCompleted: data.isCompleted,
          userId: data.userId,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        });
      });
      setTasks(tasksData);
    }, (error) => {
      console.error('Error listening to tasks:', error);
    });
  };

  const loadTasks = async () => {
    if (!auth.currentUser) return;

    setIsLoading(true);
    try {
      const q = query(
        collection(db, 'tasks'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('dueDate', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      const tasksData: Task[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tasksData.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          dueDate: data.dueDate.toDate(),
          priority: data.priority,
          isCompleted: data.isCompleted,
          userId: data.userId,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        });
      });
      
      setTasks(tasksData);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];
    
    if (selectedPriority) {
      filtered = filtered.filter(task => task.priority === selectedPriority);
    }
    
    if (selectedStatus) {
      filtered = filtered.filter(task => 
        selectedStatus === 'completed' ? task.isCompleted : !task.isCompleted
      );
    }
    
    setFilteredTasks(filtered.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime()));
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleToggleComplete = async (taskId: string, isCompleted: boolean) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        isCompleted,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating task completion:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    navigation.navigate('EditTask', { task });
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      console.log('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleFilterChange = (priority?: 'low' | 'medium' | 'high', status?: 'completed' | 'incomplete') => {
    setSelectedPriority(priority);
    setSelectedStatus(status);
    setFilterMenuVisible(false);
  };

  const clearFilters = () => {
    setSelectedPriority(undefined);
    setSelectedStatus(undefined);
    setFilterMenuVisible(false);
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TaskCard
      task={item}
      onToggleComplete={handleToggleComplete}
      onEdit={handleEditTask}
      onDelete={handleDeleteTask}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text variant="headlineSmall" style={[styles.emptyTitle, { color: theme.colors.onSurfaceVariant }]}>
        No tasks yet
      </Text>
      <Text variant="bodyMedium" style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}>
        Create your first task to get started
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
            My Tasks
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            {user?.displayName || user?.email}
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          <Menu
            visible={filterMenuVisible}
            onDismiss={() => setFilterMenuVisible(false)}
            anchor={
              <Chip
                icon="filter"
                onPress={() => setFilterMenuVisible(true)}
                style={styles.filterChip}
              >
                Filter
              </Chip>
            }
          >
            <Menu.Item
              onPress={() => handleFilterChange(undefined, 'completed')}
              title="Completed"
              leadingIcon="check-circle"
            />
            <Menu.Item
              onPress={() => handleFilterChange(undefined, 'incomplete')}
              title="Incomplete"
              leadingIcon="circle-outline"
            />
            <Divider />
            <Menu.Item
              onPress={() => handleFilterChange('high', selectedStatus)}
              title="High Priority"
              leadingIcon="flag"
            />
            <Menu.Item
              onPress={() => handleFilterChange('medium', selectedStatus)}
              title="Medium Priority"
              leadingIcon="flag"
            />
            <Menu.Item
              onPress={() => handleFilterChange('low', selectedStatus)}
              title="Low Priority"
              leadingIcon="flag"
            />
            <Divider />
            <Menu.Item
              onPress={clearFilters}
              title="Clear Filters"
              leadingIcon="close"
            />
          </Menu>

          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Chip
                icon="account"
                onPress={() => setMenuVisible(true)}
                style={styles.menuChip}
              >
                Menu
              </Chip>
            }
          >
            <Menu.Item
              onPress={handleSignOut}
              title="Sign Out"
              leadingIcon="logout"
            />
          </Menu>
        </View>
      </View>

      {(selectedPriority || selectedStatus) && (
        <View style={styles.activeFilters}>
          {selectedPriority && (
            <Chip
              mode="outlined"
              onClose={() => handleFilterChange(undefined, selectedStatus)}
              style={styles.activeFilterChip}
            >
              {selectedPriority.toUpperCase()} Priority
            </Chip>
          )}
          {selectedStatus && (
            <Chip
              mode="outlined"
              onClose={() => handleFilterChange(selectedPriority, undefined)}
              style={styles.activeFilterChip}
            >
              {selectedStatus === 'completed' ? 'Completed' : 'Incomplete'}
            </Chip>
          )}
        </View>
      )}

      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadTasks}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('CreateTask')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.7,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  menuChip: {
    marginLeft: 8,
  },
  activeFilters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  activeFilterChip: {
    marginRight: 8,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 64,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default TaskListScreen; 