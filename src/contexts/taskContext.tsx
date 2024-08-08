import {
  createContext,
  ReactNode,
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
  queryState: Query;
  setQueryState: React.Dispatch<React.SetStateAction<Query>>;
  dispatch: React.Dispatch<TaskAction>;
  sortTasks: () => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(
  undefined,
);

function reducer(state: TaskState, action: TaskAction) {
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
const initialState: TaskState = {
  tasks: [],
  isLoading: true,
  needsReload: true,
};

function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [queryState, setQueryState] = useState<Query>({});
  const tasksOrderArray = ['CREATED_AT', 'A-Z', 'Z-A'];
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);

  const sortTasks = () => {
    const newIndex =
      currentOrderIndex === tasksOrderArray.length - 1
        ? 0
        : currentOrderIndex + 1;
    setCurrentOrderIndex(
      currentOrderIndex === tasksOrderArray.length - 1
        ? 0
        : currentOrderIndex + 1,
    );
    const newOrder = tasksOrderArray[newIndex] as 'A-Z' | 'Z-A' | 'CREATED_AT';
    setQueryState({ ...queryState, orderBy: newOrder });
    dispatch({ type: 'SET_NEEDS_RELOAD', payload: true });
  };

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
      changeTaskState,
      queryState,
      setQueryState,
      dispatch,
      sortTasks,
    }),
    [state],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export default TaskContextProvider;
