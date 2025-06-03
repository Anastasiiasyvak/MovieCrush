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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newUser = {
            id: uuidv4(),
            ...form,
            photo: '',
            favorite: [],
            watched: [],
            watchlist: []
        };

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                alert('User registered successfully!');
            } else {
                alert('Failed to register user.');
            }
        } catch (error) {
            console.error('Error registering user:', error);
            alert('An error occurred while registering user.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <input name="surname" placeholder="Surname" value={form.surname} onChange={handleChange} required />
            <input name="nickname" placeholder="Nickname" value={form.nickname} onChange={handleChange} required />
            <button type="submit">Create Account</button>
        </form>
    );
}
