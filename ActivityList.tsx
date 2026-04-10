import React from 'react';
import { ActivityItem } from './ActivityItem';
import { Task, FilterType, PriorityFilterType } from '../types';
import { CheckCircle2, Circle, ListTodo } from 'lucide-react';

interface ActivityListProps {
  tasks: Task[];
  filter: FilterType;
  priorityFilter: PriorityFilterType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ActivityList: React.FC<ActivityListProps> = ({
  tasks,
  filter,
  priorityFilter,
  onToggle,
  onDelete,
}) => {
  const filteredTasks = tasks.filter((task) => {
    const statusMatch =
      filter === 'tutte' ||
      (filter === 'completate' && task.completed) ||
      (filter === 'in-corso' && !task.completed);

    const priorityMatch =
      priorityFilter === 'tutte' || task.priority === priorityFilter;

    return statusMatch && priorityMatch;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <ListTodo className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-600 mb-2">
          Nessuna attività
        </h3>
        <p className="text-slate-400">
          Inizia aggiungendo una nuova attività!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-slate-100 rounded-xl">
        <div className="flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-slate-600" />
          <span className="text-sm font-medium text-slate-600">
            Totale: <span className="text-slate-800">{stats.total}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Circle className="w-5 h-5 text-amber-500" />
          <span className="text-sm font-medium text-slate-600">
            In corso: <span className="text-amber-600">{stats.pending}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-teal-500" />
          <span className="text-sm font-medium text-slate-600">
            Completate: <span className="text-teal-600">{stats.completed}</span>
          </span>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-400">
            Nessuna attività corrisponde ai filtri selezionati
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <ActivityItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
