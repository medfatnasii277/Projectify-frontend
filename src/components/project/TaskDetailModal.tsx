import { useState } from "react";
import { useEffect } from "react";
import { X, Calendar, User, Flag, MessageCircle, Clock, Plus } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
    projectId: string;
    mainTaskIndex: number;
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'not-started' | 'in-progress' | 'completed';
    dueDate?: string;
    assignee?: {
      name: string;
      avatar: string;
    };
    subtasks?: any[];
    comments?: any[];
    subtasksCompleted?: number;
    subtasksTotal?: number;
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
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status || 'not-started');
  const [priority, setPriority] = useState(task.priority || 'medium');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [subtasks, setSubtasks] = useState<any[]>(task.subtasks || []);
  const [comments, setComments] = useState<any[]>(task.comments || []);
  const [newComment, setNewComment] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [loadingSubtasks, setLoadingSubtasks] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [subtaskError, setSubtaskError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [subtaskToDelete, setSubtaskToDelete] = useState<number | null>(null);

  useEffect(() => {
    setDescription(task.description || '');
    setStatus(task.status || 'not-started');
    setPriority(task.priority || 'medium');
    const normalizedSubtasks = (task.subtasks || []).map((sub: any) =>
      typeof sub === 'string'
        ? { name: sub, description: '', status: 'not-started', priority: 'medium' }
        : sub
    );
    setSubtasks(normalizedSubtasks);
    setComments(task.comments || []);
    fetchComments();
    // eslint-disable-next-line
  }, [task]);

  // Fetch subtasks from backend
  const fetchSubtasks = async () => {
    setLoadingSubtasks(true);
    setSubtaskError('');
    try {
      // Subtasks are part of the project fetch, so just use task.subtasks
      setSubtasks(task.subtasks || []);
    } catch (err: any) {
      setSubtaskError('Failed to load subtasks');
    }
    setLoadingSubtasks(false);
  };

  // Fetch comments from backend
  const fetchComments = async () => {
    setLoadingComments(true);
    setCommentError('');
    try {
      const res = await fetch(`/api/projects/${task.projectId}/mainTasks/${task.mainTaskIndex}/comments`);
      if (!res.ok) throw new Error('Failed to fetch comments');
      const data = await res.json();
      setComments(data);
    } catch (err: any) {
      setCommentError('Failed to load comments');
    }
    setLoadingComments(false);
  };

  const priorityColors = {
    low: 'text-secondary border-secondary/20 bg-secondary/10',
    medium: 'text-accent border-accent/20 bg-accent/10', 
    high: 'text-destructive border-destructive/20 bg-destructive/10'
  };

  const completionPercentage = (task.subtasksCompleted / task.subtasksTotal) * 100;

  // Save handler
  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const res = await fetch(`/api/projects/${task.projectId}/mainTasks/${task.mainTaskIndex}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: task.name,
          description,
          status,
          priority,
        }),
      });
      if (!res.ok) throw new Error('Failed to save changes');
      setSaving(false);
      onClose();
    } catch (err: any) {
      setSaveError(err.message || 'Error saving changes');
      setSaving(false);
    }
  };

  // Add subtask
  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;
    setSubtaskError('');
    try {
      const res = await fetch(`/api/projects/${task.projectId}/mainTasks/${task.mainTaskIndex}/subtasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSubtask }),
      });
      if (!res.ok) throw new Error('Failed to add subtask');
      const data = await res.json();
      setSubtasks(data);
      setNewSubtask('');
    } catch (err: any) {
      setSubtaskError('Failed to add subtask');
    }
  };

  // Remove subtask
  const handleRemoveSubtask = async (subtaskIdx: number) => {
    setSubtaskError('');
    try {
      const res = await fetch(`/api/projects/${task.projectId}/mainTasks/${task.mainTaskIndex}/subtasks/${subtaskIdx}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove subtask');
      const data = await res.json();
      setSubtasks(data);
    } catch (err: any) {
      setSubtaskError('Failed to remove subtask');
    }
  };

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setCommentError('');
    try {
      const res = await fetch(`/api/projects/${task.projectId}/mainTasks/${task.mainTaskIndex}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: 'User', content: newComment }),
      });
      if (!res.ok) throw new Error('Failed to add comment');
      const data = await res.json();
      setComments(data);
      setNewComment('');
    } catch (err: any) {
      setCommentError('Failed to add comment');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-foreground pr-8">
            {task.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Description</h3>
              <Textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="min-h-[100px] resize-none"
                placeholder="Add task description..."
              />
            </div>

            {/* Subtasks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  Subtasks ({subtasks.length})
                </h3>
              </div>
              {subtaskError && <div className="text-red-500 text-sm">{subtaskError}</div>}
              <div className="space-y-3">
                {subtasks.map((subtask, idx) => (
                  <Card key={idx} className="p-3">
                    <div className="flex items-center gap-3">
                      <span className="flex-1 text-sm text-foreground">
                        {subtask.name}
                      </span>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive">
                            <X className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Subtask</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this subtask? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleRemoveSubtask(idx)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
                  <Button size="sm" className="btn-secondary" onClick={handleAddSubtask}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">
                Comments ({comments.length})
              </h3>
              {commentError && <div className="text-red-500 text-sm">{commentError}</div>}
              <div className="space-y-4">
                {comments.map((comment, idx) => (
                  <Card key={idx} className="p-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-sm font-medium text-white">
                        {comment.author?.slice(0,2).toUpperCase()}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            {comment.author}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {comment.timestamp ? new Date(comment.timestamp).toLocaleString() : ''}
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
                  <Button size="sm" className="btn-hero" onClick={handleAddComment}>
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
                <Select value={status} onValueChange={v => setStatus(v as 'not-started' | 'in-progress' | 'completed')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Priority
                </label>
                <Select value={priority} onValueChange={v => setPriority(v as 'low' | 'medium' | 'high')}>
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
              <Button onClick={handleSave} disabled={saving} className="w-full mt-4">
                {saving ? 'Saving...' : 'Save'}
              </Button>
              {saveError && <div className="text-red-500 text-sm mt-2">{saveError}</div>}
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