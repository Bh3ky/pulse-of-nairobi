'use client';

import { useRef, ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

interface VitalCardProps {
    title: string;
    delay?: number;
    children: ReactNode;
}

export const VitalCard = ({ title, delay = 0.2, children }: VitalCardProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            className="bg-white rounded-xl border-2 border-gray-300 p-6 shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay }}
        >
            <h3 className="text-xl font-bold mb-6 text-gray-800">{title}</h3>
            {children}
        </motion.div>
    );

};
