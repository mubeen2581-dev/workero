import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Check, Image as ImageIcon } from 'lucide-react';
import { QuoteItem } from '@/types';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface MaterialOption {
  id: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  priceDifference: number;
}

interface MaterialChoicesProps {
  item: QuoteItem;
  onMaterialChange: (itemId: string, materialId: string, newPrice: number) => void;
}

const MaterialChoices: React.FC<MaterialChoicesProps> = ({ item, onMaterialChange }) => {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(
    item.materialChoiceId || null
  );

  // Default material options - in real app, this would come from props or API
  const [materialOptions] = useState<MaterialOption[]>(
    item.materialOptions || [
      {
        id: 'material-1',
        name: 'Quartz Countertop',
        description: 'Engineered stone made from natural quartz and resins',
        price: item.unitPrice,
        priceDifference: 0,
      },
      {
        id: 'material-2',
        name: 'Marble Countertop',
        description: 'A luxurious natural stone with veining patterns',
        price: item.unitPrice + 500,
        priceDifference: 500,
      },
      {
        id: 'material-3',
        name: 'Granite Countertop',
        description: 'Durable natural stone with unique patterns',
        price: item.unitPrice + 300,
        priceDifference: 300,
      },
    ]
  );

  useEffect(() => {
    if (item.materialOptions) {
      // Update material options from item
    }
  }, [item.materialOptions]);

  const handleMaterialSelect = (material: MaterialOption) => {
    setSelectedMaterial(material.id);
    const newLineTotal = (material.price * item.quantity) * (1 + (item.taxRate / 100));
    onMaterialChange(item.id, material.id, newLineTotal);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!item.materialOptions || item.materialOptions.length === 0) {
    return null;
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-primary-600" />
        <h4 className="font-semibold text-gray-900">Material Choices</h4>
      </div>

      <div className="space-y-3">
        {materialOptions.map((material) => (
          <motion.div
            key={material.id}
            whileHover={{ scale: 1.01 }}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedMaterial === material.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300'
            }`}
            onClick={() => handleMaterialSelect(material)}
          >
            <div className="flex items-start gap-4">
              {/* Material Image Placeholder */}
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                {material.image ? (
                  <img 
                    src={material.image} 
                    alt={material.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h5 className="font-semibold text-gray-900 flex items-center gap-2">
                      {material.name}
                      {selectedMaterial === material.id && (
                        <Check className="w-4 h-4 text-primary-600" />
                      )}
                    </h5>
                    <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                  </div>
                  <div className="text-right">
                    {material.priceDifference > 0 ? (
                      <div>
                        <div className="text-sm font-semibold text-primary-600">
                          +{formatCurrency(material.priceDifference)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatCurrency(material.price)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(material.price)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedMaterial && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200"
        >
          <p className="text-sm text-green-800">
            <strong>Selected:</strong> {materialOptions.find(m => m.id === selectedMaterial)?.name}
            {' - '}
            Total: {formatCurrency(
              (materialOptions.find(m => m.id === selectedMaterial)?.price || 0) * item.quantity
            )}
          </p>
        </motion.div>
      )}
    </Card>
  );
};

export default MaterialChoices;



