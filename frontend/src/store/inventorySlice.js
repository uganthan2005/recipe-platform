import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchInventory = createAsyncThunk('inventory/fetch', async (userId) => {
    // Ideally use an axios instance with base URL and auth header
    const response = await axios.get(`/api/inventory?userId=${userId}`);
    return response.data;
});

const inventorySlice = createSlice({
    name: 'inventory',
    initialState: { items: [], status: 'idle' },
    reducers: {
        addItem: (state, action) => {
            state.items.push(action.payload);
        },
        setItems: (state, action) => {
            state.items = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchInventory.fulfilled, (state, action) => {
            state.items = action.payload;
            state.status = 'succeeded';
        });
    }
});

export const { addItem } = inventorySlice.actions;
export default inventorySlice.reducer;
