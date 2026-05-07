"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export default function AdminLayout({ children, pageTitle}: AdminLayoutProps) {
  const [currentTitle, setCurrentTitle] = useState(pageTitle);

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar onNavigate={setCurrentTitle} />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}