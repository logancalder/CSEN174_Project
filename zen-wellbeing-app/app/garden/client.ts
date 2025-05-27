// src/client.ts
import {
    DIRT, FARMLAND, MAP_HEIGHT, MAP_WIDTH, TILE_SIZE, TileState,
} from './constants';
import { TileAssets } from './TileAssets';
import { TileMap } from "./TileMap";
import { TileRenderer } from "./TileDrawer";

const POINTER = 0;
const WATERING_CAN = 1;
const HOE = 2;
const PICKAXE = 3;
const SEED = 4;

const WHEAT = 0;
const TOMATO = 1;
const GRAPE = 21;



export function setupGame(canvas: HTMLCanvasElement) {
    let currentTool: number = POINTER;
    let currentCropID: number = WHEAT;

    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    canvas.width = TILE_SIZE * MAP_WIDTH;
    canvas.height = TILE_SIZE * MAP_HEIGHT;

    const tileMap = new TileMap();
    (window as any).tileMap = tileMap; // expose to console
    let tileRenderer: TileRenderer;

    const tileAssets = new TileAssets(() => {
        // Load saved state here
        const savedState = localStorage.getItem("tilemap");
        if (savedState) {
            tileMap.loadState(savedState);
        }

        tileRenderer = new TileRenderer(ctx, tileAssets, tileMap);
        tileRenderer.drawMap();
    });


    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = Math.floor(((e.clientX - rect.left) * scaleX) / TILE_SIZE);
        const y = Math.floor(((e.clientY - rect.top) * scaleY) / TILE_SIZE);

        if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
            const currentTile = tileMap.getTile(x, y);

            if (currentTile.type == DIRT && currentTool == HOE) {
                tileMap.setTile(x, y, {
                    type: FARMLAND, watered: false, cropID: -1, growthStage: 0
                });
            } else if (currentTile.type == FARMLAND) {
                if (currentTool == WATERING_CAN) {
                    currentTile.watered = true;
                } else if (currentTool == PICKAXE) {
                    currentTile.type = DIRT;
                    currentTile.watered = false;
                    currentTile.cropID = -1;
                    currentTile.growthStage = 0;
                } else if (currentTool == SEED && currentTile.cropID < 0) {
                    currentTile.cropID = currentCropID;
                    currentTile.growthStage = 0;
                }
                tileMap.setTile(x, y, currentTile);
            }
            tileMap.saveState();
            tileRenderer.drawMap();
        }
    });

    const fakeCursor = document.createElement('div');
    fakeCursor.style.position = 'fixed';
    fakeCursor.style.pointerEvents = 'none';
    fakeCursor.style.width = '64px';
    fakeCursor.style.height = '64px';
    fakeCursor.style.backgroundImage = 'none';
    fakeCursor.style.backgroundSize = 'contain';
    fakeCursor.style.backgroundRepeat = 'no-repeat';
    fakeCursor.style.imageRendering = 'pixelated';
    // document.body.appendChild(fakeCursor);

    document.addEventListener('mousemove', (e) => {
        fakeCursor.style.left = `${e.clientX + 16}px`;
        fakeCursor.style.top = `${e.clientY + 16}px`;
    });



    const hotbarSlots = document.querySelectorAll('.hotbar-slot');
    hotbarSlots.forEach((slot) => {
        slot.addEventListener('click', () => {
            hotbarSlots.forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');

            if (slot.classList.contains('watering-can')) {
                fakeCursor.style.backgroundImage = 'url("watering-can.png")';
                currentTool = WATERING_CAN;
            } else if (slot.classList.contains('hoe')) {
                fakeCursor.style.backgroundImage = 'url("hoe.png")';
                currentTool = HOE;
            } else if (slot.classList.contains('pickaxe')) {
                fakeCursor.style.backgroundImage = 'url("pickaxe.png")';
                currentTool = PICKAXE;
            } else if (slot.classList.contains('seed')) {
                if (slot.classList.contains('wheat-seed')) {
                    fakeCursor.style.backgroundImage = 'url("wheat-seed.png")';
                    currentCropID = WHEAT;
                } else if (slot.classList.contains('tomato-seed')) {
                    fakeCursor.style.backgroundImage = 'url("tomato-seed.png")';
                    currentCropID = TOMATO;
                } else if (slot.classList.contains('grape-seed')) {
                    fakeCursor.style.backgroundImage = 'url("grape-seed.png")';
                    currentCropID = GRAPE;
                }
                currentTool = SEED;
            } else {
                currentTool = POINTER;
                fakeCursor.style.backgroundImage = 'none';
            }
        });
    });

    const skipButton = document.querySelector('.skip-btn');
    skipButton?.addEventListener('click', () => {
        for (let i = 0; i < MAP_WIDTH; i++) {
            for (let j = 0; j < MAP_HEIGHT; j++) {
                const tile = tileMap.getTile(i, j);
                if (tile.watered) {
                    tile.growthStage = Math.min(3, tile.growthStage + 1);
                }
                tileMap.setTile(i, j, tile);
            }
        }
        tileMap.saveState();
        tileRenderer.drawMap();
    });
}

export function init() {
    const container = document.getElementById('game-container');
    if (!container) {
        console.error('Game container not found');
        return;
    }

    let canvas = container.querySelector('canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.style.display = 'block';
        container.appendChild(canvas);
    }

    setupGame(canvas);
}
