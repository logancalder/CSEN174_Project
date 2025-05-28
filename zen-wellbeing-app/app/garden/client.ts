// src/client.ts
import {
    DIRT, FARMLAND, MAP_HEIGHT, MAP_WIDTH, TILE_SIZE, TileState, CropType, cropTypes
} from './constants';
import { TileAssets } from './TileAssets';
import { TileMap } from "./TileMap";
import { TileRenderer } from "./TileDrawer";
import { Inventory } from "./Inventory";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const POINTER = 0;
const WATERING_CAN = 1;
const HOE = 2;
const PICKAXE = 3;
const SEED = 4;



const cropIDs = {
    "wheat": 0,
    "tomato": 1,
    "grape": 21
}

const cropNamesByID = Object.fromEntries(
    Object.entries(cropIDs).map(([name, id]) => [id, name])
);

const inventory = new Inventory();
(window as any).inventory = inventory; // expose to console





export function setupGame(canvas: HTMLCanvasElement) {
    let currentTool: number = POINTER;
    let currentCropID: number;
    const supabase = createClientComponentClient();

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

    const savedInventory = localStorage.getItem("inventory");
    if (savedInventory) {
        inventory.loadState(savedInventory);
    }

    // Function to update UI with current inventory counts
    const updateInventoryUI = () => {
        const hotbarSlots = document.querySelectorAll('.hotbar-slot');
        hotbarSlots.forEach((slot) => {
            for (const type of cropTypes) {
                if (slot.classList.contains(`${type}-seed`)) {
                    slot.textContent = inventory.getInventory().seeds[type].toString();
                }
            }
        });
    };

    // Register the callback
    inventory.addOnChangeCallback(updateInventoryUI);

    // Initial UI update
    updateInventoryUI();

    canvas.addEventListener('click', async (e) => {
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
                    // Get current session
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session?.user) {
                        // Get current currency
                        const { data: currencyData } = await supabase
                            .from('currency')
                            .select('water')
                            .eq('user_id', session.user.id)
                            .single();

                        if (currencyData && currencyData.water >= 10) {
                            // Update currency
                            await supabase
                                .from('currency')
                                .update({ water: currencyData.water - 10 })
                                .eq('user_id', session.user.id);
                            
                            currentTile.watered = true;
                        } else {
                            // Not enough water points
                            alert('Not enough water points!');
                            return;
                        }
                    }
                } else if (currentTool == PICKAXE) {
                    currentTile.type = DIRT;
                    currentTile.watered = false;
                    currentTile.cropID = -1;
                    currentTile.growthStage = 0;
                } else if (currentTool == SEED && currentTile.cropID < 0) {
                    currentTile.cropID = currentCropID;
                    currentTile.growthStage = 0;
                    inventory.removeSeed(cropNamesByID[currentCropID] as CropType);
                } else if (currentTool == POINTER && currentTile.cropID > -1 && currentTile.growthStage == 3) {
                    inventory.addCrop(cropNamesByID[currentTile.cropID] as CropType);
                    currentTile.type = FARMLAND;
                    if(currentTile.cropID != cropIDs["grape"]) {
                        currentTile.cropID = -1;
                    }
                    currentTile.growthStage = 0;
                    // console.log(inventory.getInventory());
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
                for (const type of cropTypes) {
                    if (slot.classList.contains(`${type}-seed`)) {
                        fakeCursor.style.backgroundImage = `url("${type}-seed.png")`;
                        currentCropID = cropIDs[type];
                        slot.textContent = inventory.getInventory().seeds[type].toString();
                        break;
                    }
                }
                currentTool = SEED;
            } else {
                currentTool = POINTER;
                fakeCursor.style.backgroundImage = 'none';
            }
        });
    });

    // initialize hotbar
    hotbarSlots.forEach((slot) => {
        for (const type of cropTypes) {
            if (slot.classList.contains(`${type}-seed`)) {
                fakeCursor.style.backgroundImage = `url("${type}-seed.png")`;
                currentCropID = cropIDs[type];
                slot.textContent = inventory.getInventory().seeds[type].toString();
            }
        }
    });

    const skipButton = document.querySelector('.skip-btn');
    skipButton?.addEventListener('click', () => {
        for (let i = 0; i < MAP_WIDTH; i++) {
            for (let j = 0; j < MAP_HEIGHT; j++) {
                const tile = tileMap.getTile(i, j);
                if (tile.watered && tile.cropID > -1) {
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
