import { useState } from "react";
import { 
  CheckCircle, 
  Circle, 
  Calendar, 
  MessageCircle, 
  Edit3, 
  Trash2,
  MoreHorizontal
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'in-progress' | 'completed';
    dueDate: string;
    assignee: {
      name: string;
      avatar: string;
    };
    subtasksCompleted: number;
    subtasksTotal: number;
  };
  onSelect: () => void;
}

export function TaskItem({ task, onSelect }: TaskItemProps) {
  const [isCompleted, setIsCompleted] = useState(task.status === 'completed');
  const [isHovered, setIsHovered] = useState(false);

  const priorityColors = {
    low: 'border-l-secondary',
    medium: 'border-l-accent',
    high: 'border-l-destructive'
  };

  const statusColors = {
    todo: 'bg-muted/50 text-muted-foreground',
    'in-progress': 'bg-primary/10 text-primary',
    completed: 'bg-secondary/10 text-secondary'
  };

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCompleted(!isCompleted);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer border-l-4 transition-all duration-200 hover:shadow-md",
        priorityColors[task.priority],
        isCompleted && "opacity-75"
      )}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={handleToggleComplete}
          className="mt-1 transition-colors"
        >
          {isCompleted ? (
            <CheckCircle className="w-5 h-5 text-secondary" />
          ) : (
            <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <h3 className={cn(
              "font-medium text-foreground",
              isCompleted && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
            
            {/* Action Buttons - Show on Hover */}
            <div className={cn(
              "flex items-center gap-1 transition-opacity",
              isHovered ? "opacity-100" : "opacity-0"
            )}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MessageCircle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Edit3 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>

          {/* Meta Information */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Status Badge */}
              <Badge 
                variant="secondary" 
                className={cn("text-xs", statusColors[task.status])}
              >
                {task.status.replace('-', ' ')}
              </Badge>

              {/* Due Date */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(task.dueDate)}</span>
              </div>

              {/* Subtasks Progress */}
              {task.subtasksTotal > 0 && (
                <div className="text-xs text-muted-foreground">
                  {task.subtasksCompleted}/{task.subtasksTotal} subtasks
                </div>
              )}
            </div>

            {/* Assignee Avatar */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-xs font-medium text-white">
                {task.assignee.avatar}
              </div>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {task.assignee.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}