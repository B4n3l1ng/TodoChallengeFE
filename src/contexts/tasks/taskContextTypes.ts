import { ReactNode, Reducer } from 'react';

import { Task } from '../../interfaces/interfaces';

export interface ContextProviderProps {
  children: ReactNode;
}

// Task state interface definition
export interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  needsReload: boolean;
  error: string | null;
}

// task query interface definition
export interface Query {
  filter?: 'COMPLETE' | 'INCOMPLETE' | 'ALL';
  orderBy?: 'CREATED_AT' | 'COMPLETED_AT' | 'Z-A' | 'A-Z';
}

// task reducer definitions
type TaskAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | { type: 'SET_NEEDS_RELOAD'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'EDIT_TASK'; payload: Task };

export const reducer: Reducer<TaskState, TaskAction> = (state, action) => {
  switch (action.type) {
    case 'SET_TASKS':
      // returns the state with the payload as the tasks array, setting loading to false and needsReload to false
      return {
        ...state,
        tasks: action.payload,
        isLoading: false,
        needsReload: false,
      };
    case 'SET_IS_LOADING':
      // change isLoading according to the payload
      return { ...state, isLoading: action.payload };
    case 'SET_NEEDS_RELOAD':
      // change needsRelead according to payload
      return { ...state, needsReload: action.payload };
    case 'SET_ERROR':
      // set the error according to the payload and isLoading to false
      return { ...state, isLoading: false, error: action.payload };
    case 'ADD_TASK':
      // adds the task present in the payload to the tasks array and sets loading to false
      return {
        ...state,
        isLoading: false,
        tasks: [...state.tasks, action.payload],
      };
    case 'DELETE_TASK':
      // filters out the task with the id in the payload
      return {
        ...state,
        isLoading: false,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case 'EDIT_TASK':
      // changes the tasks in the array with the id in the payload
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task,
        ),
      };
    default:
      return state;
  }
};

// task context value function types
export type FetchTasks = (query: Query) => Promise<void>;

export type CreateTask = (payload: { description: string }) => Promise<void>;

export type EditTask = (
  id: string,
  payload: { description?: string; state?: 'COMPLETE' | 'INCOMPLETE' },
) => Promise<void>;

export type DeleteTask = (id: string) => Promise<void>;

export type SortTasks = () => void;

// Task context type
export interface TaskContextType {
  state: TaskState;
  fetchTasks: FetchTasks;
  createTask: CreateTask;
  changeTaskState: EditTask;
  editTask: EditTask;
  queryState: Query;
  setQueryState: React.Dispatch<React.SetStateAction<Query>>;
  dispatch: React.Dispatch<TaskAction>;
  sortTasks: SortTasks;
  deleteTask: DeleteTask;
}
