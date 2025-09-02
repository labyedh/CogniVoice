import React from 'react';
import { Mic, MicOff, Play, Pause, Trash2, Upload } from 'lucide-react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { AudioData } from '../types';

interface AudioRecorderProps {
  onAudioReady: (audio: AudioData) => void;
  disabled?: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioReady, disabled = false }) => {
  const { 
    isRecording, 
    audioData, 
    error, 
    startRecording, 
    stopRecording, 
    clearRecording 
  } = useAudioRecorder();

  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      const audio: AudioData = { file, url };
      onAudioReady(audio);
    }
  };

  const handleUseRecording = () => {
    if (audioData) {
      onAudioReady(audioData);
    }
  };

  React.useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => setIsPlaying(false);
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, [audioData]);

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-[#FFEAD8]">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Record Your Response</h3>
        
        <div className="flex items-center justify-center space-x-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={disabled}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#E8988A] to-[#9B177E] hover:from-[#9B177E] hover:to-[#2A1458] disabled:bg-gray-300 text-white px-6 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Mic className="w-5 h-5" />
              <span>Start Recording</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#2A1458] to-[#9B177E] hover:from-[#9B177E] hover:to-[#E8988A] text-white px-6 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl animate-pulse"
            >
              <MicOff className="w-5 h-5" />
              <span>Stop Recording</span>
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Audio Playback */}
      {audioData && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-[#FFEAD8]">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Your Recording</h4>
          
          <audio ref={audioRef} src={audioData.url} className="hidden" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePlayPause}
                className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-[#9B177E] to-[#2A1458] hover:from-[#2A1458] hover:to-[#9B177E] text-white rounded-full transition-all duration-200"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
              </button>
              
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#9B177E] to-[#2A1458] rounded-full w-0 transition-all duration-300"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={clearRecording}
                className="p-2 text-gray-500 hover:text-[#E8988A] transition-colors duration-200"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleUseRecording}
              disabled={disabled}
              className="bg-gradient-to-r from-[#9B177E] to-[#2A1458] hover:from-[#2A1458] hover:to-[#9B177E] disabled:bg-gray-300 text-white px-6 py-2 rounded-lg transition-all duration-200"
            >
              Use This Recording
            </button>
          </div>
        </div>
      )}

      {/* File Upload Alternative */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-[#FFEAD8]">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Or Upload Audio File</h3>
        
        <div className="border-2 border-dashed border-[#E8988A]/50 rounded-lg p-6 text-center hover:border-[#9B177E] transition-colors duration-200">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 mb-2">Drop your audio file here or click to browse</p>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            disabled={disabled}
            className="hidden"
            id="audio-upload"
          />
          <label
            htmlFor="audio-upload"
            className="inline-block bg-gradient-to-r from-[#9B177E] to-[#2A1458] hover:from-[#2A1458] hover:to-[#9B177E] disabled:bg-gray-300 text-white px-4 py-2 rounded-lg cursor-pointer transition-all duration-200"
          >
            Choose File
          </label>
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder;