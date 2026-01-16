'use client'

import Link from 'next/link'
import Image from 'next/image'
import styles from './Header.module.css'

export default function Header() {
    return (
        <header className={styles.headerWrapper}>
            <div className={styles.headerCard}>
                {/* Logo */}
                <Link href="/" className={styles.logoLink}>
                    <div className={styles.logoWrapper}>
                        <Image
                        src="/logo.jpg"
                        alt="YourLogo"
                        width={120}
                        height={40}
                        className={styles.logoImage}
                        priority
                        />
                    </div>
                </Link>


                {/* Navigation */}
                <nav className={styles.nav}>
                    <Link href="/about" className={styles.navLink}>
                        ABOUT
                    </Link>
                    <Link href="/gallery" className={styles.navLink}>
                        GALLERY
                    </Link>
                    <Link href="/case-study" className={styles.navLink}>
                        CASE STUDY
                    </Link>
                    <Link href="/contact" className={styles.navLink}>
                        CONTACT
                    </Link>
                </nav>
            </div>
        </header>
    )
}