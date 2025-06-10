'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './Footer.module.css';

type FooterOption = 'Recommendations' | 'Discover' | 'Profile';

interface FooterProps {
    defaultSelected?: FooterOption;
    onSelectionChange?: (selected: FooterOption) => void;
    className?: string;
}

export const Footer: React.FC<FooterProps> = ({
                                                  defaultSelected = 'Recommendations',
                                                  onSelectionChange,
                                                  className = '',
                                              }) => {
    const [selected, setSelected] = useState<FooterOption>(defaultSelected);
    const router = useRouter();

    const handleClick = (option: FooterOption) => {
        setSelected(option);

        switch (option) {
            case 'Recommendations':
                router.push('/recommendations');
                break;
            case 'Discover':
                router.push('/search');
                break;
            case 'Profile':
                router.push('/profile');
                break;
        }

        onSelectionChange?.(option);
    };

    const getIconPath = (option: FooterOption) => {
        switch (option) {
            case 'Recommendations':
                return '/recommendations.png';
            case 'Discover':
                return '/discover.png';
            case 'Profile':
                return '/profile.png';
        }
    };

    return (
        <div className={`${styles.footer} ${className}`}>
            <nav className={styles.nav}>
                {(['Recommendations', 'Discover', 'Profile'] as FooterOption[]).map((option) => (
                    <button
                        key={option}
                        className={`${styles.button} ${selected === option ? styles.selected : ''}`}
                        onClick={() => handleClick(option)}
                    >
                        <Image
                            src={getIconPath(option)}
                            alt={`${option} icon`}
                            className={styles.icon}
                            width={24}
                            height={24}
                        />
                        <span className={styles.text}>{option}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};
