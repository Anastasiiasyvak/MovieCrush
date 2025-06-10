'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './Score.module.css';
import grayStar from 'public/star.png';
import colorStar from 'public/colorstar.png';

type ScoreProps = {
  initialRating?: number;
  onChange?: (rating: number) => void;
  maxRating?: number;
};

export default function Score({
  initialRating = 0,
  onChange,
  maxRating = 10
}: ScoreProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  
  const handleClick = (selectedRating: number) => {
    setRating(selectedRating);
    onChange?.(selectedRating);
  };

  return (
    <div className={styles.scoreContainer}>
      {Array.from({ length: maxRating }, (_, i) => i + 1).map((starValue) => (
        <button 
          key={starValue}
          className={styles.starButton}
          onClick={() => handleClick(starValue)}
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
          aria-label={`Rate ${starValue} of ${maxRating} stars`}
        >
          <Image
            src={starValue <= (hoverRating || rating) ? colorStar : grayStar}
            alt={`${starValue} star`}
            className={styles.starImage}
            width={24} 
            height={24}
            unoptimized={true} 
          />
        </button>
      ))}
    </div>
  );
}