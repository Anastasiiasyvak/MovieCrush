'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Logo } from '@/components/Logo/Logo';
import { Footer } from '@/components/Footer/Footer';
import styles from './settings.module.css';

interface UserProfile {
  id: string;
  nickname: string;
  photo: string;
  email: string;
  favorite: string[];
  watched: string[];
  watchlist: string[];
}

export default function SettingsPage() {
  const [username, setUsername] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string>('/api/placeholder/150/150');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/users');
        const users = await response.json();
        const user = users.find((u: UserProfile) => u.id === userId);

        if (user) {
          setUsername(user.nickname);
          setAvatarPreview(user.photo || '/api/placeholder/150/150');
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

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
    try {
      setSaving(true);
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      // Отримуємо поточні дані користувача
      const response = await fetch('/api/users');
      const users = await response.json();
      const currentUser = users.find((u: UserProfile) => u.id === userId);

      if (!currentUser) {
        throw new Error('User not found');
      }

      const updatedUser = {
        ...currentUser,
        nickname: username,
        photo: avatarPreview,
      };

      const updateResponse = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (updateResponse.ok) {
        router.push('/profile');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => {
    router.push('/profile');
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.settingsPage}>
          <div className={styles.header}>
            <Logo />
          </div>
          <div style={{ color: '#FFE566', textAlign: 'center', marginTop: '2rem' }}>
            Loading...
          </div>
        </div>
        <Footer defaultSelected="Profile" />
      </div>
    );
  }

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
                width={150}
                height={150}
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

          <button 
            onClick={saveProfile} 
            className={styles.saveButton}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
      <Footer defaultSelected="Profile" />
    </div>
  );
}