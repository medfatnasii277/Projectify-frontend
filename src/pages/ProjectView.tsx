import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { 
  Share2, 
  Download, 
  Settings, 
  Plus, 
  List, 
  Kanban, 
  Calendar,
  Filter,
  Search,
  ArrowLeft,
  X,
  Edit3,
  Check,
  Clock,
  Target,
  PenTool
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TaskItem } from "@/components/project/TaskItem";
import { DatePicker } from '../components/ui/date-picker';
import { TaskDetailModal } from '@/components/project/TaskDetailModal';
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hero-bg.jpg";

type ViewMode = 'list' | 'board' | 'calendar';

export default function ProjectView() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('pending');
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3000/api/projects/${id}`)
        .then(res => res.json())
        .then(data => {
          setProject(data);
          setEditDescription(data.description || '');
          setEditStatus(data.status || 'pending');
          setDueDate(data.dueDate ? new Date(data.dueDate) : undefined);
        })
        .catch(() => setProject(null));
    }
  }, [id]);

  // Flatten mainTasks to match TaskDetailModal structure
  const tasks = project?.mainTasks?.map((task: any, idx: number) => ({
    id: String(idx),
    projectId: id,
    mainTaskIndex: idx,
    name: task.name || 'Untitled Task',
    description: task.description || '',
    priority: task.priority || 'medium',
    status: task.status || 'not-started',
    dueDate: '', // Placeholder
    assignee: { name: '', avatar: '' }, // Placeholder
    subtasks: task.subtasks || [],
    comments: task.comments || [],
    subtasksCompleted: Array.isArray(task.subtasks) ? task.subtasks.filter((s: any) => s.status === 'completed').length : 0,
    subtasksTotal: Array.isArray(task.subtasks) ? task.subtasks.length : 0,
  })) || [];

  const selectedTask = tasks.find(task => task.id === selectedTaskId);
  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate progress
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  console.log('Progress Debug:', { totalTasks, completedTasks, progressPercentage, projectStatus: project?.status, taskStatuses: tasks.map(t => ({ name: t.name, status: t.status })) });

  // Auto-update project status when progress reaches 100%
  useEffect(() => {
    const updateProjectStatus = async () => {
      if (progressPercentage === 100 && project?.status !== 'completed' && id && totalTasks > 0) {
        console.log('Auto-updating project status to completed');
        try {
          const response = await fetch(`http://localhost:3000/api/projects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'completed' })
          });
          if (response.ok) {
            const updated = await response.json();
            setProject(updated);
            console.log('Project status updated successfully');
          }
        } catch (error) {
          console.error('Failed to update project status:', error);
        }
      }
    };

    updateProjectStatus();
  }, [progressPercentage, project?.status, id, totalTasks]);

  const handleUpdate = async () => {
    if (!id) return;
    const response = await fetch(`http://localhost:3000/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: editDescription, status: editStatus, dueDate: dueDate ? dueDate.toISOString() : null })
    });
    if (response.ok) {
      const updated = await response.json();
      setProject(updated);
      setIsEditing(false);
    }
  };

  const handleTaskUpdate = async () => {
    // Refetch the project data after task updates
    if (!id) return;
    try {
      const response = await fetch(`http://localhost:3000/api/projects/${id}`);
      if (response.ok) {
        const updated = await response.json();
        setProject(updated);
        // Update the due date state as well
        setDueDate(updated.dueDate ? new Date(updated.dueDate) : undefined);
      }
    } catch (error) {
      console.error('Failed to refresh project data:', error);
    }
  };

  const handleTaskDelete = async () => {
    // Refetch the project data after task deletion
    await handleTaskUpdate();
  };

  const handleStartAddTask = () => {
    setIsAddingTask(true);
    setNewTaskName('');
  };

  const handleCancelAddTask = () => {
    setIsAddingTask(false);
    setNewTaskName('');
  };

  const handleAddTask = async () => {
    if (!id || !newTaskName.trim()) return;
    try {
      const response = await fetch(`http://localhost:3000/api/projects/${id}/mainTasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTaskName.trim() })
      });
      if (response.ok) {
        // Refetch the project data after adding task
        const updatedResponse = await fetch(`http://localhost:3000/api/projects/${id}`);
        if (updatedResponse.ok) {
          const updated = await updatedResponse.json();
          setProject(updated);
          setIsAddingTask(false);
          setNewTaskName('');
        }
      }
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Navigation */}
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Project Header */}
      <Card className="p-6 card-elevated">
        <div className="flex flex-col gap-6">
          {/* Title and Actions Row */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 group">
                <h1 className="text-3xl font-semibold text-foreground">
                  {project?.title || 'Untitled Project'}
                </h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="opacity-60 group-hover:opacity-100 transition-all duration-200 h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary rounded-full"
                >
                  <PenTool className="w-4 h-4" />
                </Button>
              </div>
              
              {isEditing ? (
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
                    <textarea
                      value={editDescription}
                      onChange={e => setEditDescription(e.target.value)}
                      className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Project description..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Due Date</label>
                    <DatePicker
                      date={dueDate}
                      onDateChange={setDueDate}
                      placeholder="Select due date"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleUpdate} size="sm" className="gap-2">
                      <Check className="w-4 h-4" />
                      Save Changes
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline" size="sm" className="gap-2">
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-muted-foreground leading-relaxed">
                    {project?.description || 'No description yet.'}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 ml-6">
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </div>
          </div>

          {/* Progress and Due Date Row */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {completedTasks}/{totalTasks} tasks
                  </span>
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-xs ml-2",
                      progressPercentage === 100 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    )}
                  >
                    {progressPercentage === 100 ? 'Completed' : 'In Progress'}
                  </Badge>
                </div>
                <Progress 
                  value={progressPercentage}
                  className="w-64 h-2"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Due:</span>
                <span className="text-sm font-medium text-foreground">
                  {dueDate ? format(dueDate, 'MMM dd, yyyy') : 'No due date'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-background shadow-sm' : ''}
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
            <Button
              variant={viewMode === 'board' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('board')}
              className={viewMode === 'board' ? 'bg-background shadow-sm' : ''}
            >
              <Kanban className="w-4 h-4 mr-2" />
              Board
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('calendar')}
              className={viewMode === 'calendar' ? 'bg-background shadow-sm' : ''}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </Button>
          </div>
          
          <Button variant="ghost" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search tasks..."
              className="pl-10 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button className="btn-hero">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Task List */}
      <Card className="p-6 card-elevated">
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? 'No tasks match your search.' : 'No tasks found.'}
              </p>
            </div>
          ) : (
            filteredTasks.map((task, index) => (
              <div
                key={task.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TaskItem 
                  task={task} 
                  projectId={id || ''}
                  mainTaskIndex={parseInt(task.id)}
                  onSelect={() => setSelectedTaskId(task.id)}
                  onDelete={handleTaskDelete}
                  onUpdate={handleTaskUpdate}
                />
              </div>
            ))
          )}
          
          {/* Add Task Button */}
          {isAddingTask ? (
            <div className="w-full p-4 border-2 border-dashed border-primary/50 rounded-xl bg-primary/5">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter task name..."
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddTask();
                    if (e.key === 'Escape') handleCancelAddTask();
                  }}
                  className="flex-1"
                  autoFocus
                />
                <Button size="sm" onClick={handleAddTask} disabled={!newTaskName.trim()}>
                  <Plus className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancelAddTask}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleStartAddTask}
              className="w-full p-4 border-2 border-dashed border-border hover:border-primary/50 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-200 hover:bg-primary/5"
            >
              <Plus className="w-5 h-5 mx-auto mb-2" />
              Add a new task...
            </button>
          )}
        </div>
      </Card>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={!!selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
}