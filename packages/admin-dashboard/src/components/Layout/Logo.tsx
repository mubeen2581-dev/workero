import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  collapsed?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ collapsed = false, className = '' }) => {
  return (
    <motion.div
      className={`flex items-center space-x-3 ${className}`}
      initial={false}
      animate={{ width: collapsed ? 'auto' : 'auto' }}
    >
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-lg">W</span>
        </div>
      </div>
      
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <h1 className="text-xl font-bold text-gray-900">Workero</h1>
          <p className="text-xs text-gray-500 -mt-1">Admin Dashboard</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Logo;
