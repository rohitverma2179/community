import React, { useState } from 'react';
import { MessageSquare, Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { addComment, likeComment } from '../store/comment/comment.slice';
import { useNavigate } from 'react-router-dom';

interface CommentItemProps {
  comment: any;
  postId: string;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, postId }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);

  const isLiked = user && comment.likes?.includes(user._id);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!replyText.trim()) return;

    await dispatch(addComment({
      content: replyText,
      postId,
      parentCommentId: comment._id
    }));

    setReplyText('');
    setShowReplyInput(false);
  };

  const handleLikeComment = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(likeComment(comment._id));
  };

  return (
    <div className="group">
      <div className="flex gap-4">
        <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center text-xs font-bold ring-2 ring-[#333]">
          {comment.user?.name?.[0] || '?'}
        </div>
        <div className="flex-1">
          <div className="bg-[#2a2a2a] p-3 rounded-2xl rounded-tl-none border border-[#333] transition-colors group-hover:border-[#444]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-300">{comment.user?.name || 'Unknown User'}</span>
              <span className="text-[10px] text-gray-500">{new Date(comment.createdAt).toLocaleTimeString()}</span>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">{comment.content}</p>
          </div>

          {/* Comment Actions */}
          <div className="flex items-center gap-4 mt-2 ml-1">
            <button 
              onClick={handleLikeComment}
              className={`flex items-center gap-1.5 text-xs transition-colors font-semibold ${isLiked ? 'text-rose-500' : 'text-gray-500 hover:text-blue-500'}`}
            >
              <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
              {comment.likes?.length || 0} Likes
            </button>
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-500 transition-colors font-semibold"
            >
              <MessageSquare size={14} />
              Reply
            </button>
          </div>

          {showReplyInput && (
            <form onSubmit={handleReply} className="mt-3 flex gap-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Replying to ${comment.user?.name}...`}
                className="flex-1 bg-[#222] border border-[#333] rounded-xl px-4 py-2 text-xs outline-none focus:border-blue-500 transition-all"
                autoFocus
              />
              <button className="bg-blue-600 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-500 transition-colors">Post</button>
            </form>
          )}

          {/* Nested Replies */}
          {comment.repliesData && comment.repliesData.length > 0 && (
            <div className="mt-4 space-y-4 border-l-2 border-[#2a2a2a]/50 pl-6 ml-1">
              {comment.repliesData.map((reply: any) => (
                <div key={reply._id} className="relative">
                  <div className="absolute -left-6 top-6 w-4 h-0.5 bg-[#2a2a2a]/50"></div>
                  <CommentItem comment={reply} postId={postId} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default CommentItem;
