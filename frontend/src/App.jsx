import './App.css'
import AudioUploader from './components/AudioUploader'
import { AudioProvider } from './components/AudioContext'
import AudioFiltering from './components/AudioFiltering'
import YawraokeScreen from './components/YawraokeScreen'
import AudioController from './components/AudioController'

function App() {
  return (
    <>
      <YawraokeScreen />
      <AudioProvider>
        <AudioUploader />
        <AudioFiltering />
        <AudioController />

      </AudioProvider>
    </>
  )
}

export default App
