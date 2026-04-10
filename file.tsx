export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'alta' | 'media' | 'bassa';
  dueDate: string;
  completed: boolean;
  createdAt: string;
}

export type FilterStatus = 'tutte' | 'in-corso' | 'completate';
export type FilterPriority = 'tutte' | 'alta' | 'media' | 'bassa';
