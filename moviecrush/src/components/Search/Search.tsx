'use client';

import { useState, ChangeEvent, useEffect, useCallback } from 'react';
import styles from './Search.module.css';

interface SearchProps {
  placeholder?: string;
  onSearch: (query: string) => Promise<void>;
}

export default function Search({
  placeholder = 'Search movie by name',
  onSearch
}: SearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Debounce функція
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  // Використовуємо debounce з затримкою 500мс
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Викликаємо пошук тільки коли debouncedSearchQuery змінюється
  useEffect(() => {
    if (debouncedSearchQuery) {
      onSearch(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, onSearch]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Якщо інпут порожній, одразу очищаємо результати
    if (!query.trim()) {
      onSearch('');
    }
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchIcon}>
        <svg 
          xmlns='http://www.w3.org/2000/svg' 
          width='20' 
          height='20' 
          viewBox='0 0 24 24' 
          fill='none' 
          stroke='#FFE566' 
          strokeWidth='2' 
          strokeLinecap='round' 
          strokeLinejoin='round'
        >
          <circle cx='11' cy='11' r='8'></circle>
          <line x1='21' y1='21' x2='16.65' y2='16.65'></line>
        </svg>
      </div>
      <input
        type='text'
        className={styles.searchInput}
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleInputChange}
      />
    </div>
  );
}