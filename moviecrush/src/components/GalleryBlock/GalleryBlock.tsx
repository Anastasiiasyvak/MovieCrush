'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './GalleryBlock.module.css';
import { getTMDBImages } from '@/services/tmdbAPI';

export default function GalleryBlock({ tmdbId }: { tmdbId: number }) {
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        getTMDBImages(tmdbId).then(setImages);
    }, [tmdbId]);

    if (!images.length) return null;

    return (
        <section className={styles.gallery}>
            <div className={styles.scroller}>
                {images.map((src) => (
                    <div key={src} className={styles.imgWrap}>
                        {}
                        <Image
                            src={src}
                            alt="Movie still"
                            fill
                            sizes="(max-width: 768px) 70vw, (max-width: 1200px) 30vw, 25vw"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
