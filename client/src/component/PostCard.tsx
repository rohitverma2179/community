import React from 'react';
import { MessageSquare, Heart, Share2, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { likePost } from '../store/post/post.slice';
import type { RootState, AppDispatch } from '../store/store';

interface PostCardProps {
  post: any;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  
  const isLiked = user && post.likes?.includes(user._id);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(likePost(post._id));
  };

  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-[#333] overflow-hidden hover:border-[#444] transition-all group">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
            {post.user?.name?.[0] || 'U'}
          </div>
          <div>
            <h4 className="text-sm font-bold hover:underline cursor-pointer">
              {post.user?.name || 'Unknown User'}
            </h4>
            <p className="text-[11px] text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-white transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        <p className="text-[15px] leading-relaxed mb-4 text-gray-200">{post.content}</p>

        {post.images && post.images.length > 0 && (
          <div className="rounded-xl overflow-hidden border border-[#333]">
            <img src={post.images[0]} alt="Post" className="w-full h-auto object-cover max-h-[500px]" />
          </div>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="px-4 py-3 flex items-center gap-6 border-t border-[#333]">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-2 transition-colors text-sm font-medium ${isLiked ? 'text-rose-500' : 'text-gray-400 hover:text-blue-500'}`}
        >
          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
          <span>{post.likes?.length || 0}</span>
        </button>
        <button
          onClick={() => navigate(`/post/${post._id}`)}
          className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors text-sm font-medium"
        >
          <MessageSquare size={18} />
          <span>{post.commentsCount || 0} Comments</span>
        </button>
        <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors text-sm font-medium">
          <Share2 size={18} />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};


export default PostCard;
