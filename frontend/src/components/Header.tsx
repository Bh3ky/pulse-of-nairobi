'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Header.module.css'

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    return (
        <header className={styles.headerWrapper}>
            <div className={styles.headerCard}>
                {/* Logo */}
                <Link 
                    href="/" 
                    className={styles.logoLink} 
                    onClick={closeMobileMenu}
                    aria-label="Go to homepage"
                >
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

                {/* Hamburger Button (Mobile Only) */}
                <button
                    className={styles.hamburger}
                    onClick={toggleMobileMenu}
                    aria-label="Toggle navigation menu"
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="mobile-navigation"
                >
                    <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.hamburgerLineActive : ''}`}></span>
                    <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.hamburgerLineActive : ''}`}></span>
                    <span className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.hamburgerLineActive : ''}`}></span>
                </button>

                {/* Navigation */}
                <nav 
                    id="mobile-navigation"
                    className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ''}`}
                    aria-label="Main navigation"
                >
                    <Link 
                        href="/about" 
                        className={styles.navLink} 
                        onClick={closeMobileMenu}
                        prefetch={true}
                    >
                        ABOUT
                    </Link>
                    <Link 
                        href="/gallery" 
                        className={styles.navLink} 
                        onClick={closeMobileMenu}
                        prefetch={true}
                    >
                        GALLERY
                    </Link>
                    <Link 
                        href="/case-study" 
                        className={styles.navLink} 
                        onClick={closeMobileMenu}
                        prefetch={true}
                    >
                        CASE STUDY
                    </Link>
                    <Link 
                        href="/contact" 
                        className={styles.navLink} 
                        onClick={closeMobileMenu}
                        prefetch={true}
                    >
                        CONTACT
                    </Link>
                </nav>
            </div>

            {/* Overlay for mobile menu */}
            {isMobileMenuOpen && (
                <div 
                    className={styles.overlay} 
                    onClick={closeMobileMenu}
                    aria-hidden="true"
                    role="presentation"
                ></div>
            )}
        </header>
    )
}