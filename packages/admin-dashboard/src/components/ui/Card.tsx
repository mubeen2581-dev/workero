import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  onClick,
}) => {
  const baseClasses = 'card bg-white rounded-2xl shadow-soft border border-gray-100';
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverClasses = hover ? 'card-hover cursor-pointer' : '';

  const classes = `${baseClasses} ${paddingClasses[padding]} ${hoverClasses} ${className}`;

  const CardComponent = onClick ? motion.div : 'div';
  const motionProps = onClick ? {
    whileHover: { y: -2, transition: { duration: 0.2 } },
    whileTap: { y: 0, transition: { duration: 0.1 } },
    onClick,
  } : {};

  return (
    <CardComponent className={classes} {...motionProps}>
      {children}
    </CardComponent>
  );
};

export default Card;
