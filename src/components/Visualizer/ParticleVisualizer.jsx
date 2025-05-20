import React, { useEffect, useRef } from 'react';
import { useAudioGranulatorContext } from '../../context/AudioGranulatorContext';

/**
 * Component for particle-based audio visualization in Zen mode
 */
const ParticleVisualizer = () => {
  const {
    audioBuffer,
    isPlaying,
    grainSize,
    density,
    pitchShift,
    playbackRate,
    playbackPosition,
    positionVariation
  } = useAudioGranulatorContext();
  
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  
  // Initialize particles
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Resize canvas to fill container
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    
    // Initial resize
    resizeCanvas();
    
    // Listen for resize events
    window.addEventListener('resize', resizeCanvas);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Create and animate particles based on audio parameters
  useEffect(() => {
    if (!canvasRef.current || !audioBuffer) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Initialize particles based on density
    const particleCount = Math.max(50, Math.min(500, density * 10));
    particlesRef.current = [];
    
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 5 + 2,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        hue: (pitchShift + 12) * 10, // Map pitch shift to color
        opacity: Math.random() * 0.5 + 0.3,
        life: Math.random() * 100 + 50
      });
    }
    
    // Animation function
    const animate = () => {
      // Clear canvas with semi-transparent background for trail effect
      ctx.fillStyle = 'rgba(17, 24, 39, 0.2)'; // bg-gray-900 with opacity
      ctx.fillRect(0, 0, width, height);
      
      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX * (playbackRate * 0.5);
        particle.y += particle.speedY * (playbackRate * 0.5);
        
        // Reduce life
        particle.life -= 0.5;
        
        // Regenerate particle if it's dead or out of bounds
        if (particle.life <= 0 || 
            particle.x < 0 || 
            particle.x > width || 
            particle.y < 0 || 
            particle.y > height) {
          
          // Position new particles around the playback position
          const posX = (playbackPosition + (Math.random() * positionVariation * 2 - positionVariation)) * width;
          
          particlesRef.current[index] = {
            x: Math.max(0, Math.min(width, posX)),
            y: Math.random() * height,
            size: (Math.random() * grainSize * 20) + 2,
            speedX: (Math.random() - 0.5) * 2 * playbackRate,
            speedY: (Math.random() - 0.5) * 2 * playbackRate,
            hue: (pitchShift + 12) * 10,
            opacity: Math.random() * 0.5 + 0.3,
            life: Math.random() * 100 + 50
          };
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 100%, 70%, ${particle.opacity})`;
        ctx.fill();
      });
      
      // Continue animation if playing
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    // Start animation if playing
    if (isPlaying) {
      animate();
    }
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    audioBuffer,
    isPlaying,
    grainSize,
    density,
    pitchShift,
    playbackRate,
    playbackPosition,
    positionVariation
  ]);
  
  return (
    <div className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-gray-900 rounded-lg"
      />
      
      {!audioBuffer && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          Upload an audio file to see visualization
        </div>
      )}
    </div>
  );
};

export default ParticleVisualizer;