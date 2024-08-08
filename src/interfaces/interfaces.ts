export interface Task {
  id: string;
  description: string;
  state: 'COMPLETE' | 'INCOMPLETE';
  createdAt: Date;
  completedAt: Date | null;
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
  | { type: 'SET_ERROR'; payload: string };
