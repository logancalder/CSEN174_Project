// TileMap.ts
// Handles the current farm's tile states

import {DIRT, GRASS, MAP_HEIGHT, MAP_WIDTH, TileState, VOID,} from './constants';
import { TileAssets } from './TileAssets';
import { TileRenderer } from "./TileDrawer";

export class TileMap {
  map: TileState[][];

  constructor() {
    this.map = Array.from(
      { length: MAP_HEIGHT },
      (_: any): TileState[] =>
        Array.from(
          { length: MAP_WIDTH },
          (_: any): TileState => ({
            type: GRASS,
            watered: false,
            cropID: -1,
            growthStage: 0
          }),
        ),
    );

    for (let i: number = 1; i < MAP_WIDTH - 1; i++) {
      for (let j: number = 1; j < MAP_HEIGHT - 1; j++) {
        this.map[j][i].type = DIRT;
      }
    }
  }

  getTile(x: number, y: number): TileState {
    if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) {
      return { type: VOID, watered: false, cropID: -1, growthStage: 0 };
    }
    return this.map[y][x];
  }

  setTile(x: number, y: number, tile: TileState): void {
    if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) {
      return;
    }

    this.map[y][x] = tile;
  }

  saveState(): void {
    localStorage.setItem("tilemap", JSON.stringify(this.map));
  }

  loadState(state: string): boolean {
    try {
      this.map = JSON.parse(state);
      return true;
    } catch (e) {
      console.error('Failed to load state:', e);
      return false;
    }
  }

}
