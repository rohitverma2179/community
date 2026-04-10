import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { fetchPosts, addPostToFeed } from '../store/post/post.slice';
import socket from '../utils/socket';
import PostCard from '../component/PostCard';
import MainLayout from '../component/MainLayout';

const Community: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading } = useSelector((state: RootState) => state.post);

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

  return (
    <MainLayout>
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
    </MainLayout>
  );
};

export default Community;
