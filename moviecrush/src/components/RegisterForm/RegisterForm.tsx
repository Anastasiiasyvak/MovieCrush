'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import styles from './RegisterForm.module.css';

export default function RegisterForm() {
    const router = useRouter();

    /* ───── состояние формы ───── */
    const [form, setForm] = useState({
        email: '',
        password: '',
        name: '',
        surname: '',
        nickname: '',
    });

    /* ───── жанры ───── */
    const allGenres = [
        'Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror',
        'Adventure', 'Romance', 'Thriller', 'Mystery', 'Fantasy',
    ];
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

    /* ───── UI-состояния ───── */
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    /* ── helpers ─────────────────────────────── */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const toggleGenre = (genre: string) => {
        setSelectedGenres(prev =>
            prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
        );
    };

    const validateForm = () => {
        if (Object.values(form).some(v => !v.trim())) {
            setError('Please fill in all fields');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        if (selectedGenres.length === 0) {
            setError('Please choose at least one favorite genre');
            return false;
        }
        return true;
    };

    /* ── submit ─────────────────────────────── */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setError('');

        try {
            const existingUsers = await fetch('/api/users').then(r => r.json());

            if (existingUsers.some((u: any) => u.email === form.email)) {
                setError('This email is already taken.');
                setIsLoading(false);
                return;
            }
            if (existingUsers.some((u: any) => u.nickname === form.nickname)) {
                setError('This nickname is already taken.');
                setIsLoading(false);
                return;
            }

            const newUser = {
                id: uuidv4(),
                ...form,
                photo: '',
                favorite: [],
                watched: [],
                watchlist: [],
                genres: selectedGenres,           // ← сохраняем выбор жанров
            };

            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });

            if (res.ok) {
                localStorage.setItem('userId', newUser.id);
                router.push('/search');
            } else {
                setError('Failed to register user. Please try again.');
            }
        } catch (err) {
            console.error('Error registering user:', err);
            setError('An error occurred while registering. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    /* ── JSX ─────────────────────────────── */
    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div style={{ minHeight: '20px' }}>
                {error && <p className={styles.error}>{error}</p>}
            </div>

            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} disabled={isLoading} />
            <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} disabled={isLoading} />
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} disabled={isLoading} />
            <input name="surname" placeholder="Surname" value={form.surname} onChange={handleChange} disabled={isLoading} />
            <input name="nickname" placeholder="Nickname" value={form.nickname} onChange={handleChange} disabled={isLoading} />

            {/* чек-лист жанров */}
            <div className={styles.genresSection}>
                <p>Select your favorite genres:</p>
                <div className={styles.genresGrid}>
                    {allGenres.map(genre => (
                        <label key={genre} className={styles.genreCheckbox}>
                            <input
                                type="checkbox"
                                checked={selectedGenres.includes(genre)}
                                onChange={() => toggleGenre(genre)}
                                disabled={isLoading}
                            />
                            {genre}
                        </label>
                    ))}
                </div>
            </div>

            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
        </form>
    );
}
