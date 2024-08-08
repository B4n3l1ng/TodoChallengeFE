export interface Task {
  id: string;
  description: string;
  state: 'COMPLETE' | 'INCOMPLETE';
  createdAt: Date;
  completedAt: Date | null;
}

export interface State {
  tasks: Task[];
  isLoading: boolean;
  needsReload: boolean;
}

export interface Query {
  filter?: 'COMPLETE' | 'INCOMPLETE' | 'ALL';
  orderBy?: 'CREATED_AT' | 'COMPLETED_AT' | 'DESCRIPTION';
}

export type TaskAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | { type: 'SET_NEEDS_RELOAD'; payload: boolean };
