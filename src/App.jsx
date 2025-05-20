import { useState } from 'react';
import './App.css';
import GranulatorPanel from './components/Granulator/GranulatorPanel';
import ControlPanel from './components/AudioControls/ControlPanel';
import PlaybackControls from './components/AudioControls/PlaybackControls';
import ExportPanel from './components/AudioControls/ExportPanel';
import Visualizer from './components/Visualizer/Visualizer';
import { AudioGranulatorProvider } from './context/AudioGranulatorContext';

function App() {
  return (
    <AudioGranulatorProvider>
      <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center">Audio Granulator</h1>
          <p className="text-center text-gray-400 mt-2">
            Upload an audio file and transform it using granular synthesis
          </p>
        </header>
        
        <main className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 gap-6">
            {/* Audio Visualizer */}
            <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
              <Visualizer />
            </div>
            
            {/* Granulator Panel with File Upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GranulatorPanel />
              <ExportPanel />
            </div>
            
            {/* Playback Controls */}
            <PlaybackControls />
            
            {/* Audio Controls */}
            <ControlPanel />
          </div>
        </main>
        
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>Audio Granulator - Built with React, Tone.js and Tailwind CSS</p>
        </footer>
      </div>
    </AudioGranulatorProvider>
  );
}

export default App;