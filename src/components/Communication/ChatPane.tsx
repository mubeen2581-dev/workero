import React, { useEffect, useRef, useState } from 'react';
import { Bot, FileText, Paperclip, Mic, Send } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import MessageTemplateSelector from './MessageTemplateSelector';
import AIMessageAssistant from './AIMessageAssistant';
import FileShareComponent from './FileShareComponent';
import VoiceNoteRecorder from './VoiceNoteRecorder';
import { Message, ConversationThread } from '@/mocks/messages';
import { MessagesService } from '@/services/messages';
import { toast } from 'react-toastify';

interface ChatPaneProps {
  messages: Message[];
  onSend: (text: string) => void;
  className?: string;
  selectedThread?: ConversationThread;
}

const ChatPane: React.FC<ChatPaneProps> = ({ messages, onSend, className = '', selectedThread }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const text = inputRef.current?.value?.trim();
    if (text) {
      onSend(text);
      if (inputRef.current) {
        inputRef.current.value = '';
        setCurrentMessage('');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTemplateSelect = (template: any) => {
    if (inputRef.current) {
      inputRef.current.value = template.content;
      setCurrentMessage(template.content);
    }
    setShowTemplates(false);
  };

  const handleAISuggestion = (suggestion: string) => {
    if (inputRef.current) {
      inputRef.current.value = suggestion;
      setCurrentMessage(suggestion);
    }
  };

  const handleFileSelect = (files: any[]) => {
    // Files are auto-uploaded by FileShareComponent
    console.log('Files selected:', files);
  };

  const handleSendFile = async (file: any, message?: string) => {
    if (!selectedThread) {
      toast.error('Please select a conversation first');
      return;
    }

    try {
      // If file has been uploaded, send message with attachment reference
      if (file.uploaded && file.file) {
        await MessagesService.sendMessage({
          conversation_id: selectedThread.id,
          receiver_id: selectedThread.participantId || '',
          receiver_type: 'App\Models\User', // TODO: Determine from thread
          content: message || `📎 ${file.name}`,
          type: file.type?.startsWith('image/') ? 'image' : 'file',
          attachments: [file.file],
        });
        toast.success('File sent successfully');
      } else {
        // If not uploaded yet, just send text message
        if (message) {
          onSend(message);
        }
        onSend(`📎 Sending file: ${file.name}...`);
      }
    } catch (error: any) {
      toast.error(`Failed to send file: ${error.message || 'Unknown error'}`);
    }
  };

  const handleSendVoiceNote = (voiceNote: any) => {
    console.log('Sending voice note:', voiceNote);
    const message = voiceNote.transcription 
      ? `🎤 Voice note: "${voiceNote.transcription}"`
      : `🎤 Voice note (${Math.floor(voiceNote.duration)}s)`;
    onSend(message);
  };

  const conversationContext = messages.map(m => m.content).slice(-5);

  return (
    <div className={`relative flex flex-col ${className}`}>
      {/* Main Chat */}
      <Card className="flex flex-col h-full p-0">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedThread && (
                <>
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {selectedThread.title?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{selectedThread.title || 'Conversation'}</h3>
                    <p className="text-xs text-gray-600">WhatsApp Business</p>
                  </div>
                </>
              )}
              {!selectedThread && (
                <h3 className="text-lg font-semibold text-gray-900">Chat</h3>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="md"
                onClick={() => {
                  const newState = !showTemplates;
                  setShowTemplates(newState);
                  if (newState) {
                    setShowAI(false);
                    setShowFiles(false);
                    setShowVoice(false);
                  }
                }}
                icon={FileText}
                className={showTemplates ? '' : ''}
                style={showTemplates ? { backgroundColor: '#F3F0FF', color: '#8552C5' } : {}}
              >
                <span className="sr-only">Templates</span>
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => {
                  const newState = !showAI;
                  setShowAI(newState);
                  if (newState) {
                    setShowTemplates(false);
                    setShowFiles(false);
                    setShowVoice(false);
                  }
                }}
                icon={Bot}
                className={showAI ? '' : ''}
                style={showAI ? { backgroundColor: '#F3F0FF', color: '#8552C5' } : {}}
              >
                <span className="sr-only">AI Assistant</span>
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => {
                  const newState = !showFiles;
                  setShowFiles(newState);
                  if (newState) {
                    setShowTemplates(false);
                    setShowAI(false);
                    setShowVoice(false);
                  }
                }}
                icon={Paperclip}
                className={showFiles ? '' : ''}
                style={showFiles ? { backgroundColor: '#F3F0FF', color: '#8552C5' } : {}}
              >
                <span className="sr-only">Attach File</span>
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => {
                  const newState = !showVoice;
                  setShowVoice(newState);
                  if (newState) {
                    setShowTemplates(false);
                    setShowAI(false);
                    setShowFiles(false);
                  }
                }}
                icon={Mic}
                className={showVoice ? '' : ''}
                style={showVoice ? { backgroundColor: '#F3F0FF', color: '#8552C5' } : {}}
              >
                <span className="sr-only">Voice Note</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white min-h-0">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
                <p className="text-sm text-gray-600">Start the conversation by sending a message</p>
              </div>
            </div>
          ) : (
            messages.map((m) => {
              const isUser = m.senderId.startsWith('user-');
              return (
                <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 shadow-sm ${
                    isUser 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}>
                    {m.type === 'text' && <p className="text-sm leading-relaxed">{m.content}</p>}
                    {m.type === 'image' && (
                      <img 
                        src={m.metadata?.imageUrl} 
                        alt={m.metadata?.fileName || 'image'} 
                        className="rounded-lg max-w-full h-auto" 
                      />
                    )}
                    <div className={`mt-1.5 text-[10px] flex items-center justify-end gap-1 ${
                      isUser ? 'text-purple-100' : 'text-gray-500'
                    }`}>
                      {new Date(m.timestamp).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <input 
              ref={inputRef} 
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              placeholder="Type a message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handleSend} 
              icon={Send}
              className="px-4 py-2.5 rounded-xl"
            >
              <span className="hidden sm:inline">Send</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Side Panel Overlays */}
      {showTemplates && (
        <div className="absolute right-4 top-20 w-80 z-50">
          <MessageTemplateSelector onSelectTemplate={handleTemplateSelect} />
        </div>
      )}
      
      {showAI && (
        <div className="absolute right-4 top-20 w-80 z-50">
          <AIMessageAssistant
            currentMessage={currentMessage}
            conversationContext={conversationContext}
            onApplySuggestion={handleAISuggestion}
          />
        </div>
      )}
      
      {showFiles && (
        <div className="absolute right-4 top-20 w-80 z-50">
          <FileShareComponent
            onFileSelect={handleFileSelect}
            onSendFile={handleSendFile}
          />
        </div>
      )}
      
      {showVoice && (
        <div className="absolute right-4 top-20 w-80 z-50">
          <VoiceNoteRecorder onSendVoiceNote={handleSendVoiceNote} />
        </div>
      )}
    </div>
  );
};

export default ChatPane;


