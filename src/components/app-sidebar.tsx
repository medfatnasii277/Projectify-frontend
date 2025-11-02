import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  Settings, 
  Plus,
  ChevronRight,
  Users,
  Bell,
  LogOut
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  { title: "Create Project", url: "/create", icon: Plus },
  { title: "Reports", url: "/reports", icon: FileText },
];

const recentProjects = [
  { name: "Mobile App Redesign", id: "1", progress: 75 },
  { name: "Website Migration", id: "2", progress: 45 },
  { name: "Brand Guidelines", id: "3", progress: 90 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0 bg-card">
      <SidebarHeader className="border-b border-border/50">
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold text-white">N</span>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-semibold text-foreground">NexusFlow</h1>
              <p className="text-xs text-muted-foreground">Project Management</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const isActive = currentPath === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                          isActive 
                            ? "bg-primary text-primary-foreground shadow-sm" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <item.icon className="w-4 h-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-3 py-2">
              Recent Projects
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {recentProjects.map((project) => (
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={`/project/${project.id}`}
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="truncate">{project.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {project.progress}%
                        </span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <div className="mt-auto border-t border-border/50 p-3">
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
              </div>
              <Settings className="w-4 h-4 text-muted-foreground" />
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            <Button variant="ghost" size="sm" className="w-full p-2">
              <Users className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full p-2 hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <SidebarRail />
    </Sidebar>
  );
}