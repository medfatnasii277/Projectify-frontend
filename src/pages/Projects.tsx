import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/projects')
      .then(res => res.json())
      .then(data => setProjects(Array.isArray(data) ? data : []));
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8 animate-fade-in">
      <h1 className="text-3xl font-semibold mb-6">All Projects</h1>
      <Card className="p-6 card-elevated">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2">Title</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr><td colSpan={2} className="py-8 text-center text-muted-foreground">No projects found.</td></tr>
            ) : (
              projects.map(project => (
                <tr key={project._id}>
                  <td className="py-2">{project.title}</td>
                  <td className="py-2">
                    <Link to={`/project/${project._id}`}>
                      <Button size="sm">View</Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
