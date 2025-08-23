import { Calendar, History, Home, Dumbbell } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Home", url: "/home", icon: Home },
  { title: "History", url: "/history", icon: History },
];

const workoutItems = [
  { title: "My Plans", url: "/home?section=plans", icon: Calendar },
  { title: "Quick Workout", url: "/home?section=generator", icon: Dumbbell },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const currentSection = searchParams.get('section') || 'generator';

  const isActive = (path: string, section?: string) => {
    if (section) {
      return currentPath === '/home' && currentSection === section;
    }
    return currentPath === path;
  };

  const getNavCls = (isActiveState: boolean) =>
    isActiveState ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";

  return (
    <Sidebar collapsible="icon" className="bg-sidebar border-r border-sidebar-border">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end 
                        className={getNavCls(isActive(item.url))}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Workouts</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {workoutItems.map((item) => {
                  const section = item.url.includes('section=plans') ? 'plans' : 'generator';
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink 
                          to={item.url} 
                          className={getNavCls(isActive('/home', section))}
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}