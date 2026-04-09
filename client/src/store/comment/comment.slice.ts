import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/comments';

export const fetchPostComments = createAsyncThunk('comment/fetchPostComments', async (postId: string) => {
  const response = await axios.get(`${API_URL}/post/${postId}`);
  return response.data.data.comments;
});

export const addComment = createAsyncThunk('comment/addComment', async (commentData: { content: string; postId: string; parentCommentId?: string }) => {
  const response = await axios.post(API_URL, commentData, { withCredentials: true });
  return response.data.data.comment;
});

interface CommentState {
  comments: any[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

export const likeComment = createAsyncThunk('comment/likeComment', async (commentId: string) => {
  const response = await axios.post(`${API_URL}/${commentId}/like`, {}, { withCredentials: true });
  return { commentId, likes: response.data.data.likes };
});

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    addNewCommentLocally: (state, action: PayloadAction<{ comment: any; postId: string }>) => {
      const { comment } = action.payload;
      if (comment.parentComment) {
        state.comments.push(comment);
      } else {
        state.comments.unshift(comment);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostComments.pending, (state) => { state.loading = true; })
      .addCase(fetchPostComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchPostComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch comments';
      })
      .addCase(likeComment.fulfilled, (state, action) => {
          // Find in main comments or nested replies
          const findAndUpdate = (comments: any[]) => {
              for (let comment of comments) {
                  if (comment._id === action.payload.commentId) {
                      comment.likes = action.payload.likes;
                      return true;
                  }
                  if (comment.repliesData && findAndUpdate(comment.repliesData)) {
                      return true;
                  }
              }
              return false;
          };
          findAndUpdate(state.comments);
      });
  },
});


export const { addNewCommentLocally } = commentSlice.actions;
export default commentSlice.reducer;
