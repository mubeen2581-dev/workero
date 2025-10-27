import React, { useEffect, useRef, useState } from 'react';
import { Bot, FileText, Paperclip, Mic, Send } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import MessageTemplateSelector from './MessageTemplateSelector';
import AIMessageAssistant from './AIMessageAssistant';
import FileShareComponent from './FileShareComponent';
import VoiceNoteRecorder from './VoiceNoteRecorder';
import { Message } from '@/mocks/messages';

interface ChatPaneProps {
  messages: Message[];
  onSend: (text: string) => void;
  className?: string;
}

const ChatPane: React.FC<ChatPaneProps> = ({ messages, onSend, className = '' }) => {
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
    console.log('Files selected:', files);
  };

  const handleSendFile = (file: any, message?: string) => {
    console.log('Sending file:', file, message);
    if (message) {
      onSend(message);
    }
    // Mock file message
    onSend(`📎 Sent file: ${file.name}`);
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
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 ${className}`}>
      {/* Main Chat */}
      <Card className="lg:col-span-2">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Chat</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTemplates(!showTemplates)}
                icon={FileText}
                className={showTemplates ? 'bg-primary-100 text-primary-600' : ''}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAI(!showAI)}
                icon={Bot}
                className={showAI ? 'bg-primary-100 text-primary-600' : ''}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFiles(!showFiles)}
                icon={Paperclip}
                className={showFiles ? 'bg-primary-100 text-primary-600' : ''}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVoice(!showVoice)}
                icon={Mic}
                className={showVoice ? 'bg-primary-100 text-primary-600' : ''}
              />
            </div>
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.senderId.startsWith('user-') ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${
                m.senderId.startsWith('user-') ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-900'
              }`}>
                {m.type === 'text' && <p>{m.content}</p>}
                {m.type === 'image' && (
                  <img src={m.metadata?.imageUrl} alt={m.metadata?.fileName || 'image'} className="rounded-md" />
                )}
                <div className={`mt-1 text-[10px] ${m.senderId.startsWith('user-') ? 'text-primary-100' : 'text-gray-500'}`}>
                  {new Date(m.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="p-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <input 
              ref={inputRef} 
              className="input flex-1" 
              placeholder="Type a message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button variant="primary" size="sm" onClick={handleSend} icon={Send}>
              Send
            </Button>
          </div>
        </div>
      </Card>

      {/* Side Panel */}
      <div className="space-y-4">
        {showTemplates && (
          <MessageTemplateSelector onSelectTemplate={handleTemplateSelect} />
        )}
        
        {showAI && (
          <AIMessageAssistant
            currentMessage={currentMessage}
            conversationContext={conversationContext}
            onApplySuggestion={handleAISuggestion}
          />
        )}
        
        {showFiles && (
          <FileShareComponent
            onFileSelect={handleFileSelect}
            onSendFile={handleSendFile}
          />
        )}
        
        {showVoice && (
          <VoiceNoteRecorder onSendVoiceNote={handleSendVoiceNote} />
        )}
      </div>
    </div>
  );
};

export default ChatPane;


