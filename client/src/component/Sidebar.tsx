import React from 'react';
import { Globe, Star, Home, ChevronDown, ChevronRight, FileText, Image, FileSpreadsheet } from 'lucide-react';

const Sidebar: React.FC = () => {
  const domains = [
    'Environment, Health & Safety (EHS) Solution',
    'Managements Systems & Compliance',
    'Training & Competency Development',
    'Software & Digital Solution',
    'EGS and Sustainability Services',
    'Quality & Business Excellence'
  ];
  const resources = ['Documentation', 'Course Material', 'Asset Library', 'Video Tutorials'];

  return (
    <aside className="w-64 hidden lg:flex flex-col gap-4 sticky top-20 h-fit">
      <div className="bg-[#262626] p-4 rounded-[20px] border border-[#333] shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/10 p-1.5 rounded-lg">
            <Globe size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Domains</h3>
        </div>
        
        <div className="space-y-3">
          {domains.map((item, index) => (
            <button key={item} className="w-full text-left flex gap-2 group transition-all duration-300">
              <span className="text-gray-500 font-bold text-xs mt-0.5">{index + 1}.</span>
              <span className="text-gray-400 group-hover:text-white text-xs font-medium leading-tight transition-colors">
                {item}
              </span>
            </button>
          ))}
        </div>
      </div>


      <div className="bg-[#1e1e1e] p-4 rounded-[20px] border border-[#333] shadow-xl">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-md font-bold text-gray-400">Resources</h3>
          <ChevronDown size={16} className="text-gray-500" />
        </div>
        
        <div className="space-y-3">
          {[
            { name: 'PDF', icon: <FileText size={20} />, color: 'text-rose-500', bg: 'bg-rose-500/10' },
            { name: 'Documents', icon: <FileText size={20} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { name: 'jpeg', icon: <Image size={20} />, color: 'text-pink-500', bg: 'bg-pink-500/10' },
            { name: 'Excel', icon: <FileSpreadsheet size={20} />, color: 'text-green-500', bg: 'bg-green-500/10' },
          ].map((item) => (
            <button key={item.name} className="w-full flex items-center justify-between group py-0.5 hover:translate-x-1 transition-all">
              <div className="flex items-center gap-3">
                <div className={`${item.bg} p-2 rounded-lg border border-white/5 ${item.color}`}>
                  {item.icon}
                </div>
                <span className="text-white font-bold text-md">{item.name}</span>
              </div>
              <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </aside>

  );
};


export default Sidebar;
