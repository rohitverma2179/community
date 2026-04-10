import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import AdsSidebar from './AdsSidebar';
import PostModal from './PostModal';
import { useDispatch, useSelector } from 'react-redux';
import { setPostModalOpen } from '../store/post/post.slice';
import type { RootState, AppDispatch } from '../store/store';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isPostModalOpen } = useSelector((state: RootState) => state.post);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-4 pt-20 flex gap-6">
        {/* Left Sidebar - Navigation */}
        <Sidebar />

        {/* Center - Dynamic Content */}
        <div className="flex-1 min-w-0 max-w-2xl mx-auto lg:mx-0">
          {children}
        </div>

        {/* Right Sidebar - Ads */}
        <AdsSidebar />
      </main>

      <PostModal isOpen={isPostModalOpen} onClose={() => dispatch(setPostModalOpen(false))} />
    </div>
  );
};

export default MainLayout;
