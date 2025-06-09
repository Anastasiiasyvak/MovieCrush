import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
      <>
        <Link href="/register" style={{ color: '#0070f3' }}>
          Register Page
        </Link><br/>
        <Link href="/login" style={{ color: '#0070f3' }}>
          Log In Page
        </Link><br/>
        <Link href="/profile" style={{ color: '#0070f3' }}>
          Profile Page
        </Link><br/>
        <Link href="/recommendations" style={{ color: '#0070f3' }}>
          Recommendations Page
        </Link><br/>
        <Link href="/search" style={{ color: '#0070f3' }}>
          Search Page
        </Link><br/>
      </>
  );
}
