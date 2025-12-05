import React from 'react';
import { LayoutDashboard, FileText, CheckCircle, Activity } from 'lucide-react';
import { AppView } from '../types';

interface DashboardLayoutProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ currentView, onChangeView, children }) => {
  const navItems = [
    { id: 'news', label: 'News Feed', icon: Activity },
    { id: 'drafts', label: 'Drafts', icon: FileText },
    { id: 'published', label: 'Published', icon: CheckCircle },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col fixed md:relative z-10 bottom-0 md:bottom-auto h-16 md:h-screen">
        <div className="p-6 border-b border-slate-100 hidden md:flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
            M
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">MedPulse</span>
        </div>

        <nav className="flex-1 p-2 md:p-4 flex md:flex-col justify-around md:justify-start gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id as AppView)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full ${
                  isActive
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={20} />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-[calc(100vh-64px)] md:h-screen overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;