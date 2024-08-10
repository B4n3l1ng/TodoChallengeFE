import { notification } from 'antd';
import { createContext, useEffect, useMemo, useReducer, useState } from 'react';

import {
  ChangeTaskState,
  CreateTask,
  DeleteTask,
  EditTask,
  FetchTasks,
  Query,
  reducer,
  SortTasks,
  TaskContextProviderProps,
  TaskContextType,
  TaskState,
} from './taskContextTypes';

notification.config({
  placement: 'bottomLeft',
  bottom: 50,
  duration: 5,
});

export const TaskContext = createContext<TaskContextType | undefined>(
  undefined,
);

const initialState: TaskState = {
  tasks: [],
  isLoading: true,
  needsReload: true,
  error: null,
};

function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [queryState, setQueryState] = useState<Query>({});
  const tasksOrderArray = useMemo(() => ['CREATED_AT', 'A-Z', 'Z-A'], []);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);

  const fetchTasks: FetchTasks = async (query) => {
    let url = `${process.env.REACT_APP_API_URL}/todos`;

    const params = new URLSearchParams();
    if (query.filter) {
      params.append('filter', query.filter);
    }
    if (query.orderBy) {
      params.append(
        'orderBy',
        query.orderBy === 'CREATED_AT' ? query.orderBy : 'DESCRIPTION',
      );
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    dispatch({ type: 'SET_IS_LOADING', payload: true });
    try {
      const response = await fetch(url);

      if (response.status === 200) {
        const { todos } = await response.json();
        if (query.orderBy === 'Z-A') {
          todos.reverse();
        }
        dispatch({ type: 'SET_TASKS', payload: todos });
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ type: 'SET_ERROR', payload: `${error.message}` });
      }
    }
  };

  const createTask: CreateTask = async (payload) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/todos`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-type': 'application/json' },
      });
      if (response.status === 201) {
        dispatch({ type: 'SET_NEEDS_RELOAD', payload: true });
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ type: 'SET_ERROR', payload: `${error.message}` });
      }
    }
  };

  const changeTaskState: ChangeTaskState = async (id, payload) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/todo/${id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' },
        },
      );
      if (response.status === 202) {
        dispatch({ type: 'SET_NEEDS_RELOAD', payload: true });
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ type: 'SET_ERROR', payload: `${error.message}` });
      }
    }
  };

  const editTask: EditTask = async (id, payload) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/todo/${id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' },
        },
      );
      if (response.status === 202) {
        dispatch({ type: 'SET_NEEDS_RELOAD', payload: true });
      }
      if (response.status === 400) {
        const parsed = await response.json();
        dispatch({
          type: 'SET_ERROR',
          payload: parsed.message,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ type: 'SET_ERROR', payload: `${error.message}` });
      }
    }
  };

  const deleteTask: DeleteTask = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/todo/${id}`,
        { method: 'DELETE' },
      );
      if (response.status === 204) {
        dispatch({ type: 'SET_NEEDS_RELOAD', payload: true });
      }
      if (response.status === 404) {
        const parsed = await response.json();
        dispatch({ type: 'SET_ERROR', payload: parsed.message });
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ type: 'SET_ERROR', payload: `${error.message}` });
      }
    }
  };

  useEffect(() => {
    if (state.needsReload) {
      fetchTasks(queryState);
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

  const value = useMemo(() => {
    const sortTasks: SortTasks = () => {
      const newIndex =
        currentOrderIndex === tasksOrderArray.length - 1
          ? 0
          : currentOrderIndex + 1;
      setCurrentOrderIndex(newIndex);
      const newOrder = tasksOrderArray[newIndex] as
        | 'A-Z'
        | 'Z-A'
        | 'CREATED_AT';
      setQueryState({ ...queryState, orderBy: newOrder });
      dispatch({ type: 'SET_NEEDS_RELOAD', payload: true });
    };

    return {
      state,
      fetchTasks,
      createTask,
      changeTaskState,
      editTask,
      deleteTask,
      queryState,
      setQueryState,
      dispatch,
      sortTasks,
    };
  }, [state, queryState, currentOrderIndex, tasksOrderArray, dispatch]);

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export default TaskContextProvider;
