import React from 'react';
import { FileText, CheckCircle, Zap, Cpu, BarChart3 } from 'lucide-react';
import { AppView } from '../types';

interface DashboardLayoutProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ currentView, onChangeView, children }) => {
  // Updated navigation items with industry-relevant icons
  const navItems = [
    { id: 'news', label: 'Industry Feed', icon: Zap }, // Represents energy/momentum
    { id: 'drafts', label: 'Post Drafts', icon: FileText },
    { id: 'published', label: 'Analytics', icon: BarChart3 }, // More industrial than a checkmark
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col fixed md:relative z-10 bottom-0 md:bottom-auto h-16 md:h-screen shadow-sm">
        
        {/* Updated Branding: MedPulse -> IndustryPulse */}
        <div className="p-6 border-b border-slate-100 hidden md:flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-900 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
            I
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-slate-900 tracking-tight leading-none">IndustryPulse</span>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">IT & Energy</span>
          </div>
        </div>

        <nav className="flex-1 p-2 md:p-4 flex md:flex-col justify-around md:justify-start gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id as AppView)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all w-full ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-900 shadow-sm border border-indigo-100'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        {/* Status Indicator */}
        <div className="hidden md:block p-4 border-t border-slate-100">
            <div className="bg-slate-50 rounded-lg p-3 flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-slate-600">GCC Market Sync Active</span>
            </div>
        </div>
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