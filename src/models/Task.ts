export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  userId: string;
}

export interface UpdateTaskRequest {
  id: string;
  title?: string;
  description?: string;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
  isCompleted?: boolean;
} 