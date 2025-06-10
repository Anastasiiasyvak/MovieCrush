'use client';

import LoginForm from '../../components/LogInForm/LogInForm';
import Link from 'next/link';
import styles from './login.module.css';

export default function LoginPage() {
    return (
        <div className={styles.container}>
            <h1>Login</h1>
            <LoginForm />
            <p style={{ marginTop: '20px' }}>
                Don't have an account yet?{' '}
                <Link href="/register" style={{ color: '#ffd700' }}>
                    Sign up here
                </Link>
            </p>
        </div>
    );
}