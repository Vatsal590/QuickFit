import { Calendar, History, Home, Dumbbell, Scale, UtensilsCrossed, Gift, BookOpen, Camera, Zap } from "lucide-react";
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
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Home", url: "/home", icon: Home },
  { title: "30 Day Plan", url: "/plans", icon: Calendar },
  { title: "Instant Workout", url: "/instant-workout", icon: Zap },
  { title: "Diet Plan", url: "/diet-plan", icon: UtensilsCrossed },
  { title: "AI Food Tracker", url: "/food-tracker", icon: Camera },
  { title: "Weight Tracker", url: "/weight-tracker", icon: Scale },
  { title: "History", url: "/history", icon: History },
  { title: "Free Access", url: "/free-access", icon: Gift },
  { title: "Fitness Blogs", url: "/blogs", icon: BookOpen },
];

export function AppSidebar() {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path;
  };

  const getNavCls = (isActiveState: boolean) =>
    isActiveState ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";

  const handleNavClick = () => {
    setOpenMobile(false);
  };

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
                        onClick={handleNavClick}
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
      </SidebarContent>
    </Sidebar>
  );
}
