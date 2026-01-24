// src/components/scrollystory/bordered-card.tsx
'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface BorderedCardProps {
    children: ReactNode
    className?: string
    delay?: number
}

export function BorderedCard({ 
    children, 
    className = "", 
    delay = 0 
    }: BorderedCardProps) {
    return (
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay }}
        className={`border-2 border-slate-700 rounded-xl bg-slate-800/50 backdrop-blur-sm p-6 ${className}`}
        >
        {children}
        </motion.div>
    )
}