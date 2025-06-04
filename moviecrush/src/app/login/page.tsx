'use client';

import LoginForm from '../../components/LogInForm/LogInForm';
import styles from './login.module.css';

export default function LoginPage() {
    return (
        <div className={styles.container}>
            <h1>Login</h1>
            <LoginForm />
        </div>
    );
}
