import React from 'react';
import { Button } from './ui/button';
import { Check, Trash2, Clock, AlertCircle } from 'lucide-react';
import { Task } from '../types';

interface ActivityItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  task,
  onToggle,
  onDelete,
}) => {
  const priorityColors = {
    alta: 'border-l-red-500 bg-red-50',
    media: 'border-l-amber-500 bg-amber-50',
    bassa: 'border-l-emerald-500 bg-emerald-50',
  };

  const priorityLabels = {
    alta: 'Alta',
    media: 'Media',
    bassa: 'Bassa',
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div
      className={`border-l-4 ${priorityColors[task.priority]} rounded-lg p-4 transition-all duration-200 ${
        task.completed ? 'opacity-60' : 'hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            task.completed
              ? 'bg-teal-600 border-teal-600 text-white'
              : 'border-slate-300 hover:border-teal-500'
          }`}
        >
          {task.completed && <Check className="w-4 h-4" />}
        </button>

        <div className="flex-1 min-w-0">
          <h4
            className={`font-semibold text-slate-800 ${
              task.completed ? 'line-through text-slate-500' : ''
            }`}
          >
            {task.title}
          </h4>

          {task.description && (
            <p className="text-sm text-slate-600 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                task.priority === 'alta'
                  ? 'bg-red-100 text-red-700'
                  : task.priority === 'media'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {priorityLabels[task.priority]}
            </span>

            {task.dueDate && (
              <span
                className={`text-xs flex items-center gap-1 ${
                  isOverdue ? 'text-red-600 font-medium' : 'text-slate-500'
                }`}
              >
                {isOverdue ? (
                  <AlertCircle className="w-3 h-3" />
                ) : (
                  <Clock className="w-3 h-3" />
                )}
                {new Date(task.dueDate).toLocaleDateString('it-IT')}
              </span>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(task.id)}
          className="text-slate-400 hover:text-red-500 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
