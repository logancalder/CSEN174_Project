'use client'

import { useEffect, useRef } from 'react'
import { setupGame } from '@/main'

export default function HomePage() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (canvasRef.current) {
            setupGame(canvasRef.current)
        }
    }, [])

    return (
        <>
            <div className="hotbar">
                <div className="hotbar-slot pointer selected"></div>
                <div className="hotbar-slot watering-can"></div>
                <div className="hotbar-slot hoe"></div>
                <div className="hotbar-slot pickaxe"></div>
                <div className="hotbar-slot seed wheat-seed"></div>
                <div className="hotbar-slot seed tomato-seed"></div>
            </div>

            <div className="skip-btn">Skip &gt;</div>

            <canvas ref={canvasRef}></canvas>
        </>
    )
}
