import React, { useState } from 'react';
import { MessageSquare, Share2, MoreHorizontal, ThumbsUp, ThumbsDown } from 'lucide-react';
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
  const [pdfPage, setPdfPage] = useState(1);
  
  const isLiked = user && post.likes?.includes(user._id);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(likePost(post._id));
  };

  const renderMedia = () => {
    if (!post.images || post.images.length === 0) return null;

    const mediaUrl = post.images[0];
    const mediaType = post.mediaType || 'image';

    switch (mediaType) {
      case 'video':
        return (
          <div className="relative group rounded-xl overflow-hidden border border-[#333] bg-black aspect-video">
             <video src={mediaUrl} controls className="w-full h-full object-contain" />
          </div>
        );
      case 'pdf':
        // Generate Cloudinary image preview URLs for pages
        // Format: .../upload/pg_1/v123/file.jpg
        const getPdfPreviewUrl = (pageNumber: number) => {
           return mediaUrl.replace('/upload/', `/upload/pg_${pageNumber}/`).replace('.pdf', '.jpg');
        };

        return (
          <div className=" overflow-hidden ">
             {/* Image-Style Header */}
             <div className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-rose-500 font-bold text-[10px] uppercase tracking-wider mb-1">PDF</span>
                      {/* <h5 className="text-sm font-bold text-gray-200 truncate max-w-[200px] md:max-w-md">
                         {mediaUrl.split('/').pop()}
                      </h5> */}
                   </div>
                   <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setPdfPage(1)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${pdfPage === 1 ? 'bg-[#333] text-white' : 'text-gray-500 hover:text-white'}`}
                      >
                        Page 1
                      </button>
                      <button 
                         onClick={() => setPdfPage(2)}
                         className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${pdfPage === 2 ? 'bg-[#333] text-white' : 'text-gray-500 hover:text-white'}`}
                      >
                        Page 2
                      </button>
                      <a 
                        href={mediaUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-4 py-1.5 bg-[#252526] hover:bg-[#333] text-white rounded-full text-[11px] font-bold transition-all border border-[#333]"
                      >
                        Download
                      </a>
                   </div>
                </div>
                <p className="text-[10px] text-gray-500">Page {pdfPage} preview</p>
             </div>
             
             {/* High-Fidelity Page Preview (Image Transformation) */}
             <div className="bg-white p-2 md:p-6 min-h-[400px] flex items-center justify-center">
                <img 
                  src={getPdfPreviewUrl(pdfPage)} 
                  alt={`PDF Page ${pdfPage}`} 
                  className="w-full h-auto shadow-2xl rounded-sm border border-gray-200"
                  onError={(e) => {
                    // Fallback if transformation fails
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/600x800?text=Page+Not+Found";
                  }}
                />
             </div>
          </div>
        );
      case 'image':
      case 'gif':
      default:
        return (
          <div className="rounded-xl overflow-hidden border border-[#333] bg-[#0a0a0a]">
            <img src={mediaUrl} alt="Post content" className="w-full h-auto object-cover max-h-[1000px] cursor-pointer" onClick={() => navigate(`/post/${post._id}`)} />
          </div>
        );
    }
  };

  return (
    <div className="bg-[#262626] rounded-2xl  overflow-hidden hover:border-[#444] transition-all group shadow-sm">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#3d3d3e] border border-[#333] flex items-center justify-center font-bold text-sm overflow-hidden">
             {post.user?.avatar ? <img src={post.user.avatar} alt="" className="w-full h-full object-cover" /> : post.user?.name?.[0] || 'U'}
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-100 hover:underline cursor-pointer" onClick={() => navigate('/profile')}>
              {post.user?.name || 'Unknown User'}
            </h4>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
               <span>{new Date(post.createdAt).toLocaleDateString()}</span>
               <span>•</span>
               <Share2 size={10} />
               <span>Public</span>
            </div>
          </div>
        </div>
        <button className="text-gray-500 hover:text-white p-2 hover:bg-[#2a2a2a] rounded-full transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="px-0 pb-4">
        <p className="text-[15px] leading-relaxed mb-4 px-4 text-gray-200 whitespace-pre-wrap">{post.content}</p>
        {renderMedia()}
      </div>

      {/* Footer / Actions */}
      <div className="px-4 py-2 flex items-center gap-2 border-t border-[#222]">
        <div className="flex items-center bg-[#252526] rounded-full">
           <button 
             onClick={handleLike}
             className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-bold ${isLiked ? 'text-blue-500' : 'text-gray-400 hover:text-white hover:bg-[#333]'}`}
           >
             <ThumbsUp size={16} fill={isLiked ? 'currentColor' : 'none'} />
             <span>{post.likes?.length || 0}</span>
           </button>
           <div className="w-[1px] h-4 bg-[#333]" />
           <button className="px-3 py-2 text-gray-400 hover:text-white transition-all">
              <ThumbsDown size={16} />
           </button>
        </div>

        <button
          onClick={() => navigate(`/post/${post._id}`)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-400 hover:text-white hover:bg-[#252526] transition-all text-sm font-bold"
        >
          <MessageSquare size={16} />
          <span>{post.commentsCount || 0}</span>
        </button>

        <button className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-400 hover:text-white hover:bg-[#252526] transition-all text-sm font-bold">
          <Share2 size={16} />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
