import {
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';

import { Query, State, TaskAction } from '../interfaces/interfaces';

interface TaskContextProviderProps {
  children: ReactNode;
}

export interface TaskContextType {
  state: State;
  fetchTasks: (query: Query) => Promise<void>;
  createTask: (payload: { description: string }) => Promise<void>;
  setQueryState: React.Dispatch<React.SetStateAction<Query>>;
  dispatch: React.Dispatch<TaskAction>;
}

export const TaskContext = createContext<TaskContextType | undefined>(
  undefined,
);

function reducer(state: State, action: TaskAction) {
  switch (action.type) {
    case 'SET_TASKS':
      return { tasks: action.payload, isLoading: false, needsReload: false };
    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_NEEDS_RELOAD':
      return { ...state, needsReload: action.payload };
    default:
      return state;
  }
}
const initialState: State = {
  tasks: [],
  isLoading: true,
  needsReload: true,
};

function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [queryState, setQueryState] = useState<Query>({});

  const fetchTasks = async (query: Query) => {
    let url = `${process.env.REACT_APP_API_URL}/todos`;

    const params = new URLSearchParams();
    if (query.filter) {
      params.append('filter', query.filter);
    }
    if (query.orderBy) {
      params.append('orderBy', query.orderBy);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    dispatch({ type: 'SET_IS_LOADING', payload: true });
    try {
      const response = await fetch(url);

      if (response.status === 200) {
        const parsedResponse = await response.json();
        dispatch({ type: 'SET_TASKS', payload: parsedResponse.todos });
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: 'SET_IS_LOADING', payload: false });
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
      console.error(error);
    }
  };

  useEffect(() => {
    if (state.needsReload) {
      fetchTasks(queryState);
    }
  }, [state.needsReload]);

  const value = useMemo(
    () => ({
      state,
      fetchTasks,
      createTask,
      setQueryState,
      dispatch,
    }),
    [state],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export default TaskContextProvider;
