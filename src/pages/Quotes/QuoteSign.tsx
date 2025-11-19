import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useQuote, useSignQuote, useDeclineQuote } from '@/services/quoteQueries';
import QuoteESign from '@/components/Quotes/QuoteESign';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Quote } from '@/types';

const QuoteSign: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: quote, isLoading } = useQuote(id);
  const signMutation = useSignQuote();
  const declineMutation = useDeclineQuote();

  const handleSign = async (signatureData: string) => {
    if (!id) return;
    
    await signMutation.mutateAsync({
      id,
      signatureData,
      signatureType: 'electronic',
    });

    // Navigate to success page or quote detail
    setTimeout(() => {
      navigate(`/quotes/${id}`);
    }, 2000);
  };

  const handleDecline = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to decline this quote?')) {
      await declineMutation.mutateAsync(id);
      navigate('/quotes');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quote...</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quote Not Found</h2>
          <p className="text-gray-600 mb-6">The quote you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/quotes')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quotes
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Review & Sign Quote</h1>
            <p className="text-gray-600 mt-2">
              Quote #{quote.id.substring(0, 8)} for {quote.client?.name || 'Client'}
            </p>
          </div>

          <QuoteESign
            quote={quote as Quote}
            onSign={handleSign}
            onDecline={handleDecline}
            isLoading={signMutation.isPending || declineMutation.isPending}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default QuoteSign;


