import { create } from 'zustand';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  Timestamp,
  onSnapshot 
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Task } from '../models/Task';

interface TaskState {
  tasks: Task[];
  filteredTasks: Task[];
  isLoading: boolean;
  error: string | null;
  
  // Filters
  selectedPriority: 'low' | 'medium' | 'high' | undefined;
  selectedStatus: 'completed' | 'incomplete' | undefined;
  
  // Actions
  setTasks: (tasks: Task[]) => void;
  setFilteredTasks: (tasks: Task[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedPriority: (priority: 'low' | 'medium' | 'high' | undefined) => void;
  setSelectedStatus: (status: 'completed' | 'incomplete' | undefined) => void;
  
  // Task operations
  loadTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTaskComplete: (taskId: string, isCompleted: boolean) => Promise<void>;
  
  // Filter operations
  applyFilters: () => void;
  clearFilters: () => void;
  
  // Clear error
  clearError: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  filteredTasks: [],
  isLoading: false,
  error: null,
  selectedPriority: undefined,
  selectedStatus: undefined,

  setTasks: (tasks) => set({ tasks }),
  setFilteredTasks: (filteredTasks) => set({ filteredTasks }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSelectedPriority: (selectedPriority) => set({ selectedPriority }),
  setSelectedStatus: (selectedStatus) => set({ selectedStatus }),

  loadTasks: async () => {
    if (!auth.currentUser) return;

    set({ isLoading: true, error: null });
    
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
      
      set({ tasks: tasksData });
      get().applyFilters();
    } catch (error: any) {
      console.error('Error loading tasks:', error);
      set({ error: 'Failed to load tasks' });
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: async (taskData) => {
    if (!auth.currentUser) return;

    set({ isLoading: true, error: null });
    
    try {
      const newTask = {
        ...taskData,
        userId: auth.currentUser.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, 'tasks'), newTask);
      console.log('Task added successfully:', docRef.id);
    } catch (error: any) {
      console.error('Error adding task:', error);
      set({ error: 'Failed to add task' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTask: async (taskId: string, updates: Partial<Task>) => {
    set({ isLoading: true, error: null });
    
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
      console.log('Task updated successfully');
    } catch (error: any) {
      console.error('Error updating task:', error);
      set({ error: 'Failed to update task' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTask: async (taskId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      console.log('Task deleted successfully');
    } catch (error: any) {
      console.error('Error deleting task:', error);
      set({ error: 'Failed to delete task' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  toggleTaskComplete: async (taskId: string, isCompleted: boolean) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        isCompleted,
        updatedAt: Timestamp.now()
      });
    } catch (error: any) {
      console.error('Error updating task completion:', error);
      set({ error: 'Failed to update task completion' });
    }
  },

  applyFilters: () => {
    const { tasks, selectedPriority, selectedStatus } = get();
    let filtered = [...tasks];
    
    if (selectedPriority) {
      filtered = filtered.filter(task => task.priority === selectedPriority);
    }
    
    if (selectedStatus) {
      filtered = filtered.filter(task => 
        selectedStatus === 'completed' ? task.isCompleted : !task.isCompleted
      );
    }
    
    set({ filteredTasks: filtered.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime()) });
  },

  clearFilters: () => {
    set({ selectedPriority: undefined, selectedStatus: undefined });
    get().applyFilters();
  },

  clearError: () => set({ error: null }),
})); 