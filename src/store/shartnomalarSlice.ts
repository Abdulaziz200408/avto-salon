import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API URL
const API_URL = "https://a952eac74ed8e372.mokky.dev/shartnomalar";

// Initial state
interface ShartnomalarState {
  items: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: ShartnomalarState = {
  items: [],
  status: "idle",
};

// Thunks for fetching data
export const fetchShartnomalar = createAsyncThunk(
  "shartnomalar/fetchShartnomalar",
  async () => {
    const response = await axios.get(API_URL);
    return response.data;
  }
);

// Thunks for creating new data
export const createShartnoma = createAsyncThunk(
  "shartnomalar/createShartnoma",
  async (newShartnoma: any) => {
    const response = await axios.post(API_URL, newShartnoma);
    return response.data;
  }
);

const shartnomalarSlice = createSlice({
  name: "shartnomalar",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShartnomalar.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchShartnomalar.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchShartnomalar.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(createShartnoma.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default shartnomalarSlice.reducer;
