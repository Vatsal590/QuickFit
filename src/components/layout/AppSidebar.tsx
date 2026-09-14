import { Calendar, History, Home, Dumbbell, Scale, UtensilsCrossed, BookOpen, Camera, Zap } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "@/contexts/TranslationContext";

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
  { titleKey: "Home", url: "/home", icon: Home },
  { titleKey: "30 Day Plan", url: "/plans", icon: Calendar },
  { titleKey: "Instant Workout", url: "/instant-workout", icon: Zap },
  { titleKey: "Diet Plan", url: "/diet-plan", icon: UtensilsCrossed },
  { titleKey: "AI Food Tracker", url: "/food-tracker", icon: Camera },
  { titleKey: "Weight Tracker", url: "/weight-tracker", icon: Scale },
  { titleKey: "History", url: "/history", icon: History },
  { titleKey: "Fitness Blogs", url: "/blogs", icon: BookOpen },
];

export function AppSidebar() {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();
  const { t } = useTranslation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path;
  };

  const getNavCls = (isActiveState: boolean) => {
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
          <SidebarGroupLabel>{t('Navigation')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls(isActive(item.url))}
                      onClick={handleNavClick}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{t(item.titleKey)}</span>
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