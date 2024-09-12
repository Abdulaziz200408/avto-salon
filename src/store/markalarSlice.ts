import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API URL

// Initial state
interface MarkalarState {
  items: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: MarkalarState = {
  items: [],
  status: "idle",
};

export const fetchMarkalar = createAsyncThunk(
  "markalar/fetchMarkalar",
  async () => {
    const response = await axios.get(
      "https://a952eac74ed8e372.mokky.dev/markalar"
    );
    console.log(response.data); // Ma'lumotlarni ko'rish uchun
    return response.data;
  }
);

// Thunks for creating new data
export const createMarka = createAsyncThunk(
  "markalar/createMarka",
  async (newMarka: any) => {
    const response = await axios.post(
      "https://a952eac74ed8e372.mokky.dev/markalar",
      newMarka
    );
    return response.data;
  }
);

const markalarSlice = createSlice({
  name: "markalar",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarkalar.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMarkalar.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchMarkalar.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(createMarka.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default markalarSlice.reducer;
