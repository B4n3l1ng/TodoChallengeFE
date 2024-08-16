// generic Task interface
export interface Task {
  id: string;
  description: string;
  state: 'COMPLETE' | 'INCOMPLETE';
  createdAt: Date;
  completedAt: Date | null;
  creatorId: string;
}
