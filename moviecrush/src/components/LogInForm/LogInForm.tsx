'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './LogInForm.module.css';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        // Очищаємо помилку коли користувач починає вводити
        if (error) setError('');
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        // Очищаємо помилку коли користувач починає вводити
        if (error) setError('');
    };

    const validateForm = () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return false;
        }

        // Перевіряємо валідність email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Валідація форми
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/users');
            const users = await response.json();

            const found = users.find((u: any) => u.email === email && u.password === password);

            if (found) {
                // Зберігаємо ID користувача в localStorage
                localStorage.setItem('userId', found.id);
                
                // Перенаправляємо на сторінку пошуку
                router.push('/search');
            } else {
                setError('Invalid email or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred during login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div style={{ minHeight: '20px' }}>
                {error && <p className={styles.error}>{error}</p>}
            </div>
            <input
                value={email}
                onChange={handleEmailChange}
                name="email"
                type="email"
                placeholder="Email"
                required
                disabled={isLoading}
            />
            <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                name="password"
                placeholder="Password"
                required
                disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Logging In...' : 'Log In'}
            </button>
        </form>
    );
}