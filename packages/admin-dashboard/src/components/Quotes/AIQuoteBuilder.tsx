import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lightbulb, Plus, Check } from 'lucide-react';
import { QuoteItem } from '@/types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { mockAISuggestions, generateAISuggestions } from '@/mocks/quotes';

interface AIQuoteBuilderProps {
  onAddItems: (items: QuoteItem[]) => void;
  className?: string;
}

const AIQuoteBuilder: React.FC<AIQuoteBuilderProps> = ({ onAddItems, className = '' }) => {
  const [description, setDescription] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());

  const handleGenerateSuggestions = async () => {
    if (!description.trim()) return;

    setIsGenerating(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const aiSuggestions = generateAISuggestions(description);
    setSuggestions(aiSuggestions);
    setIsGenerating(false);
  };

  const handleSuggestionToggle = (suggestionId: string) => {
    const newSelected = new Set(selectedSuggestions);
    if (newSelected.has(suggestionId)) {
      newSelected.delete(suggestionId);
    } else {
      newSelected.add(suggestionId);
    }
    setSelectedSuggestions(newSelected);
  };

  const handleAddSelectedItems = () => {
    const itemsToAdd: QuoteItem[] = [];
    
    suggestions.forEach(suggestion => {
      if (selectedSuggestions.has(suggestion.id)) {
        suggestion.items.forEach((item: any) => {
          itemsToAdd.push({
            id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            description: item.name,
            quantity: 1,
            unitPrice: item.price,
            taxRate: 8.5,
            lineTotal: item.price * 1.085,
          });
        });
      }
    });

    if (itemsToAdd.length > 0) {
      onAddItems(itemsToAdd);
      setSelectedSuggestions(new Set());
      setDescription('');
      setSuggestions([]);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">AI Quote Builder</h3>
        </div>

        <div className="space-y-4">
          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your project
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Kitchen renovation with custom cabinets, granite countertops, and stainless steel appliances..."
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              rows={3}
            />
          </div>

          {/* Generate Button */}
          <Button
            variant="primary"
            onClick={handleGenerateSuggestions}
            loading={isGenerating}
            disabled={!description.trim()}
            className="w-full"
            icon={Lightbulb}
          >
            {isGenerating ? 'Generating Suggestions...' : 'Generate AI Suggestions'}
          </Button>

          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">AI Suggestions</h4>
                <span className="text-xs text-gray-500">
                  {selectedSuggestions.size} selected
                </span>
              </div>

              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-medium text-gray-900">{suggestion.title}</h5>
                    <button
                      onClick={() => handleSuggestionToggle(suggestion.id)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        selectedSuggestions.has(suggestion.id)
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {selectedSuggestions.has(suggestion.id) ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Plus className="w-3 h-3" />
                      )}
                      <span>
                        {selectedSuggestions.has(suggestion.id) ? 'Selected' : 'Select All'}
                      </span>
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3">{suggestion.description}</p>
                  
                  <div className="space-y-2">
                    {suggestion.items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.reason}</p>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(item.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Add Selected Items Button */}
              {selectedSuggestions.size > 0 && (
                <Button
                  variant="primary"
                  onClick={handleAddSelectedItems}
                  className="w-full"
                  icon={Plus}
                >
                  Add {selectedSuggestions.size} Selected Items
                </Button>
              )}
            </div>
          )}

          {/* Quick Templates */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Templates</h4>
            <div className="grid grid-cols-1 gap-2">
              {[
                { name: 'Kitchen Renovation', description: 'Complete kitchen remodel' },
                { name: 'Bathroom Remodel', description: 'Full bathroom renovation' },
                { name: 'Electrical Upgrade', description: 'Panel and outlet upgrade' },
              ].map((template) => (
                <button
                  key={template.name}
                  onClick={() => setDescription(template.description)}
                  className="text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <p className="text-sm font-medium text-gray-900">{template.name}</p>
                  <p className="text-xs text-gray-500">{template.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AIQuoteBuilder;
