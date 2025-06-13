'use client';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

const LoadingSpinner = ({ size = 24, color = 'currentColor' }: LoadingSpinnerProps) => {
  return (
    <motion.div
      className="inline-block"
      style={{
        width: size,
        height: size,
        border: `2px solid ${color}`,
        borderBottomColor: 'transparent',
        borderRadius: '50%',
      }}
      animate={{
        rotate: 360,
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};

export default LoadingSpinner; 