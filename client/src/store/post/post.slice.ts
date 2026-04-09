import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/posts';

export const fetchPosts = createAsyncThunk('post/fetchPosts', async () => {
  const response = await axios.get(API_URL);
  return response.data.data.posts;
});

export const createPost = createAsyncThunk('post/createPost', async (postData: { content: string; images?: string[] }) => {
  const response = await axios.post(API_URL, postData, { withCredentials: true });
  return response.data.data.post;
});

export const fetchUserPosts = createAsyncThunk('post/fetchUserPosts', async (userId: string) => {
  const response = await axios.get(`${API_URL}/user/${userId}`);
  return response.data.data.posts;
});

interface PostState {
  posts: any[];
  userPosts: any[];
  loading: boolean;
  error: string | null;
  isPostModalOpen: boolean;
}

const initialState: PostState = {
  posts: [],
  userPosts: [],
  loading: false,
  error: null,
  isPostModalOpen: false,
};

export const likePost = createAsyncThunk('post/likePost', async (postId: string) => {
  const response = await axios.post(`${API_URL}/${postId}/like`, {}, { withCredentials: true });
  return { postId, likes: response.data.data.likes };
});

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    addPostToFeed: (state, action: PayloadAction<any>) => {
      state.posts.unshift(action.payload);
    },
    setPostModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isPostModalOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => { state.loading = true; })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch posts';
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
        state.isPostModalOpen = false;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.userPosts = action.payload;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p._id === action.payload.postId);
        if (post) {
          post.likes = action.payload.likes;
        }
        const userPost = state.userPosts.find(p => p._id === action.payload.postId);
        if (userPost) {
          userPost.likes = action.payload.likes;
        }
      });
  },
});


export const { addPostToFeed, setPostModalOpen } = postSlice.actions;
export default postSlice.reducer;

