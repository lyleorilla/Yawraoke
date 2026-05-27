import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import yawService from "./yawService"

const initialState = {
    musicName: [],
    audio: [],
    vocals: [],
    instrumentals: [],
    segments: [],
    paragraphs: [],
    data: [],
    loading: false,
    songIndex: null
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
            state.audio = []
            state.vocals = []
            state.instrumentals = []
            state.segments = []
            state.paragraphs = []
            state.data = []
            state.loading = []
            state.totalPlaylist = null
        },
        setAudio: (state, action) => {
            state.audio = action.payload
        },
        nextSong: (state) => {
            if (state.songIndex === null) return
            state.songIndex = (state.songIndex + 1) % state.vocals.length
        },
        prevSong: (state) => {
            if (state.songIndex === null) return
            state.songIndex = (state.songIndex - 1 + state.vocals.length) % state.vocals.length

        },
        setName: (state, action) => {
            state.musicName.push(action.payload)
        }
    },
    extraReducers: (builder) => {
        builder.addCase(audioSeparator.pending, (state) => {
            state.loading = true
        })
        builder.addCase(audioSeparator.fulfilled, (state, action) => {
            console.log("Redux audioSeparator.fulfilled payload:", action.payload)
            state.loading = false
            state.vocals.push(action.payload.vocalsUrl)
            state.instrumentals.push(action.payload.backgroundUrl)
            state.segments.push(action.payload.segments)
            console.log("Paragraphs: ", action.payload.paragraphs)
            state.paragraphs.push(action.payload.paragraphs)
            state.data.push(action.payload.data)
            state.songIndex = (state.vocals.length - 1)
            state.totalPlaylist = (state.vocals.length)

        })
        builder.addCase(audioSeparator.rejected, (state) => {
            state.loading = false
        })
    }
})

export const { reset, setAudio, nextSong, prevSong, setName } = yawraokeSlice.actions
export default yawraokeSlice.reducer