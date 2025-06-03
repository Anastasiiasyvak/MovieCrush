'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './RegisterForm.module.css';

export default function RegisterForm() {
    const [form, setForm] = useState({
        email: '',
        password: '',
        name: '',
        surname: '',
        nickname: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const existingResponse = await fetch('/api/users');
            const existingUsers = await existingResponse.json();
            const emailTaken = existingUsers.some((u: any) => u.email === form.email);

            if (emailTaken) {
                setError('This email is already taken. Please try another one.');
                return;
            }

            const newUser = {
                id: uuidv4(),
                ...form,
                photo: '',
                favorite: [],
                watched: [],
                watchlist: []
            };

            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                setError('');
                alert('User registered successfully!');
            } else {
                setError('Failed to register user.');
            }
        } catch (error) {
            console.error('Error registering user:', error);
            setError('An error occurred while registering user.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div style={{ minHeight: '20px' }}>
                {error && <p className={styles.error}>{error}</p>}
            </div>
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <input name="surname" placeholder="Surname" value={form.surname} onChange={handleChange} required />
            <input name="nickname" placeholder="Nickname" value={form.nickname} onChange={handleChange} required />
            <button type="submit">Create Account</button>
        </form>
    );
}
