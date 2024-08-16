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

// antd notification configuration
notification.config({
  placement: 'bottomLeft',
  bottom: 50,
  duration: 5,
});

// initial state
const initialState: TaskState = {
  tasks: [],
  isLoading: true,
  needsReload: true,
  error: null,
};

// exporting of the TaskContext and it's creation with generic starter functions and values
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
  const [queryState, setQueryState] = useState<Query>({}); // state to save the query
  const tasksOrderArray = useMemo(() => ['CREATED_AT', 'A-Z', 'Z-A'], []); // array with the order for sorting purposes
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0); // state to save the index of the current order in the taskOrderArray
  const navigate = useNavigate();

  const getToken = () => {
    return window.localStorage.getItem('token');
  };

  const apiRequest = async (url: string, options?: RequestInit) => {
    // generic api request function that utilizing getToken to grab it from localStorage and always send it in the headers of the request
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
          // redirect to login page if Unauthorized
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
        // sets the error message to trigger an error notification
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
      return null;
    }
  };

  const handleFetchTasks: FetchTasks = async (query) => {
    // fetchs tasks from the backend, using a query

    // builds a URLSearchParam object, with the info passed in the query argument
    const params = new URLSearchParams();
    if (query.filter) params.append('filter', query.filter);
    if (query.orderBy)
      params.append(
        'orderBy',
        query.orderBy === 'CREATED_AT' ? query.orderBy : 'DESCRIPTION',
      );
    // builds a url for the request, adding the search params
    const url = `${process.env.REACT_APP_API_URL}/todos${params.toString() ? `?${params.toString()}` : ''}`;
    dispatch({ type: 'SET_IS_LOADING', payload: true });
    const result = await apiRequest(url);

    if (result?.todos) {
      // analyzes the order requested and sorts accordingly (only alphabetical)
      const todos =
        query.orderBy === 'Z-A' ? result.todos.reverse() : result.todos;
      // sets the tasks to the state, so it can be read by other components, and triggering the list animation
      dispatch({ type: 'SET_TASKS', payload: todos });
    }
  };

  const handleCreateTask: CreateTask = async (payload) => {
    // send the new task information to the backend
    const url = `${process.env.REACT_APP_API_URL}/todos`;
    const result = await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (result?.newTodo) {
      // adds the new task to the array, triggering the animation
      dispatch({ type: 'ADD_TASK', payload: result.newTodo });
    }
  };

  const handleEditTask: EditTask = async (id, payload) => {
    // sends the updated information of the task with id:id to the backend
    const url = `${process.env.REACT_APP_API_URL}/todo/${id}`;
    const result = await apiRequest(url, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });

    if (result?.updatedTask) {
      // if all went well, change the task in the array
      dispatch({ type: 'EDIT_TASK', payload: { ...result.updatedTask, id } });
    }
  };

  const handleDeleteTask: DeleteTask = async (id) => {
    // sends the id in the params of the request, deleting that task from the database
    const url = `${process.env.REACT_APP_API_URL}/todo/${id}`;
    await apiRequest(url, { method: 'DELETE' });
    // removes the task from the array, triggering the animation
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const handleSortTasks: SortTasks = () => {
    // sorts the tasks according to the next index in the taksOrderArray
    // calculates the next index and saves it in the currentOrderIndex state
    const newIndex = (currentOrderIndex + 1) % tasksOrderArray.length;
    setCurrentOrderIndex(newIndex);

    // change the queryState
    setQueryState({
      ...queryState,
      orderBy: tasksOrderArray[newIndex] as 'A-Z' | 'Z-A' | 'CREATED_AT',
    });
    // triggers a re-fetch of the tasks, according to the query state
    dispatch({ type: 'SET_NEEDS_RELOAD', payload: true });
  };

  useEffect(() => {
    if (state.needsReload) {
      // if it needs a reload, re-fetches all tasks
      handleFetchTasks(queryState);
    }
  }, [state.needsReload, queryState]);

  useEffect(() => {
    // if there's a state.error, trigger a notification
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
    // memoization of the context value
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
