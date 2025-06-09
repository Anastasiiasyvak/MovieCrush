'use client';

import { useState } from 'react';
import styles from './ButtonWatch.module.css';

type ButtonWatchProps = {
  initialState?: boolean;
  onClick?: (isWatched: boolean) => void;
};

export default function ButtonWatch({
  initialState = false,
  onClick
}: ButtonWatchProps) {
  const [isWatched, setIsWatched] = useState(initialState);
  
  const handleClick = () => {
    const newState = !isWatched;
    setIsWatched(newState);
    onClick?.(newState);
  };

  return (
    <button 
      className={`${styles.watchButton} ${isWatched ? styles.watched : ''}`}
      onClick={handleClick}
      aria-label={isWatched ? 'Mark as unwatched' : 'Mark as watched'}
    >
      {isWatched ? 'Watched' : 'Watch'}
    </button>
  );
}