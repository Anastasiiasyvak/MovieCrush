'use client';

import { useState } from 'react';
import Image from 'next/image';
import heartImage from 'public/heart.png';
import styles from './ButtonHeart.module.css';

type ButtonHeartProps = {
  initialState?: boolean;
  onClick?: (isActive: boolean) => void;
};

export default function ButtonHeart({
  initialState = false,
  onClick
}: ButtonHeartProps) {
  const [isActive, setIsActive] = useState(initialState);
  
  const handleClick = () => {
    const newState = !isActive;
    setIsActive(newState);
    onClick?.(newState);
  };

  return (
    <button 
      className={styles.heartButton}
      onClick={handleClick}
      aria-label={isActive ? 'Unlike' : 'Like'}
    >
      <Image
        src={heartImage}
        alt="Heart icon"
        width={24}
        height={24}
        className={`${styles.heartImage} ${isActive ? styles.heartActive : ''}`}
      />
    </button>
  );
}