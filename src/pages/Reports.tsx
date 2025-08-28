import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Users, Calendar } from "lucide-react";

export default function Reports() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground">
          Comprehensive insights into your project performance and team productivity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 text-center card-interactive">
          <BarChart3 className="w-8 h-8 text-primary mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">
            Project Analytics
          </h3>
          <p className="text-sm text-muted-foreground">
            Detailed performance metrics for all your projects.
          </p>
        </Card>
        
        <Card className="p-6 text-center card-interactive">
          <TrendingUp className="w-8 h-8 text-secondary mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">
            Productivity Trends
          </h3>
          <p className="text-sm text-muted-foreground">
            Track team productivity over time.
          </p>
        </Card>
        
        <Card className="p-6 text-center card-interactive">
          <Users className="w-8 h-8 text-accent mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">
            Team Performance  
          </h3>
          <p className="text-sm text-muted-foreground">
            Individual and team performance insights.
          </p>
        </Card>
        
        <Card className="p-6 text-center card-interactive">
          <Calendar className="w-8 h-8 text-destructive mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">
            Timeline Reports
          </h3>
          <p className="text-sm text-muted-foreground">
            Project timelines and milestone tracking.
          </p>
        </Card>
      </div>

      <Card className="p-8 text-center card-elevated">
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          Coming Soon
        </h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          We're working on comprehensive reporting and analytics features that will give you deep insights 
          into your project performance, team productivity, and workflow optimization.
        </p>
        <Button className="btn-hero">
          Get Notified When Available
        </Button>
      </Card>
    </div>
  );
}