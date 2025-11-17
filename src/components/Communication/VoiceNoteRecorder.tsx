import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Play, Pause, Trash2, Send, Volume2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface VoiceNote {
  id: string;
  audioBlob: Blob;
  audioUrl: string;
  duration: number;
  transcription?: string;
  createdAt: string;
}

interface VoiceNoteRecorderProps {
  onSendVoiceNote: (voiceNote: VoiceNote) => void;
  enableTranscription?: boolean;
  className?: string;
}

const VoiceNoteRecorder: React.FC<VoiceNoteRecorderProps> = ({
  onSendVoiceNote,
  enableTranscription = true,
  className = '',
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState<VoiceNote[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    return () => {
      // Cleanup
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const voiceNote: VoiceNote = {
          id: `voice_${Date.now()}`,
          audioBlob,
          audioUrl,
          duration: recordingTime,
          createdAt: new Date().toISOString(),
        };

        // Mock transcription
        if (enableTranscription) {
          setIsTranscribing(true);
          setTimeout(() => {
            voiceNote.transcription = generateMockTranscription(recordingTime);
            setIsTranscribing(false);
            setRecordedNotes([...recordedNotes, voiceNote]);
          }, 2000);
        } else {
          setRecordedNotes([...recordedNotes, voiceNote]);
        }

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const generateMockTranscription = (duration: number): string => {
    const transcriptions = [
      "Hi, I wanted to follow up on the quote we discussed earlier. Please let me know if you have any questions.",
      "The job is scheduled for tomorrow at 2 PM. I'll send you a confirmation shortly.",
      "Thank you for your payment. The work has been completed successfully.",
      "I'm currently on-site and will need about 2 more hours to finish the installation.",
      "The materials have arrived and we can start the project as planned next week."
    ];
    
    return transcriptions[Math.floor(Math.random() * transcriptions.length)];
  };

  const playAudio = (voiceNote: VoiceNote) => {
    // Stop any currently playing audio
    Object.values(audioRefs.current).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });

    if (playingId === voiceNote.id) {
      setPlayingId(null);
      return;
    }

    const audio = new Audio(voiceNote.audioUrl);
    audioRefs.current[voiceNote.id] = audio;
    
    audio.onended = () => {
      setPlayingId(null);
    };

    audio.play();
    setPlayingId(voiceNote.id);
  };

  const deleteVoiceNote = (id: string) => {
    setRecordedNotes(recordedNotes.filter(note => note.id !== id));
    if (audioRefs.current[id]) {
      audioRefs.current[id].pause();
      delete audioRefs.current[id];
    }
    if (playingId === id) {
      setPlayingId(null);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Voice Notes</h3>
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              {enableTranscription ? 'With transcription' : 'Audio only'}
            </span>
          </div>
        </div>

        {/* Recording Controls */}
        <div className="flex items-center justify-center space-x-4 p-6 bg-gray-50 rounded-lg">
          {!isRecording ? (
            <Button
              variant="primary"
              onClick={startRecording}
              icon={Mic}
              className="px-6 py-3"
            >
              Start Recording
            </Button>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-red-600">
                  Recording: {formatDuration(recordingTime)}
                </span>
              </div>
              <Button
                variant="secondary"
                onClick={stopRecording}
                icon={Square}
              >
                Stop
              </Button>
            </div>
          )}
        </div>

        {/* Transcription Status */}
        {isTranscribing && (
          <div className="flex items-center justify-center space-x-2 p-3 bg-blue-50 rounded-lg">
            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span className="text-sm text-blue-600">Transcribing audio...</span>
          </div>
        )}

        {/* Recorded Notes */}
        {recordedNotes.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Recorded Notes</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recordedNotes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => playAudio(note)}
                        icon={playingId === note.id ? Pause : Play}
                        className="p-1"
                      />
                      <span className="text-sm text-gray-600">
                        {formatDuration(note.duration)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(note.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onSendVoiceNote(note)}
                        icon={Send}
                        className="text-xs px-2 py-1"
                      >
                        Send
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteVoiceNote(note.id)}
                        icon={Trash2}
                        className="p-1 text-red-600 hover:text-red-700"
                      />
                    </div>
                  </div>
                  
                  {note.transcription && (
                    <div className="mt-2 p-2 bg-gray-100 rounded text-sm text-gray-700">
                      <strong>Transcription:</strong> {note.transcription}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs text-gray-500 text-center">
          <p>Click the microphone to start recording. Voice notes will be automatically transcribed.</p>
        </div>
      </div>
    </Card>
  );
};

export default VoiceNoteRecorder;