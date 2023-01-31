import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
    name: "project",
    initialState: {
        data: []
    },
    reducers: {
        loadData: (state, action) => {
            let { file, data } = action.payload
            if (state.data.some(d => d.file === file)) {
                file = `Copy of ${file}`;
            }
            state.data.push({ file, data });
        },
        clearData: (state) => {
            state.data = [];
        }
    }
});

export const { loadData, clearData } = projectSlice.actions;

export default projectSlice.reducer;
