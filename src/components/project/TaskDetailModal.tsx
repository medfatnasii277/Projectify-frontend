import { useState } from "react";
import { X, Calendar, User, Flag, MessageCircle, Clock, Plus } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TaskDetailModalProps {
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
  isOpen: boolean;
  onClose: () => void;
}

const mockSubtasks = [
  { id: '1', title: 'Research competitor apps', completed: true },
  { id: '2', title: 'Create user personas', completed: true },
  { id: '3', title: 'Conduct user interviews', completed: true },
  { id: '4', title: 'Analyze user feedback', completed: false },
  { id: '5', title: 'Document insights', completed: false },
];

const mockComments = [
  {
    id: '1',
    author: 'Sarah Johnson',
    avatar: 'SJ',
    content: 'Great progress on the user research! The insights are really valuable.',
    timestamp: '2 hours ago'
  },
  {
    id: '2', 
    author: 'Alex Chen',
    avatar: 'AC',
    content: 'I\'ve finished the competitor analysis. Should we schedule a review meeting?',
    timestamp: '5 hours ago'
  }
];

export function TaskDetailModal({ task, isOpen, onClose }: TaskDetailModalProps) {
  const [newComment, setNewComment] = useState('');
  const [newSubtask, setNewSubtask] = useState('');

  const priorityColors = {
    low: 'text-secondary border-secondary/20 bg-secondary/10',
    medium: 'text-accent border-accent/20 bg-accent/10', 
    high: 'text-destructive border-destructive/20 bg-destructive/10'
  };

  const completionPercentage = (task.subtasksCompleted / task.subtasksTotal) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-foreground pr-8">
            {task.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Description</h3>
              <Textarea
                defaultValue={task.description}
                className="min-h-[100px] resize-none"
                placeholder="Add task description..."
              />
            </div>

            {/* Subtasks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  Subtasks ({task.subtasksCompleted}/{task.subtasksTotal})
                </h3>
                <Progress value={completionPercentage} className="w-24 h-2" />
              </div>
              
              <div className="space-y-3">
                {mockSubtasks.map((subtask) => (
                  <Card key={subtask.id} className="p-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        className="w-4 h-4 rounded border-border"
                        onChange={() => {}}
                      />
                      <span className={cn(
                        "flex-1 text-sm",
                        subtask.completed ? "line-through text-muted-foreground" : "text-foreground"
                      )}>
                        {subtask.title}
                      </span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
                
                {/* Add Subtask */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new subtask..."
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="sm" className="btn-secondary">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">
                Comments ({mockComments.length})
              </h3>
              
              <div className="space-y-4">
                {mockComments.map((comment) => (
                  <Card key={comment.id} className="p-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-sm font-medium text-white">
                        {comment.avatar}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            {comment.author}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {comment.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
                
                {/* Add Comment */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="sm" className="btn-hero">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Priority */}
            <Card className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Status
                </label>
                <Select defaultValue={task.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Priority
                </label>
                <Select defaultValue={task.priority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Task Info */}
            <Card className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Due Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(task.dueDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long', 
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Assignee</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-xs font-medium text-white">
                      {task.assignee.avatar}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {task.assignee.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Flag className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Priority</p>
                  <Badge 
                    variant="secondary" 
                    className={cn("text-xs mt-1", priorityColors[task.priority])}
                  >
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Activity Log */}
            <Card className="p-4">
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Activity
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-1.5" />
                  <p className="text-muted-foreground">
                    <span className="text-foreground">Sarah Johnson</span> completed 3 subtasks
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-1.5" />
                  <p className="text-muted-foreground">
                    <span className="text-foreground">Alex Chen</span> added a comment
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full mt-1.5" />
                  <p className="text-muted-foreground">
                    Task priority changed to <span className="text-foreground">High</span>
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}