import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { fetchUserPosts } from '../store/post/post.slice';
import PostCard from '../component/PostCard';
import Navbar from '../component/Navbar';
import { User, Mail, Calendar, Settings } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { userPosts, loading } = useSelector((state: RootState) => state.post);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserPosts(user._id));
    }
  }, [user, dispatch]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <p className="text-xl font-bold">Please login to view your profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 pt-24">
        {/* Profile Card */}
        <div className="bg-[#1a1a1a] rounded-3xl border border-[#333] p-8 mb-10 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20"></div>

          <div className="relative flex flex-col md:flex-row items-center md:items-end gap-8">
            <div className="w-32 h-32 rounded-3xl bg-blue-600 flex items-center justify-center text-4xl font-bold shadow-2xl ring-4 ring-[#1a1a1a]">
              {user.name?.[0]}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-extrabold mb-2">{user.name}</h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-400 text-sm">
                <span className="flex items-center gap-1"><Mail size={16} /> {user.email}</span>
                <span className="flex items-center gap-1"><Calendar size={16} /> Joined April 2026</span>
              </div>
            </div>

            <button className="bg-[#2a2a2a] hover:bg-[#333] px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
              <Settings size={18} /> Edit Profile
            </button>
          </div>
        </div>

        {/* User Posts Section */}
        <div>
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
            Your Posts
            <span className="bg-blue-600/20 text-blue-500 px-3 py-1 rounded-full text-xs font-bold">{userPosts.length}</span>
          </h3>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {userPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
              {userPosts.length === 0 && (
                <div className="bg-[#1a1a1a] border border-[#333] border-dashed rounded-2xl py-20 text-center text-gray-500 italic">
                  You haven't posted anything yet.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
