import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Send, Loader2, AlertCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';
import { createPost } from '../store/post/post.slice';
import { motion, AnimatePresence } from 'framer-motion';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  // Cloudinary Config (Signed Upload using provided credentials)
  const CLOUDINARY_API_KEY = '517894626762537';
  const CLOUDINARY_API_SECRET = 'rXm8MYjTJu1JDrz87vnBeCFsqAE';
  const CLOUDINARY_CLOUD_NAME = 'diwsdon3e';

  // Helper to generate SHA-1 signature for Cloudinary
  const generateSignature = async (timestamp: number) => {
    const stringToSign = `timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const msgBuffer = new TextEncoder().encode(stringToSign);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 700KB limit check
    const maxSizeInBytes = 700 * 1024;
    if (file.size > maxSizeInBytes) {
      setError('File too large (Max 700KB)');
      setTimeout(() => setError(''), 4000);
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const signature = await generateSignature(timestamp);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', CLOUDINARY_API_KEY);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.secure_url) {
        setImageUrl(data.secure_url);
        setError('');
      } else {
        console.error('Cloudinary Error Data:', data);
        setError(data.error?.message || 'Upload failed. Check console.');
      }
    } catch (err) {
      setError('Error uploading image. Please check your internet connection.');
      console.error('Fetch Error:', err);
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again if removed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isUploading) return;

    await dispatch(createPost({ 
      content, 
      images: imageUrl ? [imageUrl] : [] 
    }));
    
    setContent('');
    setImageUrl('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg bg-[#1a1a1a] rounded-3xl border border-[#333] relative z-10 overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-[#333] flex items-center justify-between">
              <h3 className="text-lg font-bold">Create Post</h3>
              <button onClick={onClose} className="p-2 hover:bg-[#2a2a2a] rounded-full transition-colors text-gray-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full bg-transparent border-none outline-none resize-none text-lg min-h-[120px] placeholder:text-gray-600"
                autoFocus
              />

              {imageUrl && (
                <div className="mt-4 relative group">
                  <img src={imageUrl} alt="Upload preview" className="w-full h-48 object-cover rounded-2xl border border-[#333]" />
                  <button 
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mt-4 flex items-center gap-2 text-rose-500 text-xs font-bold bg-rose-500/10 p-3 rounded-xl border border-rose-500/20"
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.div>
              )}

              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden" 
                accept="image/*"
              />

              <div className="mt-8 flex items-center justify-between">
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-2 text-blue-500 hover:bg-blue-500/10 px-4 py-2 rounded-xl transition-colors font-semibold text-sm disabled:opacity-50"
                  >
                    {isUploading ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
                    {isUploading ? 'Uploading...' : 'Add Image'}
                  </button>
                </div>
                <button 
                  disabled={!content.trim() || isUploading}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                >
                  <Send size={18} />
                  Post
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PostModal;


