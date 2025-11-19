import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lightbulb, Plus, Check, Zap, TrendingUp, Brain } from 'lucide-react';
import { QuoteItem } from '@/types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { toast } from 'react-toastify';

interface AIQuoteBuilderProps {
  onAddItems: (items: QuoteItem[]) => void;
  className?: string;
}

interface AISuggestion {
  id: string;
  title: string;
  description: string;
  confidence: number;
  items: Array<{
    name: string;
    description: string;
    price: number;
    reason: string;
    category: string;
    estimatedHours?: number;
    materialCost?: number;
    laborCost?: number;
  }>;
  totalEstimate: number;
  profitMargin: number;
}

const EnhancedAIQuoteBuilder: React.FC<AIQuoteBuilderProps> = ({ onAddItems, className = '' }) => {
  const [description, setDescription] = useState('');
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());
  const [smartPricing, setSmartPricing] = useState(true);

  const handleGenerateSuggestions = async () => {
    if (!description.trim()) {
      toast.error('Please describe your project');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI processing with realistic delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Enhanced AI suggestions with smart pricing
    const aiSuggestions = generateEnhancedAISuggestions(description, smartPricing);
    setSuggestions(aiSuggestions);
    setIsGenerating(false);
    toast.success(`Generated ${aiSuggestions.length} AI suggestions`);
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
            lineTotal: item.price,
            category: item.category,
          });
        });
      }
    });

    if (itemsToAdd.length > 0) {
      onAddItems(itemsToAdd);
      setSelectedSuggestions(new Set());
      setDescription('');
      setSuggestions([]);
      toast.success(`Added ${itemsToAdd.length} items to quote`);
    } else {
      toast.error('Please select at least one suggestion');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
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
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <Brain className="w-4 h-4 text-purple-400 absolute -top-1 -right-1" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI-Assisted Builder</h3>
              <p className="text-xs text-gray-600">Smart suggestions with live pricing</p>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={smartPricing}
              onChange={(e) => setSmartPricing(e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-xs text-gray-700">Smart Pricing</span>
          </label>
        </div>

        <div className="space-y-4">
          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your project in detail
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Complete kitchen renovation including custom cabinets, granite countertops, stainless steel appliances, new flooring, and electrical upgrades. Budget-conscious but quality materials..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              The more details you provide, the better our AI suggestions will be
            </p>
          </div>

          {/* Generate Button */}
          <Button
            variant="primary"
            onClick={handleGenerateSuggestions}
            loading={isGenerating}
            disabled={!description.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            icon={isGenerating ? undefined : Lightbulb}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-4 h-4" />
                </motion.div>
                Analyzing project...
              </span>
            ) : (
              'Generate AI Suggestions'
            )}
          </Button>

          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-900">AI-Generated Suggestions</h4>
                <span className="text-xs text-gray-500">
                  {selectedSuggestions.size} of {suggestions.length} selected
                </span>
              </div>

              {suggestions.map((suggestion) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border-2 rounded-xl p-4 transition-all ${
                    selectedSuggestions.has(suggestion.id)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="text-sm font-semibold text-gray-900">{suggestion.title}</h5>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                          {suggestion.confidence}% confidence
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{suggestion.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Est: {formatCurrency(suggestion.totalEstimate)}
                        </span>
                        <span>Margin: {suggestion.profitMargin}%</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSuggestionToggle(suggestion.id)}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        selectedSuggestions.has(suggestion.id)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {selectedSuggestions.has(suggestion.id) ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Selected</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3" />
                          <span>Select</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {suggestion.items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.reason}</p>
                          {item.estimatedHours && (
                            <p className="text-xs text-gray-400 mt-1">
                              Est. {item.estimatedHours}h • Mat: {formatCurrency(item.materialCost || 0)} • Lab: {formatCurrency(item.laborCost || 0)}
                            </p>
                          )}
                        </div>
                        <span className="text-sm font-bold text-gray-900 ml-2">
                          {formatCurrency(item.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Add Selected Items Button */}
              {selectedSuggestions.size > 0 && (
                <Button
                  variant="primary"
                  onClick={handleAddSelectedItems}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                  icon={Plus}
                >
                  Add {selectedSuggestions.size} Selected Package{selectedSuggestions.size > 1 ? 's' : ''} to Quote
                </Button>
              )}
            </div>
          )}

          {/* Quick Templates */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Start Templates</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { name: 'Kitchen Renovation', description: 'Complete kitchen remodel with appliances', icon: '🍳' },
                { name: 'Bathroom Remodel', description: 'Full bathroom renovation', icon: '🚿' },
                { name: 'Electrical Upgrade', description: 'Panel and outlet upgrade', icon: '⚡' },
                { name: 'Plumbing Work', description: 'Pipe replacement and fixtures', icon: '🔧' },
                { name: 'HVAC Installation', description: 'Heating and cooling system', icon: '❄️' },
                { name: 'Roofing Project', description: 'Roof repair or replacement', icon: '🏠' },
              ].map((template) => (
                <button
                  key={template.name}
                  onClick={() => setDescription(template.description)}
                  className="text-left p-3 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{template.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{template.name}</p>
                      <p className="text-xs text-gray-500">{template.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Enhanced AI suggestion generator
function generateEnhancedAISuggestions(description: string, smartPricing: boolean): AISuggestion[] {
  const lowerDesc = description.toLowerCase();
  
  const suggestions: AISuggestion[] = [];

  // Kitchen renovation suggestions
  if (lowerDesc.includes('kitchen')) {
    suggestions.push({
      id: 'kitchen-1',
      title: 'Complete Kitchen Package',
      description: 'Full kitchen renovation with premium materials and professional installation',
      confidence: 95,
      items: [
        {
          name: 'Custom Cabinet Installation',
          description: 'Custom-built cabinets with soft-close hinges',
          price: smartPricing ? 4500 : 5000,
          reason: 'Based on average kitchen size and quality materials',
          category: 'Labor',
          estimatedHours: 24,
          materialCost: 2500,
          laborCost: 2000,
        },
        {
          name: 'Granite Countertops',
          description: 'Premium granite with edge finishing',
          price: smartPricing ? 2800 : 3200,
          reason: 'Standard kitchen countertop area',
          category: 'Materials',
          estimatedHours: 8,
          materialCost: 2000,
          laborCost: 800,
        },
        {
          name: 'Stainless Steel Appliances',
          description: 'Complete appliance package (refrigerator, range, dishwasher)',
          price: smartPricing ? 3200 : 3500,
          reason: 'Mid-range appliance package',
          category: 'Materials',
          estimatedHours: 4,
          materialCost: 3000,
          laborCost: 200,
        },
        {
          name: 'Electrical Upgrades',
          description: 'New outlets, lighting, and GFCI protection',
          price: smartPricing ? 850 : 1000,
          reason: 'Standard kitchen electrical requirements',
          category: 'Labor',
          estimatedHours: 6,
          materialCost: 200,
          laborCost: 650,
        },
      ],
      totalEstimate: smartPricing ? 11350 : 12700,
      profitMargin: 25,
    });
  }

  // Bathroom suggestions
  if (lowerDesc.includes('bathroom')) {
    suggestions.push({
      id: 'bathroom-1',
      title: 'Bathroom Remodel Package',
      description: 'Complete bathroom renovation with modern fixtures',
      confidence: 92,
      items: [
        {
          name: 'Bathroom Fixtures',
          description: 'Toilet, sink, bathtub/shower combo',
          price: smartPricing ? 1800 : 2100,
          reason: 'Quality fixtures for standard bathroom',
          category: 'Materials',
          estimatedHours: 8,
          materialCost: 1200,
          laborCost: 600,
        },
        {
          name: 'Tile Installation',
          description: 'Floor and wall tiles with waterproofing',
          price: smartPricing ? 2200 : 2600,
          reason: 'Standard bathroom tile coverage',
          category: 'Labor',
          estimatedHours: 16,
          materialCost: 800,
          laborCost: 1400,
        },
      ],
      totalEstimate: smartPricing ? 4000 : 4700,
      profitMargin: 28,
    });
  }

  // If no specific match, provide general suggestions
  if (suggestions.length === 0) {
    suggestions.push({
      id: 'general-1',
      title: 'Project Estimate',
      description: 'Based on your description, here are recommended items',
      confidence: 75,
      items: [
        {
          name: 'Labor - General',
          description: 'Professional installation and work',
          price: smartPricing ? 1200 : 1500,
          reason: 'Estimated based on project scope',
          category: 'Labor',
          estimatedHours: 16,
          materialCost: 0,
          laborCost: 1200,
        },
        {
          name: 'Materials',
          description: 'Required materials for project',
          price: smartPricing ? 800 : 1000,
          reason: 'Standard material costs',
          category: 'Materials',
          estimatedHours: 0,
          materialCost: 800,
          laborCost: 0,
        },
      ],
      totalEstimate: smartPricing ? 2000 : 2500,
      profitMargin: 20,
    });
  }

  return suggestions;
}

export default EnhancedAIQuoteBuilder;


