import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import AuthScreen from '../screens/AuthScreen';
import TaskListScreen from '../screens/TaskListScreen';
import CreateTaskScreen from '../screens/CreateTaskScreen';
import EditTaskScreen from '../screens/EditTaskScreen';
import { Task } from '../models/Task';
import { useAuthStore } from '../stores/authStore';

type RootStackParamList = {
  Auth: undefined;
  TaskList: undefined;
  CreateTask: undefined;
  EditTask: { task: Task };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    console.log('user', user);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return unsubscribe;
  }, [setUser]);

  

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!user ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <Stack.Screen name="TaskList" component={TaskListScreen} />

            
            <Stack.Screen
              name="CreateTask"
              component={CreateTaskScreen}
              options={{
                headerShown: true,
                title: 'Create Task',
                headerBackTitle: 'Back',
              }}
            />
            <Stack.Screen
              name="EditTask"
              component={EditTaskScreen}
              options={{
                headerShown: true,
                title: 'Edit Task',
                headerBackTitle: 'Back',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 