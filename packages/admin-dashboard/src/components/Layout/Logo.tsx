import React from 'react';
import { motion } from 'framer-motion';
import { WorkeroLogo } from '../../assets';

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
        <img 
          src={WorkeroLogo} 
          alt="Workero Logo" 
          className={`${collapsed ? 'w-8 h-8' : 'w-32 h-8'} object-contain`}
        />
      </div>
      
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          {/* <p className="text-xs text-gray-500 -mt-1">Admin Dashboard</p> */}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Logo;
