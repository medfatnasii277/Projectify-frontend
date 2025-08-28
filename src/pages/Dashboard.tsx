import { FolderKanban, CheckCircle, Clock, Inbox, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = [
  {
    title: "Active Projects",
    value: 12,
    trend: { value: 8.2, isPositive: true },
    icon: FolderKanban,
  },
  {
    title: "Tasks Due This Week",
    value: 23,
    trend: { value: 12.3, isPositive: false },
    icon: Clock,
  },
  {
    title: "Completed Tasks",
    value: 156,
    trend: { value: 15.7, isPositive: true },
    icon: CheckCircle,
  },
  {
    title: "Inbox",
    value: 8,
    subtitle: "New notifications",
    icon: Inbox,
  },
];

const recentActivity = [
  {
    action: "Created project",
    target: "Mobile App Redesign",
    time: "2 minutes ago",
    type: "create"
  },
  {
    action: "Completed task",
    target: "User Research Analysis",
    time: "1 hour ago",
    type: "complete"
  },
  {
    action: "Updated project",
    target: "Website Migration",
    time: "3 hours ago",
    type: "update"
  },
  {
    action: "Created task",
    target: "Design System Documentation",
    time: "1 day ago",
    type: "create"
  },
  {
    action: "Assigned task",
    target: "API Integration Testing",
    time: "2 days ago",
    type: "assign"
  },
];

export default function Dashboard() {
  const userName = "Sarah";
  const greeting = getGreeting();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          {greeting}, {userName}
        </h1>
        <p className="text-muted-foreground">
          You have {stats[1].value} tasks due this week and {stats[0].value} active projects.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 p-6 card-elevated">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Recent Activity
            </h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'complete' ? 'bg-secondary' :
                  activity.type === 'create' ? 'bg-primary' :
                  activity.type === 'update' ? 'bg-accent' :
                  'bg-muted-foreground'
                }`} />
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="text-muted-foreground">{activity.action}</span>{" "}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 card-elevated">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Quick Actions
          </h2>
          
          <div className="space-y-3">
            <Link to="/create">
              <Button 
                variant="default" 
                className="w-full justify-start gap-3 btn-hero"
              >
                <FolderKanban className="w-4 h-4" />
                Create New Project
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3"
            >
              <CheckCircle className="w-4 h-4" />
              Add Quick Task
            </Button>
            
            <Link to="/reports">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3"
              >
                <TrendingUp className="w-4 h-4" />
                View Reports
              </Button>
            </Link>
          </div>

          <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/20">
            <h3 className="font-medium text-foreground mb-2">
              Pro Tip
            </h3>
            <p className="text-sm text-muted-foreground">
              Upload a PDF to automatically generate a structured project with tasks and subtasks using AI.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}