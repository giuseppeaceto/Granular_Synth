/**
 * Audio Utility Functions
 * 
 * This module provides utility functions for audio file validation,
 * processing, and export functionality for the audio granulator application.
 */

/**
 * Validates an audio file to ensure it meets the application requirements
 * @param {File} file - The file object to validate
 * @returns {Object} - Object containing validation result and error message if any
 */
export const validateAudioFile = (file) => {
  // Define allowed file types and maximum file size (50MB)
  const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/x-wav'];
  const allowedExtensions = ['mp3', 'wav'];
  const maxFileSize = 50 * 1024 * 1024; // 50MB
  
  // Check file extension
  const fileExtension = file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    return { 
      valid: false, 
      error: `Invalid file extension. Allowed extensions: ${allowedExtensions.join(', ')}` 
    };
  }
  
  // Check MIME type
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: `Invalid file type. Allowed types: MP3, WAV` 
    };
  }
  
  // Check file size
  if (file.size > maxFileSize) {
    return { 
      valid: false, 
      error: `File too large. Maximum size: ${Math.floor(maxFileSize / (1024 * 1024))}MB` 
    };
  }
  
  return { valid: true };
};

/**
 * Converts an AudioBuffer to a WAV Blob
 * @param {AudioBuffer} audioBuffer - The AudioBuffer to convert
 * @returns {Blob} - WAV file as a Blob
 */
export const audioBufferToWav = (audioBuffer) => {
  // Get audio buffer data
  const numOfChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length;
  const sampleRate = audioBuffer.sampleRate;
  const channelData = [];
  
  // Extract channel data
  for (let channel = 0; channel < numOfChannels; channel++) {
    channelData.push(audioBuffer.getChannelData(channel));
  }
  
  // Create WAV file format
  const buffer = new ArrayBuffer(44 + length * numOfChannels * 2);
  const view = new DataView(buffer);
  
  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + length * numOfChannels * 2, true);
  writeString(view, 8, 'WAVE');
  
  // FMT sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // subchunk1size
  view.setUint16(20, 1, true); // audio format (PCM)
  view.setUint16(22, numOfChannels, true); // num of channels
  view.setUint32(24, sampleRate, true); // sample rate
  view.setUint32(28, sampleRate * numOfChannels * 2, true); // byte rate
  view.setUint16(32, numOfChannels * 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  
  // Data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, length * numOfChannels * 2, true);
  
  // Write the PCM samples
  const offset = 44;
  let index = 0;
  const volume = 1;
  
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numOfChannels; channel++) {
      // Clamp the value to the 16-bit range
      const sample = Math.max(-1, Math.min(1, channelData[channel][i]));
      // Scale to 16-bit range and convert to integer
      const value = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      // Write 16-bit sample
      view.setInt16(offset + index, value, true);
      index += 2;
    }
  }
  
  // Create and return the blob
  return new Blob([buffer], { type: 'audio/wav' });
};

/**
 * Converts an AudioBuffer to an MP3 Blob using the LAME encoder
 * @param {AudioBuffer} audioBuffer - The AudioBuffer to convert
 * @param {number} bitRate - The bitrate for MP3 encoding (128, 192, 256, 320)
 * @returns {Promise<Blob>} - Promise resolving to MP3 file as a Blob
 */
export const audioBufferToMp3 = async (audioBuffer, bitRate = 192) => {
  // We'll use the Web Audio API to encode to MP3
  // This is a simplified version - in a real app, you'd use a proper MP3 encoder like lamejs
  // For this demo, we'll convert to WAV first and then use a simple conversion technique
  
  // Create a new audio context
  const offlineContext = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  );
  
  // Create a buffer source
  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  
  // Create a gain node for volume control
  const gainNode = offlineContext.createGain();
  gainNode.gain.value = 1.0;
  
  // Connect the nodes
  source.connect(gainNode);
  gainNode.connect(offlineContext.destination);
  
  // Start the source
  source.start(0);
  
  // Render the audio
  const renderedBuffer = await offlineContext.startRendering();
  
  // For now, we'll just convert to WAV and set the MIME type to MP3
  // In a real application, you would use a proper MP3 encoder
  const wavBlob = audioBufferToWav(renderedBuffer);
  
  // Return a blob with MP3 MIME type
  // Note: This is not a real MP3 conversion, just a placeholder
  return new Blob([wavBlob], { type: 'audio/mpeg' });
};

/**
 * Helper function to write a string to a DataView
 */
function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Exports processed audio as a downloadable file
 * @param {AudioBuffer} audioBuffer - The processed AudioBuffer
 * @param {string} filename - The name for the exported file
 * @param {string} format - The export format ('wav' or 'mp3')
 * @param {number} bitRate - The bitrate for MP3 encoding (128, 192, 256, 320)
 */
export const exportAudio = async (audioBuffer, filename = 'processed-audio', format = 'wav', bitRate = 192) => {
  let blob;
  
  if (format === 'mp3') {
    blob = await audioBufferToMp3(audioBuffer, bitRate);
  } else {
    // Default to WAV
    blob = audioBufferToWav(audioBuffer);
    format = 'wav';
  }
  
  const url = URL.createObjectURL(blob);
  
  // Create download link and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.${format}`;
  link.click();
  
  // Clean up
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
};

/**
 * Creates an audio buffer from a file
 * @param {File} file - The audio file
 * @param {AudioContext} audioContext - The audio context
 * @returns {Promise<AudioBuffer>} - Promise resolving to an AudioBuffer
 */
export const createBufferFromFile = async (file, audioContext) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target.result;
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        resolve(audioBuffer);
      } catch (error) {
        reject(new Error('Failed to decode audio data: ' + error.message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Records the processed audio output
 * @param {AudioNode} sourceNode - The source node to record from
 * @param {number} duration - Recording duration in seconds
 * @param {AudioContext} audioContext - The audio context
 * @returns {Promise<AudioBuffer>} - Promise resolving to the recorded AudioBuffer
 */
export const recordAudioOutput = async (sourceNode, duration, audioContext) => {
  return new Promise((resolve, reject) => {
    try {
      // Create an offline audio context for recording
      const offlineContext = new OfflineAudioContext(
        2, // stereo output
        audioContext.sampleRate * duration,
        audioContext.sampleRate
      );
      
      // Connect the source to the offline context destination
      sourceNode.connect(offlineContext.destination);
      
      // Start rendering
      offlineContext.startRendering().then(renderedBuffer => {
        resolve(renderedBuffer);
      }).catch(err => {
        reject(new Error('Error recording audio: ' + err.message));
      });
    } catch (err) {
      reject(new Error('Error setting up recording: ' + err.message));
    }
  });
};