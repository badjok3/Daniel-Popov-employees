import { configureStore } from "@reduxjs/toolkit";
import projectSlice from "./reducer";

const store = configureStore({
    reducer: {
        project: projectSlice
    }
});

export default store;
