import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClasses = 'input';
    const errorClasses = error ? 'border-error-300 focus:border-error-500 focus:ring-error-500' : '';
    const iconClasses = Icon ? 'pl-10' : '';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
              <Icon className="h-4 w-4 text-gray-400" />
            </div>
          )}
          
          <textarea
            ref={ref}
            className={`${baseClasses} ${errorClasses} ${iconClasses} ${className}`}
            {...props}
          />
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-error-600">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;

