import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/posts';

export const fetchPosts = createAsyncThunk('post/fetchPosts', async () => {
  const response = await axios.get(API_URL);
  return response.data.data.posts;
});

export const createPost = createAsyncThunk(
  'post/createPost',
  async (postData: { content: string; images?: string[] }, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, postData, { withCredentials: true });
      return response.data.data.post;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

export const fetchUserPosts = createAsyncThunk('post/fetchUserPosts', async (userId: string) => {
  const response = await axios.get(`${API_URL}/user/${userId}`);
  return response.data.data.posts;
});

export const fetchPostById = createAsyncThunk('post/fetchPostById', async (postId: string) => {
  const response = await axios.get(`${API_URL}/${postId}`);
  return response.data.data.post;
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
      const exists = state.posts.some(p => p._id === action.payload._id);
      if (!exists) {
        state.posts.unshift(action.payload);
      }
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
        const exists = state.posts.some(p => p._id === action.payload._id);
        if (!exists) {
          state.posts.unshift(action.payload);
        }
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

