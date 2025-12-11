import { Calendar, History, Home, Dumbbell, Scale, UtensilsCrossed, Gift, BookOpen, Camera, Zap, Heart, Sparkles } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

const mainItems = [
  { title: "Home", url: "/home", icon: Home },
  { title: "30 Day Plan", url: "/plans", icon: Calendar },
  { title: "Instant Workout", url: "/instant-workout", icon: Zap },
  { title: "Diet Plan", url: "/diet-plan", icon: UtensilsCrossed },
  { title: "AI Food Tracker", url: "/food-tracker", icon: Camera },
  { title: "Weight Tracker", url: "/weight-tracker", icon: Scale },
  { title: "History", url: "/history", icon: History },
  { title: "Free Access", url: "/free-access", icon: Gift, highlight: true },
  { title: "Fitness Blogs", url: "/blogs", icon: BookOpen },
  { title: "Support", url: "/support", icon: Heart },
];

export function AppSidebar() {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path;
  };

  const getNavCls = (isActiveState: boolean, isHighlight?: boolean) => {
    if (isHighlight && !isActiveState) {
      return "bg-gradient-to-r from-primary/20 to-amber-500/20 hover:from-primary/30 hover:to-amber-500/30 border border-primary/30 text-primary font-medium";
    }
    return isActiveState ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";
  };

  const handleNavClick = () => {
    setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon" className="bg-sidebar border-r border-sidebar-border">
      <SidebarContent>
        <div className="hidden md:block h-16" />
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
                      className={`${getNavCls(isActive(item.url), item.highlight)} ${item.highlight ? 'relative' : ''}`}
                      onClick={handleNavClick}
                    >
                      <item.icon className={`mr-2 h-4 w-4 ${item.highlight ? 'text-amber-500' : ''}`} />
                      <span className="flex items-center gap-2">
                        {item.title}
                        {item.highlight && (
                          <Badge variant="secondary" className="bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] px-1.5 py-0 animate-pulse border-amber-500/30">
                            <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                            HOT
                          </Badge>
                        )}
                      </span>
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