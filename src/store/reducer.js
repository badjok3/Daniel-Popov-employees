import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
    name: "project",
    initialState: {
        data: [],
    },
    reducers: {
        loadData: (state, action) => {
            const { file, data } = action.payload
            state.data.push({ file, data });
        }
    }
});

export const { loadData } = projectSlice.actions;

export default projectSlice.reducer;
