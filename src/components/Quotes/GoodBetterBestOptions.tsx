import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, TrendingUp } from 'lucide-react';
import { QuoteItem } from '@/types';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface OptionTier {
  id: string;
  name: string;
  description: string;
  price: number;
  items: QuoteItem[];
  recommended?: boolean;
}

interface GoodBetterBestOptionsProps {
  onSelectTier: (tier: OptionTier) => void;
  selectedTier?: string;
}

const GoodBetterBestOptions: React.FC<GoodBetterBestOptionsProps> = ({ 
  onSelectTier, 
  selectedTier 
}) => {
  const [tiers] = useState<OptionTier[]>([
    {
      id: 'good',
      name: 'Good',
      description: 'Essential features and quality materials',
      price: 0,
      items: [],
    },
    {
      id: 'better',
      name: 'Better',
      description: 'Enhanced features with premium materials',
      price: 500,
      items: [],
      recommended: true,
    },
    {
      id: 'best',
      name: 'Best',
      description: 'Top-tier features with luxury materials',
      price: 1200,
      items: [],
    },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Good, Better, Best Options</h3>
        </div>
        <p className="text-sm text-gray-600">
          Offer choices without complicating the sale. Add clear pricing tiers and optional line items 
          so clients can pick the scope that fits their budget.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier) => (
          <motion.div
            key={tier.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
              selectedTier === tier.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300'
            }`}
            onClick={() => onSelectTier(tier)}
          >
            {tier.recommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Recommended
                </span>
              </div>
            )}

            <div className="text-center mb-4">
              <h4 className="text-xl font-bold text-gray-900 mb-1">{tier.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{tier.description}</p>
              {tier.price > 0 && (
                <div className="text-2xl font-bold text-primary-600">
                  +{formatCurrency(tier.price)}
                </div>
              )}
            </div>

            {selectedTier === tier.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4"
              >
                <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </motion.div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Quality materials</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Professional installation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Warranty included</span>
                </li>
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              Upselling without the awkward conversation
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Clients can easily compare options and choose what works for their budget.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GoodBetterBestOptions;



