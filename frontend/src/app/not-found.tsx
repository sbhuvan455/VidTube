'use client'

import Link from 'next/link'
import { VideoOff } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <VideoOff className="w-24 h-24 text-red-500 mx-auto mb-8" />
            <h1 className="text-5xl font-bold mb-2">404</h1>
            <h2 className="text-3xl font-semibold mb-4">Video Not Found</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto">
            Oops! The video you&apos;re looking for seems to have disappeared into the digital abyss.
            </p>
            <Link 
            href="/" 
            className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors inline-flex items-center space-x-2"
            >
            <span>Return to Home</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            </Link>
        </div>
    )
}