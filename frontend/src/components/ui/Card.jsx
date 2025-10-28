import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  ...props
}) => {
  const variants = {
    default: 'card-default',
    elevated: 'card-elevated',
    bordered: 'card-bordered',
    gradient: 'card-gradient'
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const baseClasses = [
    'card-base',
    variants[variant],
    paddings[padding],
    hover && 'card-hover',
    className
  ].filter(Boolean).join(' ');

  const motionProps = hover ? {
    whileHover: { y: -4, transition: { duration: 0.2 } },
    transition: { type: "spring", stiffness: 300, damping: 30 }
  } : {};

  return (
    <motion.div
      className={baseClasses}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`card-header ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={`card-content ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`card-footer ${className}`} {...props}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
