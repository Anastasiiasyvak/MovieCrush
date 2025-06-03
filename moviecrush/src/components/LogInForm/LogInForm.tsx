'use client';

import { useState } from 'react';
import styles from './LogInForm.module.css';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/users');
            const users = await response.json();

            const found = users.find((u: any) => u.email === email && u.password === password);

            if (found) {
                alert(`Welcome back, ${found.nickname}!`);
            } else {
                alert('Invalid email or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Error during login');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
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
