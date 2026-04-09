import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { Search, User as UserIcon, Home, Flame, Newspaper, Briefcase, Plus, SignalLow } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { setPostModalOpen } from '../store/post/post.slice';

import { AnimatePresence, motion } from 'framer-motion';
import { logoutUser } from '../store/user/user.thunk';

const Navbar: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = React.useState(false);

  const handlePostClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(setPostModalOpen(true));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#161616] border-b border-[#222] z-50 flex items-center">
      <div className="max-w-7xl mx-auto w-full flex items-center px-4">
        {/* Brand/Logo */}
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <SignalLow className="text-white rotate-90" size={24} />
          </div>
        </div>

        {/* Center Navigation */}
        <div className="hidden flex-1 md:flex items-center justify-center gap-1 lg:gap-8 px-4">
          <button className="p-2.5 text-orange-500 bg-[#252525] rounded-xl border-b-2 border-orange-500">
            <Home size={22} />
          </button>
          <button className="p-2.5 text-gray-500 hover:text-white transition-colors">
            <Flame size={22} />
          </button>
          <button className="p-2.5 text-gray-500 hover:text-white transition-colors">
            <Newspaper size={22} />
          </button>
          <button className="p-2.5 text-gray-500 hover:text-white transition-colors">
            <Briefcase size={22} />
          </button>
        </div>

        {/* Right Section: Search & Actions */}
        <div className="flex items-center gap-4 lg:gap-6 flex-[2] md:flex-none justify-end">
          <div className="relative group w-full max-w-[400px]">
            <input
              type="text"
              placeholder="Find any think...."
              className="w-full bg-[#1e1e1e] border-2 border-[#ea580c]/30 focus:border-[#ea580c] rounded-full py-2.5 pl-5 pr-12 outline-none transition-all placeholder:text-gray-600 font-medium text-sm"
            />
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
          </div>

          <button 
            onClick={handlePostClick}
            className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-black px-6 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all whitespace-nowrap hidden sm:flex"
          >
            <span>Post</span>
            <Plus size={20} />
          </button>


          {!user ? (
            <div className="flex items-center gap-3 ml-2">
              <button
                onClick={() => navigate('/login')}
                className="bg-white hover:bg-gray-200 text-black px-8 py-2 rounded-full font-bold text-sm transition-all shadow-lg"
              >
                Login
              </button>
            </div>
          ) : (
            <div
              className="relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div
                onClick={() => navigate('/profile')}
                className="w-10 h-10 rounded-full border-2 border-[#333] cursor-pointer hover:border-blue-500 transition-all overflow-hidden bg-[#222] flex-shrink-0"
              >
                {user?.avatar ? (
                   <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 text-white font-bold">
                    {user?.name?.[0] || <UserIcon size={18} />}
                  </div>
                )}
              </div>

              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-[#1e1e1e] border border-[#333] rounded-2xl shadow-2xl py-2 z-[100]"
                  >
                    <div className="px-4 py-2 border-b border-[#333] mb-1">
                      <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-white truncate">{user.name}</p>
                    </div>
                    
                    <button
                      onClick={() => navigate('/profile')}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-[#252525] transition-all"
                    >
                      <UserIcon size={16} />
                      View Profile
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-500/10 transition-all"
                    >
                      <SignalLow className="rotate-180" size={16} />
                      Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};




export default Navbar;
