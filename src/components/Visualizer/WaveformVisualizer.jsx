import React, { useEffect, useRef } from 'react';
import { useAudioGranulatorContext } from '../../context/AudioGranulatorContext';

/**
 * Component for standard waveform visualization
 */
const WaveformVisualizer = () => {
  const { audioBuffer, isPlaying, playbackPosition } = useAudioGranulatorContext();
  const canvasRef = useRef(null);
  
  // Draw waveform visualization
  useEffect(() => {
    if (!audioBuffer || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Resize canvas to fill container
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      drawWaveform(); // Redraw after resize
    };
    
    // Initial resize
    resizeCanvas();
    
    // Listen for resize events
    window.addEventListener('resize', resizeCanvas);
    
    // Draw waveform function
    function drawWaveform() {
      const width = canvas.width;
      const height = canvas.height;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Get audio data
      const channelData = audioBuffer.getChannelData(0);
      const step = Math.ceil(channelData.length / width);
      const amp = height / 2;
      
      // Set styles
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#3b82f6'; // blue-500
      ctx.beginPath();
      
      // Draw waveform
      for (let i = 0; i < width; i++) {
        const x = i;
        const index = Math.floor(i * step);
        const y = (1 - channelData[index]) * amp;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
      
      // Draw playback position if playing
      if (isPlaying) {
        const positionX = Math.floor(playbackPosition * width);
        ctx.strokeStyle = '#ef4444'; // red-500
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(positionX, 0);
        ctx.lineTo(positionX, height);
        ctx.stroke();
      }
    }
    
    // Initial draw
    drawWaveform();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [audioBuffer, isPlaying, playbackPosition]);
  
  // Update playback position marker during playback
  useEffect(() => {
    if (!audioBuffer || !canvasRef.current || !isPlaying) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Draw playback position
    const positionX = Math.floor(playbackPosition * width);
    
    // Clear previous position marker (redraw a small section of the waveform)
    const clearWidth = 5; // Width to clear around the marker
    ctx.clearRect(positionX - clearWidth, 0, clearWidth * 2, height);
    
    // Redraw waveform section
    const channelData = audioBuffer.getChannelData(0);
    const step = Math.ceil(channelData.length / width);
    const amp = height / 2;
    
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#3b82f6'; // blue-500
    ctx.beginPath();
    
    for (let i = Math.max(0, positionX - clearWidth); i < Math.min(width, positionX + clearWidth); i++) {
      const x = i;
      const index = Math.floor(i * step);
      const y = (1 - channelData[index]) * amp;
      
      if (i === Math.max(0, positionX - clearWidth)) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    
    // Draw new position marker
    ctx.strokeStyle = '#ef4444'; // red-500
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(positionX, 0);
    ctx.lineTo(positionX, height);
    ctx.stroke();
  }, [audioBuffer, isPlaying, playbackPosition]);
  
  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-gray-900"
    />
  );
};

export default WaveformVisualizer;