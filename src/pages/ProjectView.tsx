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
  ArrowLeft
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

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/projects/${id}`)
        .then(res => res.json())
        .then(data => setProject(data))
        .catch(() => setProject(null));
    }
  }, [id]);

  // Flatten mainTasks to match previous mockTasks structure
  const tasks = project?.mainTasks?.map((task: any, idx: number) => ({
    id: String(idx),
    title: task.name || 'Untitled Task',
    description: '', // Placeholder
    priority: 'medium', // Placeholder
    status: 'todo', // Placeholder
    dueDate: '', // Placeholder
    assignee: { name: '', avatar: '' }, // Placeholder
    subtasksCompleted: 0, // Placeholder
    subtasksTotal: Array.isArray(task.subtasks) ? task.subtasks.length : 0,
    subtasks: task.subtasks || [],
  })) || [];

  const selectedTask = tasks.find(task => task.id === selectedTaskId);
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <p className="text-muted-foreground">
                {/* Placeholder for description */}
              </p>
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
                  onSelect={() => setSelectedTaskId(task.id)}
                />
              </div>
            ))
          )}
          
          {/* Add Task Button */}
          <button
            className="w-full p-4 border-2 border-dashed border-border hover:border-primary/50 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-200 hover:bg-primary/5"
          >
            <Plus className="w-5 h-5 mx-auto mb-2" />
            Add a new task...
          </button>
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