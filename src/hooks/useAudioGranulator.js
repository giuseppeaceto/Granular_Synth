/**
 * useAudioGranulator.js
 * 
 * A custom React hook that implements granular synthesis using Tone.js.
 * This hook handles audio file uploads, buffer loading, and provides
 * controls for manipulating granular synthesis parameters in real-time.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';
import { validateAudioFile, createBufferFromFile, exportAudio, recordAudioOutput } from '../utils/audio/audioUtils';

/**
 * Custom hook for granular synthesis audio processing
 * @returns {Object} - Methods and state for granular synthesis
 */
const useAudioGranulator = () => {
  // State for audio file and buffer
  const [audioFile, setAudioFile] = useState(null);
  const [audioBuffer, setAudioBuffer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for granular synthesis parameters
  const [isPlaying, setIsPlaying] = useState(false);
  const [grainSize, setGrainSize] = useState(0.1); // seconds
  const [density, setDensity] = useState(10); // grains per second
  const [pitchShift, setPitchShift] = useState(0); // semitones
  const [playbackRate, setPlaybackRate] = useState(1);
  const [positionVariation, setPositionVariation] = useState(0); // 0-1
  const [playbackPosition, setPlaybackPosition] = useState(0); // 0-1
  const [attackTime, setAttackTime] = useState(0.01); // seconds
  const [releaseTime, setReleaseTime] = useState(0.1); // seconds
  
  // State for zen mode
  const [zenMode, setZenMode] = useState(false);
  
  // State for export options
  const [exportFormat, setExportFormat] = useState('wav');
  const [exportBitRate, setExportBitRate] = useState(192);
  
  // Refs for Tone.js objects
  const audioContextRef = useRef(null);
  const grainPlayerRef = useRef(null);
  const grainSourcesRef = useRef([]);
  const schedulerRef = useRef(null);
  const recordingRef = useRef(null);
  
  /**
   * Initialize Tone.js audio context
   */
  useEffect(() => {
    // Initialize Tone.js
    audioContextRef.current = Tone.context;
    
    // Cleanup function
    return () => {
      if (grainPlayerRef.current) {
        grainPlayerRef.current.dispose();
      }
      if (schedulerRef.current) {
        clearInterval(schedulerRef.current);
      }
      grainSourcesRef.current.forEach(source => {
        if (source && source.dispose) {
          source.dispose();
        }
      });
    };
  }, []);
  
  /**
   * Handle file upload and validation
   * @param {File} file - The uploaded audio file
   * @returns {Promise<boolean>} - Whether the file was loaded successfully
   */
  const handleFileUpload = useCallback(async (file) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate the file
      const validation = validateAudioFile(file);
      if (!validation.valid) {
        setError(validation.error);
        setIsLoading(false);
        return false;
      }
      
      // Stop any current playback
      if (isPlaying) {
        await stopPlayback();
      }
      
      // Load the file into an audio buffer
      const buffer = await createBufferFromFile(file, audioContextRef.current);
      
      // Update state
      setAudioFile(file);
      setAudioBuffer(buffer);
      setIsLoading(false);
      return true;
    } catch (err) {
      setError(`Error loading audio file: ${err.message}`);
      setIsLoading(false);
      return false;
    }
  }, [isPlaying]);
  
  /**
   * Start granular playback
   */
  const startPlayback = useCallback(async () => {
    if (!audioBuffer || isPlaying) return;
    
    try {
      // Ensure audio context is running
      await Tone.start();
      
      // Create a new grain player if needed
      if (!grainPlayerRef.current) {
        // Convert AudioBuffer to Tone.Buffer
        const toneBuffer = new Tone.Buffer().fromArray(
          audioBuffer.getChannelData(0),
          audioBuffer.sampleRate
        );
        
        grainPlayerRef.current = new Tone.GrainPlayer({
          url: toneBuffer,
          grainSize: grainSize,
          overlap: 0.1,
          loop: true,
          playbackRate: playbackRate,
          detune: pitchShift * 100, // Convert semitones to cents
        }).toDestination();
      }
      
      // Configure grain player
      grainPlayerRef.current.grainSize = grainSize;
      grainPlayerRef.current.playbackRate = playbackRate;
      grainPlayerRef.current.detune = pitchShift * 100;
      
      // Start playback
      grainPlayerRef.current.start();
      
      // Set up custom grain scheduler for more control
      setupGrainScheduler();
      
      setIsPlaying(true);
    } catch (err) {
      setError(`Error starting playback: ${err.message}`);
    }
  }, [audioBuffer, isPlaying, grainSize, playbackRate, pitchShift]);
  
  /**
   * Stop granular playback
   */
  const stopPlayback = useCallback(async () => {
    if (!isPlaying) return;
    
    // Stop the grain player
    if (grainPlayerRef.current) {
      grainPlayerRef.current.stop();
    }
    
    // Clear the scheduler
    if (schedulerRef.current) {
      clearInterval(schedulerRef.current);
      schedulerRef.current = null;
    }
    
    // Dispose of any active grain sources
    grainSourcesRef.current.forEach(source => {
      if (source && source.dispose) {
        source.dispose();
      }
    });
    grainSourcesRef.current = [];
    
    setIsPlaying(false);
  }, [isPlaying]);
  
  /**
   * Set up custom grain scheduler for more control over grain parameters
   */
  const setupGrainScheduler = useCallback(() => {
    // Clear any existing scheduler
    if (schedulerRef.current) {
      clearInterval(schedulerRef.current);
    }
    
    // Calculate interval based on density
    const interval = 1000 / density;
    
    // Set up new scheduler
    schedulerRef.current = setInterval(() => {
      if (!audioBuffer) return;
      
      // Create a new grain
      createGrain();
    }, interval);
  }, [audioBuffer, density]);
  
  /**
   * Create an individual grain
   */
  const createGrain = useCallback(() => {
    if (!audioBuffer || !isPlaying) return;
    
    try {
      // Calculate position with variation
      let position = playbackPosition;
      if (positionVariation > 0) {
        const variation = (Math.random() * 2 - 1) * positionVariation;
        position = Math.max(0, Math.min(1, position + variation));
      }
      
      // Convert position to seconds
      const startTime = position * audioBuffer.duration;
      
      // Create a buffer source for this grain
      const bufferSource = new Tone.BufferSource({
        buffer: new Tone.Buffer().fromArray(
          audioBuffer.getChannelData(0),
          audioBuffer.sampleRate
        ),
        playbackRate: playbackRate * (1 + (Math.random() * 0.1 - 0.05)), // Slight randomization
        detune: pitchShift * 100 + (Math.random() * 50 - 25), // Add slight random detune
        loop: false,
      }).toDestination();
      
      // Create envelope for the grain
      const envelope = new Tone.AmplitudeEnvelope({
        attack: attackTime,
        decay: 0.0,
        sustain: 1.0,
        release: releaseTime,
      }).connect(bufferSource.gain);
      
      // Start the grain
      const now = Tone.now();
      bufferSource.start(now, startTime, grainSize + attackTime + releaseTime);
      envelope.triggerAttackRelease(grainSize, now);
      
      // Store reference for cleanup
      grainSourcesRef.current.push(bufferSource);
      grainSourcesRef.current.push(envelope);
      
      // Clean up old grain sources to prevent memory leaks
      if (grainSourcesRef.current.length > 100) {
        const oldSources = grainSourcesRef.current.splice(0, 50);
        setTimeout(() => {
          oldSources.forEach(source => {
            if (source && source.dispose) {
              source.dispose();
            }
          });
        }, 1000);
      }
    } catch (err) {
      console.error('Error creating grain:', err);
    }
  }, [
    audioBuffer, 
    isPlaying, 
    playbackPosition, 
    positionVariation, 
    playbackRate, 
    pitchShift, 
    grainSize, 
    attackTime, 
    releaseTime
  ]);
  
  /**
   * Export the processed audio
   * @param {string} filename - The name for the exported file
   * @param {string} format - The export format ('wav' or 'mp3')
   * @param {number} bitRate - The bitrate for MP3 export
   */
  const exportProcessedAudio = useCallback(async (filename = 'granulated-audio', format = null, bitRate = null) => {
    if (!audioBuffer) {
      setError('No audio to export');
      return false;
    }
    
    try {
      // Use provided format or default to state
      const exportFileFormat = format || exportFormat;
      const exportFileBitRate = bitRate || exportBitRate;
      
      // For now, we'll just export the original audio buffer
      // In a real implementation, we would record the processed output
      await exportAudio(audioBuffer, filename, exportFileFormat, exportFileBitRate);
      return true;
    } catch (err) {
      setError(`Error exporting audio: ${err.message}`);
      return false;
    }
  }, [audioBuffer, exportFormat, exportBitRate]);
  
  /**
   * Generate random parameters for granular synthesis
   */
  const generateRandomPreset = useCallback(() => {
    // Define parameter ranges with min, max values
    const paramRanges = {
      grainSize: [0.01, 0.5],
      density: [1, 50],
      pitchShift: [-12, 12],
      playbackRate: [0.5, 2],
      positionVariation: [0, 1],
      playbackPosition: [0, 1],
      attackTime: [0.001, 0.1],
      releaseTime: [0.01, 0.3]
    };
    
    // Generate random values within ranges
    const randomValue = (min, max) => {
      return Math.random() * (max - min) + min;
    };
    
    // Create preset with random values
    const randomPreset = {
      grainSize: randomValue(...paramRanges.grainSize),
      density: randomValue(...paramRanges.density),
      pitchShift: Math.round(randomValue(...paramRanges.pitchShift)),
      playbackRate: randomValue(...paramRanges.playbackRate),
      positionVariation: randomValue(...paramRanges.positionVariation),
      playbackPosition: randomValue(...paramRanges.playbackPosition),
      attackTime: randomValue(...paramRanges.attackTime),
      releaseTime: randomValue(...paramRanges.releaseTime)
    };
    
    // Apply the random preset
    setGrainSize(randomPreset.grainSize);
    setDensity(randomPreset.density);
    setPitchShift(randomPreset.pitchShift);
    setPlaybackRate(randomPreset.playbackRate);
    setPositionVariation(randomPreset.positionVariation);
    setPlaybackPosition(randomPreset.playbackPosition);
    setAttackTime(randomPreset.attackTime);
    setReleaseTime(randomPreset.releaseTime);
    
    // Update the grain player if it exists
    if (grainPlayerRef.current) {
      grainPlayerRef.current.grainSize = randomPreset.grainSize;
      grainPlayerRef.current.playbackRate = randomPreset.playbackRate;
      grainPlayerRef.current.detune = randomPreset.pitchShift * 100;
    }
    
    // Reconfigure the scheduler if playing
    if (isPlaying) {
      setupGrainScheduler();
    }
    
    return randomPreset;
  }, [isPlaying, setupGrainScheduler]);
  
  /**
   * Toggle zen mode
   */
  const toggleZenMode = useCallback(() => {
    setZenMode(prevMode => !prevMode);
  }, []);
  
  /**
   * Update parameter methods
   */
  const updateGrainSize = useCallback((size) => {
    setGrainSize(size);
    if (grainPlayerRef.current) {
      grainPlayerRef.current.grainSize = size;
    }
  }, []);
  
  const updateDensity = useCallback((value) => {
    setDensity(value);
    // Reconfigure the scheduler with new density
    if (isPlaying) {
      setupGrainScheduler();
    }
  }, [isPlaying, setupGrainScheduler]);
  
  const updatePitchShift = useCallback((value) => {
    setPitchShift(value);
    if (grainPlayerRef.current) {
      grainPlayerRef.current.detune = value * 100;
    }
  }, []);
  
  const updatePlaybackRate = useCallback((value) => {
    setPlaybackRate(value);
    if (grainPlayerRef.current) {
      grainPlayerRef.current.playbackRate = value;
    }
  }, []);
  
  const updatePlaybackPosition = useCallback((value) => {
    setPlaybackPosition(value);
  }, []);
  
  const updatePositionVariation = useCallback((value) => {
    setPositionVariation(value);
  }, []);
  
  const updateAttackTime = useCallback((value) => {
    setAttackTime(value);
  }, []);
  
  const updateReleaseTime = useCallback((value) => {
    setReleaseTime(value);
  }, []);
  
  const updateExportFormat = useCallback((format) => {
    setExportFormat(format);
  }, []);
  
  const updateExportBitRate = useCallback((bitRate) => {
    setExportBitRate(bitRate);
  }, []);
  
  // Return the hook API
  return {
    // State
    audioFile,
    audioBuffer,
    isLoading,
    error,
    isPlaying,
    zenMode,
    exportFormat,
    exportBitRate,
    
    // Parameter values
    grainSize,
    density,
    pitchShift,
    playbackRate,
    playbackPosition,
    positionVariation,
    attackTime,
    releaseTime,
    
    // Methods
    handleFileUpload,
    startPlayback,
    stopPlayback,
    exportProcessedAudio,
    generateRandomPreset,
    toggleZenMode,
    
    // Parameter update methods
    updateGrainSize,
    updateDensity,
    updatePitchShift,
    updatePlaybackRate,
    updatePlaybackPosition,
    updatePositionVariation,
    updateAttackTime,
    updateReleaseTime,
    updateExportFormat,
    updateExportBitRate,
  };
};

export default useAudioGranulator;