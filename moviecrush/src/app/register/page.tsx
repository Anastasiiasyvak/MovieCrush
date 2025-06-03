'use client';

import RegisterForm from '../../components/RegisterForm/RegisterForm';
import Link from 'next/link';
import styles from './register.module.css';

export default function RegisterPage() {
    return (
        <div className={styles.container}>
            <h1>MovieCrush</h1>
            <RegisterForm />
            <p style={{ marginTop: '20px' }}>
                Already have an account?{' '}
                <Link href="/login" style={{ color: '#e784aa' }}>
                    Log in
                </Link>
            </p>
        </div>
    );
}
