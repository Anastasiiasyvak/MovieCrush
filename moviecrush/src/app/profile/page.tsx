'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Logo } from '@/components/Logo/Logo';
import { Footer } from '@/components/Footer/Footer';
import styles from './profile.module.css';

export default function ProfilePage() {
    const [username, setUsername] = useState('');
    const [avatarPreview, setAvatarPreview] = useState<string>('/api/placeholder/150/150');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const router = useRouter();

    useEffect(() => {
        const loadUser = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            const response = await fetch('/api/users');
            const users = await response.json();
            const user = users.find((u: any) => u.id === userId);

            if (user) {
                setUsername(user.nickname);
                setAvatarPreview(user.photo || '/placeholder.jpg');
            }
        };

        loadUser();
    }, []);

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            const file = files[0];
            setAvatarFile(file);

            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                setAvatarPreview(loadEvent.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const saveProfile = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        const updatedUser = {
            nickname: username,
            photo: avatarPreview,
        };

        await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUser),
        });

        router.push('/');
    };

    const goBack = () => {
        router.push('/');
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.settingsPage}>
                <div className={styles.header}>
                    <div className={styles.backIconContainer}>
                        <Image
                            src="/back.png"
                            alt="Back"
                            width={24}
                            height={24}
                            className={styles.backIcon}
                            onClick={goBack}
                        />
                    </div>
                    <Logo />
                </div>

                <h1 className={styles.pageTitle}>Profile Settings</h1>

                <div className={styles.settingsContent}>
                    <div className={styles.avatarSection}>
                        <h3 className={styles.sectionTitle}>Profile Picture</h3>
                        <div className={styles.avatarContainer}>
                            <Image
                                src={avatarPreview}
                                alt="Avatar preview"
                                width={100}
                                height={100}
                                className={styles.avatarPreview}
                            />
                            <label className={styles.avatarUploadButton}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className={styles.fileInput}
                                />
                                Upload Image
                            </label>
                        </div>
                    </div>

                    <div className={styles.usernameSection}>
                        <h3 className={styles.sectionTitle}>Username</h3>
                        <input
                            type="text"
                            value={username}
                            onChange={handleUsernameChange}
                            placeholder="Enter username"
                            className={styles.usernameInput}
                        />
                    </div>

                    <button onClick={saveProfile} className={styles.saveButton}>
                        Save Changes
                    </button>
                </div>
            </div>
            <Footer defaultSelected="Profile" />
        </div>
    );
}
