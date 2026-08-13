import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'https://api.freeapi.app/api/v1/todos';

// Fetch all todos
export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok)
        return rejectWithValue(`Server error: ${response.status}`);
      const data = await response.json();
      return data; // assuming structure { data: [...] }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Add new todo
export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async (todoData, { rejectWithValue }) => {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todoData),
      });
      if (!response.ok)
        return rejectWithValue(`Server error: ${response.status}`);
      const data = await response.json();
      return data; // new todo object
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Update todo
export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok)
        return rejectWithValue(`Server error: ${response.status}`);
      const data = await response.json();
      return data; // updated todo
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Delete todo
export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok)
        return rejectWithValue(`Server error: ${response.status}`);
      return id; // return id to remove from list
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Toggle todo status
export const toggleTodoStatus = createAsyncThunk(
  'todos/toggleTodoStatus',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/toggle/status/${id}`, {
        method: 'PATCH',
      });
      if (!response.ok)
        return rejectWithValue(`Server error: ${response.status}`);
      const data = await response.json();
      return data; // updated todo with new status
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload?.data || []; // adjust based on actual API response
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      // Add
      .addCase(addTodo.fulfilled, (state, action) => {
        const newTodo = action.payload?.data || action.payload;
        if (newTodo) state.items.push(newTodo);
      })
      // Update
      .addCase(updateTodo.fulfilled, (state, action) => {
        const updated = action.payload?.data || action.payload;
        const index = state.items.findIndex((t) => t._id === updated._id);
        if (index !== -1) state.items[index] = updated;
      })
      // Delete
      .addCase(deleteTodo.fulfilled, (state, action) => {
        const id = action.payload;
        state.items = state.items.filter((t) => t._id !== id);
      })
      // Toggle
      .addCase(toggleTodoStatus.fulfilled, (state, action) => {
        const toggled = action.payload?.data || action.payload;
        const index = state.items.findIndex((t) => t._id === toggled._id);
        if (index !== -1) state.items[index] = toggled;
      });
  },
});

export default todosSlice.reducer;
