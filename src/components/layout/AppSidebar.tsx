import { Calendar, History, Home, Dumbbell, Scale, UtensilsCrossed, Copy, Check } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { useReferralData } from "@/hooks/useReferralData";
import { useToast } from "@/hooks/use-toast";

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
  { title: "Weight Tracker", url: "/weight-tracker", icon: Scale },
  { title: "Diet Plan", url: "/diet-plan", icon: UtensilsCrossed },
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
  const { referralCode, referralCount } = useReferralData();
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const isActive = (path: string, section?: string) => {
    if (section) {
      return currentPath === '/home' && currentSection === section;
    }
    return currentPath === path;
  };

  const getNavCls = (isActiveState: boolean) =>
    isActiveState ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";

  const copyReferralCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
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

          <SidebarGroup>
            <SidebarGroupLabel>Free Access</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-3 py-2 space-y-2">
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Your Referral Code</p>
                    <p className="text-lg font-bold tracking-wider">{referralCode || '-----'}</p>
                  </div>
                  <button
                    onClick={copyReferralCode}
                    className="p-2 hover:bg-background rounded-md transition-colors"
                    disabled={!referralCode}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  <p>Referrals: <span className="font-semibold">{referralCount}</span></p>
                  <p className="mt-1">Share your code to earn rewards!</p>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}