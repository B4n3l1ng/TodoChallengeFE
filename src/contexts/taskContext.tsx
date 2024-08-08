import { notification } from 'antd';
import {
  createContext,
  ReactNode,
  Reducer,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';

import { Query, TaskAction, TaskState } from '../interfaces/interfaces';

type ChangeTaskState = (
  id: string,
  payload: { state: 'COMPLETE' | 'INCOMPLETE' },
) => Promise<void>;

interface TaskContextProviderProps {
  children: ReactNode;
}

interface TaskContextType {
  state: TaskState;
  fetchTasks: (query: Query) => Promise<void>;
  createTask: (payload: { description: string }) => Promise<void>;
  changeTaskState: ChangeTaskState;
  editTask: (
    id: string,
    payload: { description?: string; state?: 'COMPLETE' | 'INCOMPLETE' },
  ) => Promise<void>;
  queryState: Query;
  setQueryState: React.Dispatch<React.SetStateAction<Query>>;
  dispatch: React.Dispatch<TaskAction>;
  sortTasks: () => void;
}

notification.config({
  placement: 'bottomLeft',
  bottom: 50,
  duration: 5,
});

export const TaskContext = createContext<TaskContextType | undefined>(
  undefined,
);

const reducer: Reducer<TaskState, TaskAction> = (state, action) => {
  switch (action.type) {
    case 'SET_TASKS':
      return {
        tasks: action.payload,
        isLoading: false,
        needsReload: false,
        error: null,
      };
    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_NEEDS_RELOAD':
      return { ...state, needsReload: action.payload };
    case 'SET_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};
const initialState: TaskState = {
  tasks: [],
  isLoading: true,
  needsReload: true,
  error: null,
};

function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [queryState, setQueryState] = useState<Query>({});
  const tasksOrderArray = ['CREATED_AT', 'A-Z', 'Z-A'];
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);

  const fetchTasks = async (query: Query) => {
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

  const createTask = async (payload: { description: string }) => {
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

  const editTask = async (
    id: string,
    payload: { description?: string; state?: 'COMPLETE' | 'INCOMPLETE' },
  ) => {
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
        dispatch({
          type: 'SET_ERROR',
          payload: "Can't change the description of a completed task.",
        });
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
        className: 'custom-notification', // Add a custom class name
        icon: <i className="custom-icon">X</i>, // Example custom icon
      });
    }
  }, [state.error]);

  const value = useMemo(
    () => ({
      state,
      fetchTasks,
      createTask,
      changeTaskState,
      queryState,
      setQueryState,
      dispatch,
      sortTasks: () => {
        const newIndex =
          currentOrderIndex === tasksOrderArray.length - 1
            ? 0
            : currentOrderIndex + 1;
        setCurrentOrderIndex(
          currentOrderIndex === tasksOrderArray.length - 1
            ? 0
            : currentOrderIndex + 1,
        );
        const newOrder = tasksOrderArray[newIndex] as
          | 'A-Z'
          | 'Z-A'
          | 'CREATED_AT';
        setQueryState({ ...queryState, orderBy: newOrder });
        dispatch({ type: 'SET_NEEDS_RELOAD', payload: true });
      },
      editTask,
    }),
    [state, queryState],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export default TaskContextProvider;
