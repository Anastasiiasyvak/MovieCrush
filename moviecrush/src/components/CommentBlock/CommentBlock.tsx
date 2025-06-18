'use client';

import { useEffect, useState } from 'react';
import styles from './CommentBlock.module.css';

interface Comment {
    name: string;
    text: string;
    date: string;
}

interface Props {
    imdbID: string;
}

export default function CommentBlock({ imdbID }: Props) {
    const storageKey = `comments-${imdbID}`;

    const [comments, setComments] = useState<Comment[]>([]);
    const [name, setName] = useState('');
    const [text, setText] = useState('');


    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) setComments(JSON.parse(saved));
    }, [storageKey]);

    const handleSubmit = () => {
        if (!name.trim() || !text.trim()) return;
        const newComment: Comment = {
            name: name.trim(),
            text: text.trim(),
            date: new Date().toLocaleString(),
        };
        const updated = [...comments, newComment];
        setComments(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
        setText('');
    };

    return (
        <section className={styles.comments}>
            <h2 className={styles.title}>Comments</h2>

            <div className={styles.form}>
                <input
                    className={styles.input}
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <textarea
                    className={styles.textarea}
                    placeholder="Write a comment..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button className={styles.button} onClick={handleSubmit}>
                    Post
                </button>
            </div>

            <div className={styles.list}>
                {comments.map((c, i) => (
                    <div key={i} className={styles.comment}>
                        <div className={styles.header}>
                            <strong>{c.name}</strong>
                            <span className={styles.date}>{c.date}</span>
                        </div>
                        <p className={styles.body}>{c.text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
