import React, { useState } from 'react';
import styles from './ListButtons.module.css';

type ButtonOption = 'Favorite' | 'Watchlist' | 'Watched';

interface ListButtonsProps {
    defaultSelected?: ButtonOption;
    onSelectionChange?: (selected: ButtonOption) => void;
    className?: string;
}

export const ListButtons: React.FC<ListButtonsProps> = ({
                                                            defaultSelected = 'Favorite',
                                                            onSelectionChange,
                                                            className = '',
                                                        }) => {
    const [selected, setSelected] = useState<ButtonOption>(defaultSelected);

    const handleClick = (option: ButtonOption) => {
        setSelected(option);
        if (onSelectionChange) {
            onSelectionChange(option);
        }
    };

    return (
        <div className={`${styles.listButtonsContainer} ${className}`}>
            {['Favorite', 'Watchlist', 'Watched'].map((option) => (
                <button
                    key={option}
                    className={`${styles.listButton} ${selected === option ? styles.selected : ''}`}
                    onClick={() => handleClick(option as ButtonOption)}
                >
                    {option}
                </button>
            ))}
        </div>
    );
};
