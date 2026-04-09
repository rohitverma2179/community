import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { fetchPosts, addPostToFeed, setPostModalOpen } from '../store/post/post.slice';
import { useNavigate } from 'react-router-dom';
import socket from '../utils/socket';
import PostCard from '../component/PostCard';
import Navbar from '../component/Navbar';
import Sidebar from '../component/Sidebar';
import AdsSidebar from '../component/AdsSidebar';
import PostModal from '../component/PostModal';

const Community: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, isPostModalOpen } = useSelector((state: RootState) => state.post);
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchPosts());

    // Socket listeners
    socket.on('newPost', (post) => {
      dispatch(addPostToFeed(post));
    });

    return () => {
      socket.off('newPost');
    };
  }, [dispatch]);

  const handlePostClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(setPostModalOpen(true));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 pt-20 flex gap-6">
        {/* Left Sidebar - Static */}
        <Sidebar />

        {/* Center - Dynamic Feed */}
        <div className="flex-1 max-w-2xl">


          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar - Ads */}
        <AdsSidebar />
      </main>

      <PostModal isOpen={isPostModalOpen} onClose={() => dispatch(setPostModalOpen(false))} />
    </div>
  );
};

export default Community;
