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
    "grapes": 21
}

const cropNamesByID = Object.fromEntries(
    Object.entries(cropIDs).map(([name, id]) => [id, name.charAt(0).toLowerCase() + name.slice(1)])
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

    const tileAssets = new TileAssets(async () => { // Make this async to await inventory loading
        // Load saved state here (tilemap still from local storage)
        const savedState = localStorage.getItem("tilemap");
        if (savedState) {
            tileMap.loadState(savedState);
        }

        // Load inventory from database after session is available
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            await inventory.loadFromDatabase(supabase, session.user.id);
        } else {
            console.warn("No user session found, using default zero inventory.");
        }


        tileRenderer = new TileRenderer(ctx, tileAssets, tileMap);
        tileRenderer.drawMap();

        // Initial UI update after loading inventory
        updateInventoryUI();
    });

    // Remove local storage inventory loading
    // const savedInventory = localStorage.getItem("inventory");
    // if (savedInventory) {
    //     inventory.loadState(savedInventory);
    // }

    // Function to update UI with current inventory counts
    const updateInventoryUI = () => {
        const hotbarSlots = document.querySelectorAll('.hotbar-slot');
        hotbarSlots.forEach((slot) => {
            for (const type of cropTypes) {
                if (slot.classList.contains(`${type}-seed`)) {
                    // Ensure the text content is updated with the current seed count from the inventory instance
                    slot.textContent = inventory.getInventory().seeds[type].toString();
                }
            }
        });
    };

    // Register the callback
    inventory.addOnChangeCallback(updateInventoryUI);

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
                        // Get the crop on the current tile
                        const cropId = currentTile.cropID;

                        if (cropId > -1) { // Check if a crop is planted
                            const waterCost = 10; // Fixed water cost of 10

                            // Get current currency
                            const { data: currencyData, error: currencyError } = await supabase
                                .from('currency')
                                .select('water')
                                .eq('user_id', session.user.id)
                                .single();

                            if (currencyError) {
                                console.error('Error fetching currency:', currencyError);
                                alert('Failed to get current water points.');
                                return;
                            }

                            if (currencyData && currencyData.water >= waterCost) {
                                // Update currency
                                const { error: updateError } = await supabase
                                    .from('currency')
                                    .update({ water: currencyData.water - waterCost })
                                    .eq('user_id', session.user.id);

                                if (updateError) {
                                    console.error('Error updating currency:', updateError);
                                    alert('Failed to update water points.');
                                } else {
                                    currentTile.watered = true;
                                    // Currency UI update is likely handled by a different component
                                }
                            } else {
                                // Not enough water points
                                alert(`Not enough water points! Need ${waterCost}.`);
                                return;
                            }
                        } else {
                            // Handle watering bare farmland (no crop)
                            const waterCost = 10; // Same fixed water cost for bare farmland

                            // Get current currency
                            const { data: currencyData, error: currencyError } = await supabase
                                .from('currency')
                                .select('water')
                                .eq('user_id', session.user.id)
                                .single();

                            if (currencyError) {
                                console.error('Error fetching currency:', currencyError);
                                alert('Failed to get current water points.');
                                return;
                            }

                            if (currencyData && currencyData.water >= waterCost) {
                                // Update currency
                                const { error: updateError } = await supabase
                                    .from('currency')
                                    .update({ water: currencyData.water - waterCost })
                                    .eq('user_id', session.user.id);

                                if (updateError) {
                                    console.error('Error updating currency:', updateError);
                                    alert('Failed to update water points.');
                                } else {
                                    currentTile.watered = true;
                                }
                            } else {
                                // Not enough water points
                                alert(`Not enough water points! Need ${waterCost}.`);
                                return;
                            }
                        }
                    } else {
                        alert('Please log in to water plants.');
                        return;
                    }
                } else if (currentTool == PICKAXE) {
                    currentTile.type = DIRT;
                    currentTile.watered = false;
                    currentTile.cropID = -1;
                    currentTile.growthStage = 0;
                } else if (currentTool == SEED && currentTile.cropID < 0) {
                    const seedType = cropNamesByID[currentCropID] as CropType;
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session?.user) {
                        if (await inventory.removeSeed(seedType, 1, supabase, session.user.id)) {
                            currentTile.cropID = currentCropID;
                            currentTile.growthStage = 0;
                        } else {
                            //alert(`Not enough ${seedType} seeds!`);
                            return; // Stop processing if not enough seeds
                        }
                    } else {
                        alert('Please log in to plant seeds.');
                        return; // Stop processing if no user session
                    }
                } else if (currentTool == POINTER && currentTile.cropID > -1 && currentTile.growthStage == 3) {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session?.user) {
                        await inventory.addCrop(cropNamesByID[currentTile.cropID] as CropType, 1, supabase, session.user.id);
                    } else {
                        alert('Could not add crop to inventory');
                        return;
                    }
                    currentTile.type = FARMLAND;
                    if(currentTile.cropID != cropIDs["grapes"]) {
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
                fakeCursor.style.backgroundImage = 'url("/watering-can.png")'; 
                currentTool = WATERING_CAN;
            } else if (slot.classList.contains('hoe')) {
                fakeCursor.style.backgroundImage = 'url("/hoe.png")';
                currentTool = HOE;
            } else if (slot.classList.contains('pickaxe')) {
                fakeCursor.style.backgroundImage = 'url("/pickaxe.png")';
                currentTool = PICKAXE;
            } else if (slot.classList.contains('seed')) {
                for (const type of cropTypes) {
                    if (slot.classList.contains(`${type}-seed`)) {
                        fakeCursor.style.backgroundImage = `url("/${type}-seed.png")`;
                        currentCropID = cropIDs[type];
                        // The textContent update is now handled by the updateInventoryUI callback
                        // slot.textContent = inventory.getInventory().seeds[type].toString();
                        break;
                    }
                }
                currentTool = SEED;
            } else {
                currentTool = POINTER;
                fakeCursor.style.backgroundImage = 'none';
            }
             // Ensure cursor is updated when tool changes, before any potential inventory change
            if (currentTool != SEED) {
                 updateInventoryUI(); // Update UI for non-seed tools to show correct counts
            }
        });
    });

    // initialize hotbar - this initial update is now handled after tileAssets load
    // hotbarSlots.forEach((slot) => {
    //     for (const type of cropTypes) {
    //         if (slot.classList.contains(`${type}-seed`)) {
    //             fakeCursor.style.backgroundImage = `url("${type}-seed.png")`;
    //             currentCropID = cropIDs[type];
    //             slot.textContent = inventory.getInventory().seeds[type].toString();
    //         }
    //     }
    // });


    const skipButton = document.querySelector('.skip-btn');
    skipButton?.addEventListener('click', () => {
        for (let i = 0; i < MAP_WIDTH; i++) {
            for (let j = 0; j < MAP_HEIGHT; j++) {
                const tile = tileMap.getTile(i, j);
                if (tile.watered && tile.cropID > -1) {
                    tile.growthStage = Math.min(3, tile.growthStage + 1);
                }
                tile.watered = false;
                if (tile.type == FARMLAND && tile.cropID == -1) {
                    if(Math.floor(Math.random() * 2) == 1) {
                        tile.type = DIRT;
                    }
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
