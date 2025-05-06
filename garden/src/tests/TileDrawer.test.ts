import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TileRenderer } from '../TileDrawer';
import { TileAssets } from '../TileAssets';
import { TileMap } from '../TileMap';
import {
    GRASS,
    DIRT,
    VOID,
    TileState,
    FARMLAND,
    B_FL,
    T_B_BL_L_TL_FL
} from '../constants';

describe('TileRenderer', () => {
    let ctx: any;
    let tileAssets: TileAssets;
    let tileMap: TileMap;
    let tileRenderer: TileRenderer;

    beforeEach(() => {
        // Mock the canvas context
        ctx = {
            drawImage: vi.fn(),  // Mock drawImage
        };

        // Mock TileAssets (could use dummy data or leave it as-is)
        tileAssets = {
            [GRASS]: {},  // Dummy object
            [DIRT]: {},
            [VOID]: {},
        } as unknown as TileAssets;

        // Mock TileMap
        tileMap = new TileMap();
        // Initialize TileRenderer
        tileRenderer = new TileRenderer(ctx, tileAssets, tileMap);
    });

    it('initializes correctly', () => {
        expect(tileRenderer.getDirtSpots(5, 5)).toBe(0b11111111);
    });

    it('uses correct sprite', () => {
        let state: TileState = { type: FARMLAND, watered: false, cropID: -1, growthStage: 0 };
        tileMap.setTile(1, 1, state);
        let farmBits: number = tileRenderer.getFarmlandSpots(1, 0);

        expect(tileRenderer.checkLocation(farmBits, "B_FL")).toBe(true);
        farmBits = tileRenderer.getFarmlandSpots(2, 0);
        expect(tileRenderer.checkLocation(farmBits, "BL_FL")).toBe(true);
    });

    it('uses correct water sprite', () => {
        let state: TileState = { type: FARMLAND, watered: true, cropID: -1, growthStage: 0 };
        tileMap.setTile(1, 1, state);

        let wateredBits: number = tileRenderer.getWateredSpots(1, 0);

        expect(tileRenderer.checkWateredSpots(wateredBits, "B_FL")).toBe(true);
        wateredBits = tileRenderer.getFarmlandSpots(2, 0);
        expect(tileRenderer.checkWateredSpots(wateredBits, "BL_FL")).toBe(true);
    });

    it('picks correct water sprite', () => {
        let state: TileState = { type: FARMLAND, watered: true, cropID: -1, growthStage: 0 };
        tileMap.setTile(1, 1, state);

        let wateredBits: number = tileRenderer.getWateredSpots(1, 0);

        expect(tileRenderer.pickWetLocation(wateredBits)).toBe(B_FL);
        tileMap.setTile(3, 3, state);
        tileMap.setTile(3, 4, state);
        tileMap.setTile(3, 5, state);
        tileMap.setTile(4, 3, state);
        tileMap.setTile(4, 5, state);

        wateredBits = tileRenderer.getWateredSpots(4, 4);
        expect(tileRenderer.pickWetLocation(wateredBits)).toBe(T_B_BL_L_TL_FL);
    });

    it('falls back to default sprite when no match found', () => {
        const state: TileState = { type: FARMLAND, watered: true, cropID: -1, growthStage: 0 };
        tileMap.setTile(10, 10, state);
        tileMap.setTile(10, 11, state);

        const wateredBits = tileRenderer.getWateredSpots(10, 10);
        const sprite = tileRenderer.pickWetLocation(wateredBits);

        expect(sprite).toBeDefined();
    });
});

