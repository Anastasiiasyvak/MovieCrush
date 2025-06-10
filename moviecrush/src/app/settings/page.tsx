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
  const [avatarPreview, setAvatarPreview] = useState<string>(''); 
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [emailConfirmation, setEmailConfirmation] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState('');
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
          setCurrentUserEmail(user.email);
          setAvatarPreview(user.photo || '');
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

      const updatedUser = {
        nickname: username,
        photo: avatarPreview,
      };

      const updateResponse = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (updateResponse.ok) {
        alert('Profile updated successfully!');
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

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    if (emailConfirmation !== currentUserEmail) {
      alert('Email does not match. Please enter your correct email.');
      return;
    }

    try {
      const response = await fetch(`/api/users/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUserEmail }),
      });

      if (response.ok) {
        localStorage.removeItem('userId');
        router.push('/');
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete account. Please try again.');
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
    setEmailConfirmation('');
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
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Avatar preview"
                  width={150}
                  height={150}
                  className={styles.avatarPreview}
                />
              ) : (
                <div className={styles.avatarPlaceholder}></div>
              )}
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

          <button 
            onClick={handleLogout} 
            className={styles.logoutButton}
          >
            Log Out
          </button>
        </div>
      </div>

      {showLogoutModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Confirm Account Deletion</h3>
            <p className={styles.modalText}>
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <p className={styles.modalText}>
              Please enter your email to confirm:
            </p>
            <input
              type="email"
              value={emailConfirmation}
              onChange={(e) => setEmailConfirmation(e.target.value)}
              placeholder="Enter your email"
              className={styles.modalInput}
            />
            <div className={styles.modalButtons}>
              <button onClick={cancelLogout} className={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={confirmLogout} className={styles.confirmButton}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer defaultSelected="Profile" />
    </div>
  );
}