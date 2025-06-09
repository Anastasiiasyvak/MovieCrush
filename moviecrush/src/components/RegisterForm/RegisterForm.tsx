'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // Очищаємо помилку коли користувач починає вводити
        if (error) setError('');
    };

    const validateForm = () => {
        // Перевіряємо чи всі поля заповнені
        if (!form.email || !form.password || !form.name || !form.surname || !form.nickname) {
            setError('Please fill in all fields');
            return false;
        }

        // Перевіряємо валідність email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        // Перевіряємо довжину пароля
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters long');
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
            // Перевіряємо чи існує користувач з таким email
            const existingResponse = await fetch('/api/users');
            const existingUsers = await existingResponse.json();
            const emailTaken = existingUsers.some((u: any) => u.email === form.email);

            if (emailTaken) {
                setError('This email is already taken. Please try another one.');
                setIsLoading(false);
                return;
            }

            // Перевіряємо чи існує користувач з таким nickname
            const nicknameTaken = existingUsers.some((u: any) => u.nickname === form.nickname);
            if (nicknameTaken) {
                setError('This nickname is already taken. Please try another one.');
                setIsLoading(false);
                return;
            }

            // Створюємо нового користувача
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
                // Зберігаємо ID користувача в localStorage
                localStorage.setItem('userId', newUser.id);
                
                // Перенаправляємо на сторінку пошуку
                router.push('/search');
            } else {
                setError('Failed to register user. Please try again.');
            }
        } catch (error) {
            console.error('Error registering user:', error);
            setError('An error occurred while registering. Please try again.');
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
                name="email" 
                type="email"
                placeholder="Email" 
                value={form.email} 
                onChange={handleChange} 
                required 
                disabled={isLoading}
            />
            <input 
                name="password" 
                type="password" 
                placeholder="Password" 
                value={form.password} 
                onChange={handleChange} 
                required 
                disabled={isLoading}
            />
            <input 
                name="name" 
                placeholder="Name" 
                value={form.name} 
                onChange={handleChange} 
                required 
                disabled={isLoading}
            />
            <input 
                name="surname" 
                placeholder="Surname" 
                value={form.surname} 
                onChange={handleChange} 
                required 
                disabled={isLoading}
            />
            <input 
                name="nickname" 
                placeholder="Nickname" 
                value={form.nickname} 
                onChange={handleChange} 
                required 
                disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
        </form>
    );
}