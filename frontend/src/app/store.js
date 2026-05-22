import { configureStore } from "@reduxjs/toolkit"
import yawraokeReducer from "../features/audioSeparator/yawSlice"

export const store = configureStore({
    reducer: {
        yawraoke: yawraokeReducer
    }

})
