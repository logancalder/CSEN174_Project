// app/garden/page.tsx
'use client';

import {useEffect} from 'react';
import './style.css'; // optional if you have tool icons

export default function GardenPage() {
    useEffect(() => {
        import('./client').then((mod) => {
            mod.init(); // see below
        });
    }, []);

    return (
        <>
            <a href="/dashboard" id="back-to-dashboard">← Back to Dashboard</a>
            <div className="garden_ui">
                <div id="game-container"/>
                <div className="hotbar">
                    <div className="hotbar-slot pointer selected"></div>
                    <div className="hotbar-slot hoe"></div>
                    <div className="hotbar-slot watering-can"></div>
                    <div className="hotbar-slot pickaxe"></div>
                    <div className="hotbar-slot seed wheat-seed"></div>
                    <div className="hotbar-slot seed tomato-seed"></div>
                </div>
                <div className="skip-btn">⏩ Skip</div>
            </div>
        </>
    );
}
