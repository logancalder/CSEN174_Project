'use client';

import { useEffect } from 'react';
import { AppHeader } from "@/components/app-header";

export function GardenClient() {
    useEffect(() => {
        import('./client').then((mod) => {
            mod.init();
        });
    }, []);

    return (
        <>
            <AppHeader />
            <div className="garden_ui">
                <div id="game-container"/>
                <div className="hotbar">
                    <div className="hotbar-slot pointer selected"></div>
                    <div className="hotbar-slot hoe"></div>
                    <div className="hotbar-slot watering-can"></div>
                    <div className="hotbar-slot pickaxe"></div>
                    <div className="hotbar-slot seed wheat-seed"></div>
                    <div className="hotbar-slot seed tomato-seed"></div>
                    <div className="hotbar-slot seed grapes-seed"></div>
                </div>
                <div className="skip-btn">⏩ Skip</div>
            </div>
        </>
    );
} 