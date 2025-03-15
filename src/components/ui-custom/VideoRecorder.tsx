
import React, { useState, useRef, useEffect } from 'react';
import { X, Video, Pause, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface VideoRecorderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (videoBlob: Blob) => void;
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({ isOpen, onClose, onSave }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const { toast } = useToast();
  
  // Initialize camera when component mounts
  useEffect(() => {
    if (isOpen) {
      initializeCamera();
    }
    
    return () => {
      stopMediaTracks();
    };
  }, [isOpen]);
  
  const initializeCamera = async () => {
    setError(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      streamRef.current = stream;
      
      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedVideo(blob);
        chunksRef.current = [];
      };
      
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access your camera or microphone. Please check permissions.');
      toast({
        title: 'Camera Error',
        description: 'Could not access your camera or microphone. Please check permissions.',
        variant: 'destructive'
      });
    }
  };
  
  const startRecording = () => {
    if (!mediaRecorderRef.current) return;
    
    // Start with a 3-second countdown
    setCountdown(3);
    
    const countdownTimer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(countdownTimer);
          // Actually start recording after countdown
          chunksRef.current = [];
          mediaRecorderRef.current?.start();
          setIsRecording(true);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const resetRecording = () => {
    setRecordedVideo(null);
    initializeCamera();
  };
  
  const handleSave = () => {
    if (recordedVideo) {
      onSave(recordedVideo);
      toast({
        title: 'Video Saved',
        description: 'Your video has been saved successfully!',
      });
    }
  };
  
  const stopMediaTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-card w-full max-w-md rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-medium">Record Video</h3>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        
        <div className="relative bg-black aspect-video">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <p>{error}</p>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline
                className={cn(
                  "w-full h-full object-cover",
                  recordedVideo ? "hidden" : "block"
                )}
              />
              
              {recordedVideo && (
                <video 
                  autoPlay 
                  controls 
                  loop
                  className="w-full h-full object-cover"
                  src={URL.createObjectURL(recordedVideo)} 
                />
              )}
              
              {countdown > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-7xl font-bold text-white bg-black/30 rounded-full w-24 h-24 flex items-center justify-center">
                    {countdown}
                  </span>
                </div>
              )}
              
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/50 text-white px-3 py-1 rounded-full">
                  <span className="animate-pulse w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-sm font-medium">Recording</span>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="p-4 flex justify-center space-x-2">
          {!recordedVideo ? (
            <>
              {!isRecording ? (
                <Button onClick={startRecording} disabled={!!error}>
                  <Video className="mr-2 h-4 w-4" />
                  Start Recording
                </Button>
              ) : (
                <Button variant="destructive" onClick={stopRecording}>
                  <Pause className="mr-2 h-4 w-4" />
                  Stop Recording
                </Button>
              )}
            </>
          ) : (
            <>
              <Button variant="outline" onClick={resetRecording}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Record Again
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Video
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoRecorder;
