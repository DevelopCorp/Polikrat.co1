"use client"
import { Home, Gavel, TrendingUp, BarChart3, User, Crown, Bell, Settings, LogOut, Trophy, BookOpen } from "lucide-react"
import Image from "next/image"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const mainNavItems = [
  {
    title: "Home Feed",
    url: "/",
    icon: Home,
    badge: "3",
  },
  {
    title: "Debates",
    url: "/debates",
    icon: Gavel,
    badge: "12",
  },
  {
    title: "Prediction Markets",
    url: "/markets",
    icon: TrendingUp,
    badge: "Hot",
  },
  {
    title: "Tournaments",
    url: "/tournaments",
    icon: Trophy,
  },
  {
    title: "Education",
    url: "/education",
    icon: BookOpen,
  },
]

const analyticsItems = [
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
    premium: true,
  },
]

const userItems = [
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Premium",
    url: "/premium",
    icon: Crown,
    highlight: true,
  },
]

export function AppSidebar() {
  return (
    <Sidebar variant="inset" className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Polikrat.co" width={40} height={40} className="rounded-lg" />
          <div>
            <h2 className="text-lg font-bold text-[hsl(var(--neutral-blue))]">Polikrat.co</h2>
            <p className="text-xs text-muted-foreground">Smart Political Discussions</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge className={item.badge === "Hot" ? "bg-red-500 text-white" : ""}>
                      {item.badge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            Analytics
            <Crown className="h-3 w-3 text-[hsl(var(--premium-gold))]" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.premium && <SidebarMenuBadge className="gradient-premium text-white">PRO</SidebarMenuBadge>}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className={`flex items-center gap-3 ${
                        item.highlight ? "text-[hsl(var(--premium-gold))] font-medium" : ""
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
            <Badge variant="destructive" className="ml-auto">
              5
            </Badge>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
