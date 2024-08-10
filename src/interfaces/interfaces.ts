export interface Task {
  id: string;
  description: string;
  state: 'COMPLETE' | 'INCOMPLETE';
  createdAt: Date;
  completedAt: Date | null;
}
