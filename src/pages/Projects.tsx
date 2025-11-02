import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Trash2 } from "lucide-react";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/projects');
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        // Refresh the projects list
        fetchProjects();
      } else {
        console.error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8 animate-fade-in">
      <h1 className="text-3xl font-semibold mb-6">All Projects</h1>
      
      {projects.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No projects found.</p>
        </Card>
      ) : (
        <Card className="card-elevated">
          <div className="divide-y divide-border">
            {projects.map((project, index) => (
              <Link key={project._id} to={`/project/${project._id}`} className="block">
                <div className="p-6 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {project.title || 'Untitled Project'}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{project.mainTasks?.length || 0} tasks</span>
                        <span className="capitalize">{project.status || 'pending'}</span>
                        {project.description && (
                          <span className="truncate max-w-md">{project.description}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Project</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{project.title || 'this project'}"? This action cannot be undone and will delete all tasks and data associated with this project.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteProject(project._id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
