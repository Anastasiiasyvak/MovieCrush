'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './ActorAd.module.css';

export default function ActorRedirect({ params }: { params: { actorId: string } }) {
    const [seconds, setSeconds] = useState(5);
    const router = useRouter();

    /* таймер ↓ */
    useEffect(() => {
        const t = setInterval(() => {
            setSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(t);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, []);

    /* переход к актёру ↓ */
    const goToActor = () => router.replace(`/actor/${params.actorId}`);

    return (
        <div className={styles.adContainer}>
            {/* стрелка «назад» */}
            <div className={styles.backIconContainer} onClick={() => router.back()}>
                <Image src="/back.png" alt="Back" width={24} height={24} className={styles.backIcon} />
            </div>

            {/* кликабельный баннер */}
            <a
                href="https://putivnyk-it.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.bannerLink}
            >
                <img src="/ad-banner.jpg" alt="Advertisement" className={styles.adImage} />
            </a>

            <p className={styles.countdownText}>
                Redirect available in: <strong>{seconds}</strong> sec.
            </p>

            <button
                disabled={seconds > 0}
                onClick={goToActor}
                className={styles.goButton}
            >
                Go to Actor Page
            </button>
        </div>
    );
}
