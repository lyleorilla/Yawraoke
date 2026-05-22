import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import yawService from "./yawService"

const initialState = {
    audio: null,
    vocals: null,
    instrumentals: null,
    segments: [],
    paragraphs: [],
    data: [],
    loading: false
}


export const audioSeparator = createAsyncThunk("audio/separate", async (audioFile, thunkApi) => {
    try {
        const response = await yawService.handleSeperate(audioFile)
        console.log("audioSeparator thunk resolved with:", response)
        return response

    } catch (error) {
        console.error("audioSeparator thunk error:", error)
        return thunkApi.rejectWithValue(error.message)
    }
})


const yawraokeSlice = createSlice({
    name: "yawraoke",
    initialState,
    reducers: {
        reset: (state) => {
            state.audio = null
            state.vocals = null
            state.instrumentals = null
            state.segments = []
            state.paragraphs = []
            state.data = []
            state.loading = false
        },
        setAudio: (state, action) => {
            state.audio = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(audioSeparator.pending, (state) => {
            state.loading = true
        })
        builder.addCase(audioSeparator.fulfilled, (state, action) => {
            console.log("Redux audioSeparator.fulfilled payload:", action.payload)
            state.loading = false
            state.vocals = action.payload.vocalsUrl
            state.instrumentals = action.payload.backgroundUrl
            state.segments = action.payload.segments
            console.log("Paragraphs: ", action.payload.paragraphs)
            state.paragraphs = action.payload.paragraphs
            state.data = action.payload.data
        })
        builder.addCase(audioSeparator.rejected, (state) => {
            state.loading = false
        })
    }
})

export const { reset, setAudio } = yawraokeSlice.actions
export default yawraokeSlice.reducer