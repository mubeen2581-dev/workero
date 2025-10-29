import React from 'react';
import { motion } from 'framer-motion';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}

interface TableHeaderCellProps {
  children: React.ReactNode;
  className?: string;
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

const Table: React.FC<TableProps> = ({ children, className = '' }) => {
  return (
    <div className={`overflow-hidden rounded-2xl border border-gray-200 bg-white ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {children}
        </table>
      </div>
    </div>
  );
};

const TableHeader: React.FC<TableHeaderProps> = ({ children, className = '' }) => {
  return (
    <thead className={`bg-gray-50 ${className}`}>
      {children}
    </thead>
  );
};

const TableBody: React.FC<TableBodyProps> = ({ children, className = '' }) => {
  return (
    <tbody className={`divide-y divide-gray-200 bg-white ${className}`}>
      {children}
    </tbody>
  );
};

const TableRow: React.FC<TableRowProps> = ({ 
  children, 
  className = '', 
  onClick, 
  hover = true 
}) => {
  const baseClasses = 'transition-colors duration-150';
  const hoverClasses = hover ? 'hover:bg-gray-50' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <motion.tr
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
      whileHover={onClick ? { backgroundColor: '#f9fafb' } : undefined}
    >
      {children}
    </motion.tr>
  );
};

const TableCell: React.FC<TableCellProps> = ({ 
  children, 
  className = '', 
  colSpan 
}) => {
  return (
    <td 
      className={`px-6 py-4 text-sm text-gray-900 ${className}`}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
};

const TableHeaderCell: React.FC<TableHeaderCellProps> = ({ 
  children, 
  className = '', 
  sortable = false, 
  sortDirection, 
  onSort 
}) => {
  const handleClick = () => {
    if (sortable && onSort) {
      onSort();
    }
  };

  const getSortIcon = () => {
    if (!sortable) return null;
    
    if (sortDirection === 'asc') {
      return (
        <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      );
    }
    
    if (sortDirection === 'desc') {
      return (
        <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      );
    }
    
    return (
      <svg className="w-4 h-4 ml-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <th 
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
        sortable ? 'cursor-pointer hover:text-gray-700' : ''
      } ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-center">
        {children}
        {getSortIcon()}
      </div>
    </th>
  );
};

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
};
