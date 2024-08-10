import { ReactNode, Reducer } from 'react';

import { Task } from '../../interfaces/interfaces';

export interface TaskContextProviderProps {
  children: ReactNode;
}

export interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  needsReload: boolean;
  error: string | null;
}

export interface Query {
  filter?: 'COMPLETE' | 'INCOMPLETE' | 'ALL';
  orderBy?: 'CREATED_AT' | 'COMPLETED_AT' | 'Z-A' | 'A-Z';
}

export type TaskAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | { type: 'SET_NEEDS_RELOAD'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

export const reducer: Reducer<TaskState, TaskAction> = (state, action) => {
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
export type FetchTasks = (query: Query) => Promise<void>;

export type CreateTask = (payload: { description: string }) => Promise<void>;

export type ChangeTaskState = (
  id: string,
  payload: { state: 'COMPLETE' | 'INCOMPLETE' },
) => Promise<void>;

export type EditTask = (
  id: string,
  payload: { description?: string; state?: 'COMPLETE' | 'INCOMPLETE' },
) => Promise<void>;

export type DeleteTask = (id: string) => Promise<void>;

export type SortTasks = () => void;

export interface TaskContextType {
  state: TaskState;
  fetchTasks: FetchTasks;
  createTask: CreateTask;
  changeTaskState: ChangeTaskState;
  editTask: EditTask;
  queryState: Query;
  setQueryState: React.Dispatch<React.SetStateAction<Query>>;
  dispatch: React.Dispatch<TaskAction>;
  sortTasks: SortTasks;
  deleteTask: DeleteTask;
}
