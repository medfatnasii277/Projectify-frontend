import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  X
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { TaskItem } from "@/components/project/TaskItem";
import { TaskDetailModal } from "@/components/project/TaskDetailModal";
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

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3000/api/projects/${id}`)
        .then(res => res.json())
        .then(data => {
          setProject(data);
          setEditDescription(data.description || '');
          setEditStatus(data.status || 'pending');
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

  const handleUpdate = async () => {
    if (!id) return;
    const response = await fetch(`http://localhost:3000/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: editDescription, status: editStatus })
    });
    if (response.ok) {
      const updated = await response.json();
      setProject(updated);
      setIsEditing(false);
    }
  };

  const handleTaskDelete = async () => {
    // Refetch the project data after task deletion
    if (!id) return;
    const response = await fetch(`http://localhost:3000/api/projects/${id}`);
    if (response.ok) {
      const updated = await response.json();
      setProject(updated);
    }
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
      <Card className="p-8 card-elevated">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div>
              <h1 className="text-3xl font-semibold text-foreground mb-2">
                {project?.title || 'Untitled Project'}
              </h1>
              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Project description..."
                  />
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="finished">Finished</option>
                  </select>
                  <button onClick={handleUpdate} className="mt-2 px-4 py-2 bg-primary text-white rounded">Submit</button>
                  <button onClick={() => setIsEditing(false)} className="mt-2 ml-2 px-4 py-2 bg-gray-300 rounded">Cancel</button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-muted-foreground">{project?.description || 'No description yet.'}</p>
                  <span className="inline-block px-3 py-1 rounded bg-gray-200 text-sm">{project?.status || 'pending'}</span>
                  <button onClick={() => setIsEditing(true)} className="ml-4 px-4 py-2 bg-primary text-white rounded">Edit</button>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Progress
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {/* Placeholder for task count */}
                  </span>
                </div>
                <Progress 
                  value={0} // Placeholder
                  className="w-64 h-2"
                />
              </div>
              
              <div className="text-sm">
                <span className="text-muted-foreground">Due:</span>
                <span className="ml-2 text-foreground font-medium">
                  {/* Placeholder for due date */}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
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
        />
      )}
    </div>
  );
}