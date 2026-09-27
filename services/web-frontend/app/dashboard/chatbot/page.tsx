'use client'

import { motion } from 'framer-motion'
import { ChatInterface } from '@/components/ChatInterface'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.2, 0.7, 0.1, 1] as const,
        },
    },
}

export default function ChatbotPage() {
    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative flex h-[calc(100svh-9.5rem)] min-h-[520px] w-full flex-col lg:h-[calc(100vh-11rem)]"
        >
            {/* Main Interface */}
            <motion.div
                variants={itemVariants}
                className="relative h-full w-full flex-1"
            >
                <div className="relative h-full w-full overflow-hidden rounded-[14px]">
                    <ChatInterface fullHeight />
                </div>
            </motion.div>
        </motion.div>
    )
}
