import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Load candidate by ID from backend
export const loadCandidate = createAsyncThunk(
  "candidate/load",
  async (id) => {
    const res = await fetch(`http://localhost:5000/candidate/${id}`);
    const data = await res.json();
    return data;
  }
);

// Save candidate (insert or update)
export const saveCandidate = createAsyncThunk(
  "candidate/save",
  async (formData) => {
    const data = new FormData();
    for (let key in formData) {
      if (formData[key] !== null) data.append(key, formData[key]);
    }

    const res = await fetch("http://localhost:5000/candidate", {
      method: "POST",
      body: data,
    });
    const result = await res.json();
    return result;
  }
);

const candidateSlice = createSlice({
  name: "candidate",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCandidate.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loadCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(saveCandidate.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveCandidate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = { ...state.data, ...action.payload };
      })
      .addCase(saveCandidate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default candidateSlice.reducer;
