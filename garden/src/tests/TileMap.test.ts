import { describe, it, expect } from 'vitest';
import { TileMap } from '../TileMap';
import { GRASS, DIRT, VOID, MAP_WIDTH, MAP_HEIGHT, TileState } from '../constants';

describe('TileMap', () => {
    it('initializes with correct dimensions', () => {
        const map = new TileMap();
        expect(map.map.length).toBe(MAP_HEIGHT);
        expect(map.map[0].length).toBe(MAP_WIDTH);
    });

    it('sets inner tiles to DIRT and borders to GRASS', () => {
        const map = new TileMap();

        expect(map.getTile(0, 0).type).toBe(GRASS);
        expect(map.getTile(1, 1).type).toBe(DIRT);
    });

    it('returns VOID tile for out-of-bounds getTile', () => {
        const map = new TileMap();
        const outTile = map.getTile(-1, -1);
        expect(outTile.type).toBe(VOID);
    });

    it('setTile should update a valid tile', () => {
        const map = new TileMap();
        const newTile: TileState = {
            type: GRASS,
            watered: true,
            cropID: 42,
            growthStage: 2,
        };

        map.setTile(2, 2, newTile);
        expect(map.getTile(2, 2)).toEqual(newTile);
    });

    it('setTile should ignore out-of-bounds', () => {
        const map = new TileMap();
        const invalidTile: TileState = {
            type: GRASS,
            watered: true,
            cropID: 10,
            growthStage: 1,
        };

        map.setTile(-1, -1, invalidTile);
        expect(map.getTile(-1, -1).type).toBe(VOID);
    });
});
