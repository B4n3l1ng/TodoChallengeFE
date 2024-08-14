import { notification } from 'antd';
import { createContext, useEffect, useMemo, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ContextProviderProps,
  CreateTask,
  DeleteTask,
  EditTask,
  FetchTasks,
  Query,
  reducer,
  SortTasks,
  TaskContextType,
  TaskState,
} from './taskContextTypes';

notification.config({
  placement: 'bottomLeft',
  bottom: 50,
  duration: 5,
});

const initialState: TaskState = {
  tasks: [],
  isLoading: true,
  needsReload: true,
  error: null,
};

export const TaskContext = createContext<TaskContextType>({
  state: initialState,
  fetchTasks: async () => {},
  createTask: async () => {},
  changeTaskState: async () => {},
  editTask: async () => {},
  deleteTask: async () => {},
  queryState: {},
  setQueryState: () => {},
  dispatch: () => {},
  sortTasks: () => {},
});

function TaskContextProvider({ children }: ContextProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [queryState, setQueryState] = useState<Query>({});
  const tasksOrderArray = useMemo(() => ['CREATED_AT', 'A-Z', 'Z-A'], []);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const navigate = useNavigate();

  const getToken = () => {
    return window.localStorage.getItem('token');
  };

  const apiRequest = async (url: string, options?: RequestInit) => {
    const token = getToken();
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        let errorMessage = response.statusText; // Default error message

        try {
          // Attempt to parse JSON error message
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If JSON parsing fails, keep the default error message
        }
        if (response.status === 401) {
          // TODO: Redirect to login
          navigate('/login');
        } else {
          dispatch({ type: 'SET_ERROR', payload: errorMessage });
        }

        return null; // Return null after handling error
      }

      // Check if there's a response body to parse
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        return response.json(); // Parse JSON if content exists
      }

      return null; // Return null if there's no content to parse
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
      return null;
    }
  };

  const handleFetchTasks: FetchTasks = async (query) => {
    const params = new URLSearchParams();
    if (query.filter) params.append('filter', query.filter);
    if (query.orderBy)
      params.append(
        'orderBy',
        query.orderBy === 'CREATED_AT' ? query.orderBy : 'DESCRIPTION',
      );

    const url = `${process.env.REACT_APP_API_URL}/todos${params.toString() ? `?${params.toString()}` : ''}`;
    dispatch({ type: 'SET_IS_LOADING', payload: true });
    const result = await apiRequest(url);

    if (result?.todos) {
      const todos =
        query.orderBy === 'Z-A' ? result.todos.reverse() : result.todos;
      dispatch({ type: 'SET_TASKS', payload: todos });
    }
  };

  const handleCreateTask: CreateTask = async (payload) => {
    const url = `${process.env.REACT_APP_API_URL}/todos`;
    const result = await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (result?.newTodo) {
      dispatch({ type: 'ADD_TASK', payload: result.newTodo });
    }
  };

  const handleEditTask: EditTask = async (id, payload) => {
    const url = `${process.env.REACT_APP_API_URL}/todo/${id}`;
    const result = await apiRequest(url, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });

    if (result?.updatedTask) {
      dispatch({ type: 'EDIT_TASK', payload: { ...result.updatedTask, id } });
    }
  };

  const handleDeleteTask: DeleteTask = async (id) => {
    const url = `${process.env.REACT_APP_API_URL}/todo/${id}`;
    await apiRequest(url, { method: 'DELETE' });
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const handleSortTasks: SortTasks = () => {
    const newIndex = (currentOrderIndex + 1) % tasksOrderArray.length;
    setCurrentOrderIndex(newIndex);
    setQueryState({
      ...queryState,
      orderBy: tasksOrderArray[newIndex] as 'A-Z' | 'Z-A' | 'CREATED_AT',
    });
    dispatch({ type: 'SET_NEEDS_RELOAD', payload: true });
  };

  useEffect(() => {
    if (state.needsReload) {
      handleFetchTasks(queryState);
    }
  }, [state.needsReload, queryState]);

  useEffect(() => {
    if (state.error) {
      notification.error({
        message: 'Error',
        description: state.error,
        duration: 5,
        className: 'custom-notification',
        icon: <div className="custom-icon">X</div>,
      });
      dispatch({ type: 'SET_ERROR', payload: null });
    }
  }, [state.error]);

  const contextValue = useMemo(
    () => ({
      state,
      fetchTasks: handleFetchTasks,
      createTask: handleCreateTask,
      changeTaskState: handleEditTask,
      editTask: handleEditTask,
      deleteTask: handleDeleteTask,
      queryState,
      setQueryState,
      dispatch,
      sortTasks: handleSortTasks,
    }),
    [state, queryState, currentOrderIndex],
  );

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
}

export default TaskContextProvider;
