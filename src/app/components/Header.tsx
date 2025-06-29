'use client';

import Link from 'next/link';
import styles from '@/app/styles/components/Header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <Link href="/" className={styles.header__logo}>
          {/* Commenting out image to prevent errors */}
          {/*
          <Image
            src="/logo.svg"
            alt="Company Logo"
            width={150}
            height={40}
            priority
          />
          */}
          <div className={styles.header__logo_text}>
            PRODUCT CATALOG
          </div>
        </Link>
      </div>
    </header>
  );
}
