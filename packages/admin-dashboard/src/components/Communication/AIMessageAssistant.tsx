import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Lightbulb, Wand2, MessageCircle, Copy, Check } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface AISuggestion {
  id: string;
  type: 'reply' | 'tone' | 'template' | 'followup';
  content: string;
  confidence: number;
  reasoning: string;
}

interface AIMessageAssistantProps {
  currentMessage?: string;
  conversationContext?: string[];
  onApplySuggestion: (suggestion: string) => void;
  className?: string;
}

const AIMessageAssistant: React.FC<AIMessageAssistantProps> = ({
  currentMessage = '',
  conversationContext = [],
  onApplySuggestion,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Mock AI suggestions based on context
  const generateSuggestions = (): AISuggestion[] => {
    const suggestions: AISuggestion[] = [];

    // Auto-reply suggestions
    if (conversationContext.some(msg => msg.toLowerCase().includes('quote'))) {
      suggestions.push({
        id: 'reply_1',
        type: 'reply',
        content: 'Thank you for your interest! I\'ll prepare a detailed quote for you within 24 hours. Could you please provide more details about the scope of work?',
        confidence: 0.92,
        reasoning: 'Customer mentioned quote - professional response with next steps'
      });
    }

    if (conversationContext.some(msg => msg.toLowerCase().includes('urgent'))) {
      suggestions.push({
        id: 'reply_2',
        type: 'reply',
        content: 'I understand this is urgent. Let me prioritize your request and get back to you within 2 hours with available options.',
        confidence: 0.88,
        reasoning: 'Customer indicated urgency - empathetic and time-specific response'
      });
    }

    // Tone refinement
    if (currentMessage.length > 0) {
      suggestions.push({
        id: 'tone_1',
        type: 'tone',
        content: makeMoreProfessional(currentMessage),
        confidence: 0.85,
        reasoning: 'More professional tone while maintaining friendliness'
      });

      suggestions.push({
        id: 'tone_2',
        type: 'tone',
        content: makeMoreFriendly(currentMessage),
        confidence: 0.80,
        reasoning: 'Warmer, more approachable tone'
      });
    }

    // Follow-up suggestions
    suggestions.push({
      id: 'followup_1',
      type: 'followup',
      content: 'Is there anything else I can help you with today?',
      confidence: 0.75,
      reasoning: 'Standard professional follow-up'
    });

    return suggestions;
  };

  const makeMoreProfessional = (text: string): string => {
    return text
      .replace(/hey/gi, 'Hello')
      .replace(/yeah/gi, 'Yes')
      .replace(/ok/gi, 'Certainly')
      .replace(/thanks/gi, 'Thank you');
  };

  const makeMoreFriendly = (text: string): string => {
    if (!text.includes('!') && !text.includes('?')) {
      return text + ' 😊';
    }
    return text.replace(/\./g, '!');
  };

  const suggestions = generateSuggestions();

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'reply': return <MessageCircle className="w-4 h-4" />;
      case 'tone': return <Wand2 className="w-4 h-4" />;
      case 'template': return <Lightbulb className="w-4 h-4" />;
      case 'followup': return <Bot className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'reply': return 'bg-blue-100 text-blue-800';
      case 'tone': return 'bg-purple-100 text-purple-800';
      case 'template': return 'bg-yellow-100 text-yellow-800';
      case 'followup': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCopy = (suggestion: AISuggestion) => {
    navigator.clipboard.writeText(suggestion.content);
    setCopiedId(suggestion.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApply = (suggestion: AISuggestion) => {
    onApplySuggestion(suggestion.content);
  };

  return (
    <Card className={`${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>

        {suggestions.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Start typing or continue the conversation to get AI suggestions</p>
          </div>
        ) : (
          <div className={`space-y-3 ${isExpanded ? 'max-h-96 overflow-y-auto' : 'max-h-48 overflow-hidden'}`}>
            {suggestions.map((suggestion) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getSuggestionIcon(suggestion.type)}
                    <span className={`px-2 py-1 text-xs rounded-full ${getSuggestionColor(suggestion.type)}`}>
                      {suggestion.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {Math.round(suggestion.confidence * 100)}% confidence
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(suggestion)}
                      className="p-1"
                    >
                      {copiedId === suggestion.id ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApply(suggestion)}
                      className="text-xs px-2 py-1"
                    >
                      Use
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-900 mb-2">{suggestion.content}</p>
                
                <p className="text-xs text-gray-500 italic">{suggestion.reasoning}</p>
              </motion.div>
            ))}
          </div>
        )}

        {suggestions.length > 3 && !isExpanded && (
          <div className="text-center mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="text-primary-600"
            >
              Show {suggestions.length - 3} more suggestions
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AIMessageAssistant;