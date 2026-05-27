"use client";

import { Home, Wand2, FolderOpen, LayoutGrid, Monitor, Package, History, User } from "lucide-react";

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export default function Sidebar({ currentTab, onNavigate }: SidebarProps) {
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "generate", icon: Wand2, label: "Generate" },
    { id: "projects", icon: FolderOpen, label: "Projects" },
    { id: "templates", icon: LayoutGrid, label: "Templates" },
    { id: "simulator", icon: Monitor, label: "Simulator" },
    { id: "marketplace", icon: Package, label: "Marketplace" },
    { id: "history", icon: History, label: "AI History" },
    { id: "account", icon: User, label: "Account" },
  ];

  return (
    <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 p-3 card">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            title={item.label}
            className={`sidebar-icon ${isActive ? "active" : ""}`}
          >
            <Icon className="w-5 h-5" />
          </button>
        );
      })}
    </aside>
  );
}
