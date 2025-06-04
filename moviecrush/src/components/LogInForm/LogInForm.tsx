'use client';

import { useState } from 'react';
import styles from './LogInForm.module.css';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/users');
            const users = await response.json();

            const found = users.find((u: any) => u.email === email && u.password === password);

            if (found) {
                alert(`Welcome back, ${found.nickname}!`);
            } else {
                setError('Invalid email or password');
                return;
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Error during login');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div style={{ minHeight: '20px' }}>
                {error && <p className={styles.error}>{error}</p>}
            </div>
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                placeholder="Password"
                required
            />
            <button type="submit">Log In</button>
        </form>
    );
}

